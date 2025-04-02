import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Alert,
  Divider,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../../api/useAuth';
import { basicFetch} from '../../api/AuthApi';

export default function Profile({ base_url }) {
    const navigate = useNavigate();
    const { isAuthenticated, setAuth } = useAuth();
    const [userData, setUserData] = useState(null);
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState({
        profile: false,
        password: false,
        delete: false
    });
    

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(prev => ({ ...prev, profile: true }));
                setError('');
                
                const token = localStorage.getItem('token');
                
                const response = await basicFetch(`${base_url}/user_accounts/user/single_user/`, 
                    {
                        method: "GET",
                        headers: {
                        "Authorization": `Token ${token}`,
                        "Content-Type": "application/json"
                        }
                    }
                );
                if (response.email) {
                    setUserData(response);
                } else {
                    throw new Error('Failed to fetch user data');
                }
            } catch (err) {
                setError(err.message || 'Failed to fetch user data');
            } finally {
                setLoading(prev => ({ ...prev, profile: false}));
            }
        };
        fetchUserData();
    }, [base_url]);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        
        // Validate passwords match
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('New passwords do not match');
            return;
        }
    
        try {
            setLoading(prev => ({ ...prev, password: true }));
            setError('');
            setSuccess('');
            
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('user_id');
    
            // First verify old password by making a login request
            try {
                const verifyResponse = await basicFetch(`${base_url}/user_accounts/get-token`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username: userData.email,
                        password: passwordData.oldPassword
                    })
                });
    
                if (!verifyResponse.token) {
                    throw new Error('Current password is incorrect');
                }
            } catch (verifyErr) {
                throw new Error('Current password is incorrect');
            }
    
            // If old password is correct, update to new password
            const updateResponse = await basicFetch(`${base_url}/user_accounts/user/${userId}/`, {
                method: "PUT",
                headers: {
                    "Authorization": `Token ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    password: passwordData.newPassword
                })
            });

            
            console.log("updateResponse");
            console.log(updateResponse);
            if (typeof updateResponse === 'string' && updateResponse.includes('UPDATED')) {
                setSuccess('Password changed successfully. Please login again.');
                // Clear auth state and force reload
                localStorage.removeItem('token');
                localStorage.removeItem('user_id');
                setAuth(false);
                //setTimeout(()=> window.location.href = '/auth', 1500);
            } else {
                throw new Error('Password update failed. Please try again.');
            }
        } catch (err) {
            setError(err.message || 'An error occurred while changing password');
        } finally {
            setLoading(prev => ({ ...prev, password: false }));
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm('Are you sure you want to permanently delete your account?')) return;
    
        try {
            setLoading(prev => ({ ...prev, delete: true }));
            setError('');
            
            const userId = localStorage.getItem('user_id');
            const token = localStorage.getItem('token');
            
            const response = await basicFetch(`${base_url}/user_accounts/user/${userId}/`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Token ${token}`,
                    "Content-Type": "application/json"
                }
            });
            
            
            if (typeof response === 'string' && response.includes('removed')) {
                // Clean up and redirect
                localStorage.removeItem('token');
                localStorage.removeItem('user_id');
                setAuth(false);
                navigate('/auth');
                window.location.href = '/auth';
            } else {
                throw new Error('Failed to delete account');
            }
            } catch (err) {
                setError(err.message || 'Failed to delete account');
            } finally {
                setLoading(prev => ({ ...prev, delete: false }));
            }
      };
    
      if (loading.profile) {
        return (
            <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Container>
        );
      }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
            Account Settings
        </Typography>

        {userData && (
            <Box mb={4}>
                <Typography variant="h7">Username: {userData.email}</Typography>
            </Box>
        )}

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" gutterBottom>
            Change Password
        </Typography>
        
        <Box component="form" onSubmit={handlePasswordChange} sx={{ mb: 4 }}>
            <TextField
            label="Current Password"
            type="password"
            fullWidth
            margin="normal"
            value={passwordData.oldPassword}
            onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
            required
            />
            
            <TextField
            label="New Password"
            type="password"
            fullWidth
            margin="normal"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
            required
            />
            
            <TextField
            label="Confirm New Password"
            type="password"
            fullWidth
            margin="normal"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
            required
            />

            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}

            <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            sx={{ mt: 2 }}
            disabled={loading.password}
            >
            {loading.password ? <CircularProgress size={24} /> : 'Change Password'}
            </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box>
            <Typography variant="h5" gutterBottom color="error">
            Danger Zone
            </Typography>
            <Button 
                variant="contained" 
                color="error"
                onClick={handleDeleteAccount}
                disabled={loading.delete}
                starticon={loading.delete ? <CircularProgress size={20} color="inherit" /> : null}
            >
                {loading.delete ? 'Deleting...' : 'Delete Account Permanently'}
            </Button>
            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                This action cannot be undone. All your data will be permanently deleted.
            </Typography>
        </Box>
        </Container>
    );
    }