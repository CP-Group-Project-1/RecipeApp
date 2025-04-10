import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../api/useAuth";
import {
AppBar,
Toolbar,
TextField,
Button,
Box,
Stack,
useMediaQuery,
IconButton,
Menu,
MenuItem,
Typography,
Divider,
Switch,
FormControlLabel,
InputAdornment
} from '@mui/material';
import { ExitToApp, Bookmark, ShoppingBasket, AccountCircle, Brightness4, Brightness7} from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import Logo from '../assets/logo.png'

export default function NavBar({ toggleColorMode, mode }) {
const navigate = useNavigate();
const { isAuthenticated, setAuth } = useAuth();
const [searchQuery, setSearchQuery] = useState('');
const [anchorEl, setAnchorEl] = useState(null);
const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
};

const handleMenuClose = () => {
    setAnchorEl(null);
};

const handleProfileClick = () => {
    handleMenuClose();
    navigate('/profile');
};

const handleSearch = () => {
    if (searchQuery.trim()) {
    navigate(`/search`, {
        state: { searchQuery: searchQuery.trim() }
    });
    setSearchQuery('');
    }
};

const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    setAuth(false);
    navigate("/");
    window.location.reload();
};

if (!isAuthenticated) return null;

return (
    <Box sx={{ flexGrow: 1 }}>
    {isMobile ? (
        /* Mobile View (<900px) */
        <>
        <AppBar position="static" color="primary">
            <Toolbar sx={{ 
                flexDirection: 'column',
                gap: 1,
                py: 1,
                px: 2,
                maxWidth: '100%',
                overflow: 'hidden'
            }}>
            <Box sx={{ 
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Box 
                    component="img"
                    src={Logo}
                    alt="Cook n Cart Logo"
                    sx={{ 
                        height: 40,
                        width: 'auto',
                        cursor: 'pointer',
                        maxWidth: 120
                    }}
                    onClick={() => navigate('/')}
                />
                <Stack direction="row" spacing={1}>
                <Button
                    color="inherit"
                    startIcon={<Bookmark />}
                    onClick={() => navigate('/saved')}
                    sx={{ 
                    py: 0, 
                    minWidth: 'auto',
                    '& .MuiButton-startIcon': { margin: 0 }
                    }}
                >
                    Saved
                </Button>
                <Button
                    color="inherit"
                    startIcon={<ShoppingBasket />}
                    onClick={() => navigate('/shoplist')}
                    sx={{ 
                    py: 0, 
                    minWidth: 'auto',
                    '& .MuiButton-startIcon': { margin: 0 }
                    }}
                >
                    Cart
                </Button>
                    <IconButton
                        color="inherit"
                        onClick={toggleColorMode}
                        sx={{ p: 0.5 }}
                    >
                        {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                    </IconButton>
                    <IconButton
                        color="inherit"
                        onClick={handleMenuOpen}
                        sx={{ 
                        fontSize: '0.75rem',
                        minWidth: 'auto',
                        p: 0.5
                        }}
                    >
                        <AccountCircle />
                    </IconButton>
                </Stack>
            </Box>
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                size="small"
                slotProps={{
                    input: {
                        endAdornment: isMobile && (
                            <InputAdornment position="end">
                                <IconButton 
                                    onClick={handleSearch}
                                    edge="end"
                                >
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    },
                }}
                sx={{
                backgroundColor: 'background.paper',
                borderRadius: 1,
                '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                    pr: 1,
                }
                }}
            />
            </Toolbar>
        </AppBar>

        <AppBar position="static" color="secondary">
            <Toolbar sx={{ 
                display: 'flex',
                justifyContent: 'space-between',
                py: 1,
                px: 2,
                maxWidth: '100%',
                overflow: 'hidden'
            }}>
            <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' }, mr: 1 }}>
                Browse By:
                </Typography>
                <Button 
                    color="inherit"
                    onClick={() => navigate('/bycat')}
                    sx={{ 
                        fontSize: '0.85rem', 
                        minWidth: 'max-content',
                        px: 1
                }}
                >
                Category
                </Button>
                <Button 
                    color="inherit"
                    onClick={() => navigate('/byingredient')}
                    sx={{ 
                        fontSize: '0.85rem', 
                        minWidth: 'max-content',
                        px: 1
                }}
                >
                Ingredient
                </Button>
                <Button 
                    color="inherit"
                    onClick={() => navigate('/bycuisine')}
                    sx={{ 
                        fontSize: '0.85rem', 
                        minWidth: 'max-content',
                        px: 1
                }}
                >
                Cuisine
                </Button>
            </Stack>
            
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleProfileClick}>
                <Typography variant="body2">Account Settings</Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <ExitToApp fontSize="small" />
                    <Typography variant="body2">Logout</Typography>
                </Stack>
                </MenuItem>
            </Menu>
            </Toolbar>
        </AppBar>
        </>
    ) : (
        /* Desktop View (≥900px) */
        <Box sx={{ maxWidth: 1440, margin: '0 auto', width: '100%' }}>
        <AppBar position="static" color="primary">
            <Toolbar sx={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr auto auto',
                gap: 3,
                alignItems: 'center',
                padding: '8px 24px !important',
                '& .MuiButton-root': {
                    px: 2,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.2)'
                    }
                }
            }}>
            <Box 
                component="img"
                src={Logo}
                alt="Cook n Cart Logo"
                sx={{ 
                height: 50,
                width: 'auto',
                cursor: 'pointer',
                maxWidth: 160
                }}
                onClick={() => navigate('/')}
            />

            <TextField
                fullWidth
                variant="outlined"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                size="small"
                slotProps={{
                    root: {
                      sx: {
                        backgroundColor: 'background.paper',
                        borderRadius: 1,
                      }
                    },
                    input: {
                      sx: {
                        padding: '3px',
                      },
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="action" />
                        </InputAdornment>
                      ),
                    },
                }}
                sx={{
                mx: 2,
                backgroundColor: 'background.paper',
                borderRadius: 1,
                '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                    paddingLeft: '10px'
                }
                }}
            />

            <Stack direction="row" spacing={2}>
                <Button
                    color="inherit"
                    startIcon={<Bookmark />}
                    onClick={() => navigate('/saved')}
                >
                Saved Recipes
                </Button>
                <Button
                    color="inherit"
                    startIcon={<ShoppingBasket />}
                    onClick={() => navigate('/shoplist')}
                >
                Shopping Cart
                </Button>
            </Stack>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                    color="inherit"
                    onClick={toggleColorMode}
                    sx={{ ml: 1 }}
                >
                {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
                <IconButton
                    color="inherit"
                    onClick={handleMenuOpen}
                    size="large"
                >
                <AccountCircle />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                <MenuItem onClick={handleProfileClick}>
                    <Typography variant="body1">Account Settings</Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                    <Stack direction="row" spacing={1} alignItems="center">
                    <ExitToApp fontSize="small" />
                    <Typography variant="body1">Logout</Typography>
                    </Stack>
                </MenuItem>
                </Menu>
            </Box>
            </Toolbar>
        </AppBar>

        <AppBar position="static" color="secondary">
            <Toolbar sx={{
                justifyContent: 'space-between',
                padding: '8px 24px !important'
            }}>
            <Stack direction="row" spacing={3} alignItems="center">
                <Typography variant="body1" sx={{ mr: 1 }}>
                Browse Recipes By:
                </Typography>
                <Button 
                    color="inherit"
                    onClick={() => navigate('/bycat')}
                    sx={{ px: 3 }}
                >
                Category
                </Button>
                <Button 
                    color="inherit"
                    onClick={() => navigate('/byingredient')}
                    sx={{ px: 3 }}
                >
                Ingredient
                </Button>
                <Button 
                    color="inherit"
                    onClick={() => navigate('/bycuisine')}
                    sx={{ px: 3 }}
                >
                Cuisine
                </Button>
            </Stack>
            </Toolbar>
        </AppBar>
        </Box>
    )}
    </Box>
);
}