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
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { useAuth } from '../../api/useAuth';
import { basicFetch} from '../../api/AuthApi';

export default function Profile({ base_url }) {
    const navigate = useNavigate();
    const { isAuthenticated, setAuth } = useAuth();
    const [userData, setUserData] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [emailData, setEmailData] = useState({
        email: '',
        password: ''
    })
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState({
        profile: false,
        email: false,
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
                    setEmailData(prev => ({...prev, email: response.email}));
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

    const handleEmailChange = async (e) => {
        e.preventDefault();
        
        if (!emailData.password) {
            setError('Please enter your password to confirm email change');
            return;
        }

        try {
            setLoading(prev => ({ ...prev, email: true }));
            setError('');
            setSuccess('');
            
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('user_id');

            // First verify password by making a login request
            try {
                const verifyResponse = await basicFetch(`${base_url}/user_accounts/get-token`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username: userData.email,
                        password: emailData.password
                    })
                });

                if (!verifyResponse.token) {
                    throw new Error('Password is incorrect');
                }
            } catch (verifyErr) {
                throw new Error('Password is incorrect');
            }

            // If password is correct, update email
            const updateResponse = await basicFetch(`${base_url}/user_accounts/user/${userId}/`, {
                method: "PUT",
                headers: {
                    "Authorization": `Token ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: emailData.email
                })
            });

            if (typeof updateResponse === 'string' && updateResponse.includes('UPDATED')) {
                setSuccess('Email updated successfully. Please login again.');
                // Clear auth state and force reload
                localStorage.removeItem('token');
                localStorage.removeItem('user_id');
                setAuth(false);
                setTimeout(() => window.location.href = '/auth', 1500);
            } else {
                throw new Error('Email update failed. Please try again.');
            }
        } catch (err) {
            setError(err.message || 'An error occurred while changing email');
        } finally {
            setLoading(prev => ({ ...prev, email: false }));
            setEditMode(false);
        }
    };

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
                setTimeout(()=> window.location.href = '/auth', 1500);
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
    const handleDeleteClick = () => {
        setOpenDeleteDialog(true);
    };
    
    const handleDeleteConfirm = async () => {
        setOpenDeleteDialog(false);
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
      
    const handleDeleteCancel = () => {
        setOpenDeleteDialog(false);
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Account Settings
            </Typography>

            <Box mb={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h5" gutterBottom>
                    Email Address
                </Typography>
                
                {editMode ? (
                    <Box component="form" onSubmit={handleEmailChange} sx={{
                        width: '100%',
                        maxWidth: 500,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                        }}>
                        <TextField
                            label="New Email"
                            type="email"
                            fullWidth
                            margin="normal"
                            value={emailData.email}
                            onChange={(e) => setEmailData({...emailData, email: e.target.value})}
                            required
                            sx={{ maxWidth: 400 }}
                        />
                        <TextField
                            label="Confirm Password"
                            type="password"
                            fullWidth
                            margin="normal"
                            value={emailData.password}
                            onChange={(e) => setEmailData({...emailData, password: e.target.value})}
                            required
                            sx={{ maxWidth: 400 }}
                        />
                        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                            <Button 
                                type="submit" 
                                variant="contained" 
                                color="primary"
                                disabled={loading.email}
                            >
                                {loading.email ? <CircularProgress size={24} /> : 'Save Email'}
                            </Button>
                            <Button 
                                variant="outlined" 
                                onClick={() => {
                                    setEditMode(false);
                                    setError('');
                                    setEmailData({...emailData, email: userData.email, password: ''});
                                }}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                ) : (
                    <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        width: '100%',
                        flexWrap: 'wrap' // Allows wrapping on small screens
                        }}>
                        <Typography 
                            variant="body1" 
                            sx={{ 
                            fontWeight: 500,
                            color: 'text.secondary',
                            mr: 0.5
                            }}
                        >
                            Current Email:
                        </Typography>
                        <Box sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            backgroundColor: 'action.hover',
                            px: 1.5,
                            py: 1,
                            borderRadius: 1
                        }}>
                            <Typography 
                            variant="body1" 
                            sx={{ 
                                fontSize: '1.1rem',
                                minWidth: 200,
                                textAlign: 'center',
                                px: 1
                            }}
                            >
                            {userData?.email}
                            </Typography>
                            <Button 
                            variant="outlined" 
                            onClick={() => setEditMode(true)}
                            sx={{ height: 32, minWidth: 80 }}
                            >
                            Edit
                            </Button>
                        </Box>
                        </Box>
                )}
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
                Change Password
            </Typography>
            
            <Box component="form" onSubmit={handlePasswordChange} sx={{ 
                mb: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <TextField
                    label="Current Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={passwordData.oldPassword}
                    onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                    required
                    sx={{ maxWidth: 400 }}
                />
                
                <TextField
                    label="New Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    required
                    sx={{ maxWidth: 400 }}
                />
                
                <TextField
                    label="Confirm New Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    required
                    sx={{ maxWidth: 400 }}
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
                    onClick={handleDeleteClick}
                    disabled={loading.delete}
                    startIcon={loading.delete ? <CircularProgress size={20} color="inherit" /> : null}
                >
                {loading.delete ? 'Deleting...' : 'Delete Account Permanently'}
                </Button>
                <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                    This action cannot be undone. All your data will be permanently deleted.
                </Typography>
            </Box>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={openDeleteDialog}
                onClose={handleDeleteCancel}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" color="error">
                {"Confirm Account Deletion"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to permanently delete your account? This action cannot be undone.
                        All your recipes, shopping lists, and personal data will be erased immediately.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} color="primary">
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleDeleteConfirm} 
                        color="error"
                        autoFocus
                        variant="contained"
                    >
                        Delete My Account
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}