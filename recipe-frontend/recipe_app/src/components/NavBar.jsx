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
  useMediaQuery
} from '@mui/material';
import { ExitToApp, Bookmark, ShoppingBasket } from '@mui/icons-material';
import Logo from '../assets/logo.png'

export default function NavBar() {
  const navigate = useNavigate();
  const { isAuthenticated, setAuth } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
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
                  /*src="/src/assets/logo.png"*/
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
                sx={{
                  backgroundColor: 'background.paper',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1
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
              <Stack direction="row" spacing={2}>
                <Button 
                  color="inherit"
                  onClick={() => navigate('/bycat')}
                  sx={{ 
                    fontSize: '0.75rem', 
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
                    fontSize: '0.75rem', 
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
                    fontSize: '0.75rem', 
                    minWidth: 'max-content',
                    px: 1
                  }}
                >
                  Cuisine
                </Button>
              </Stack>
              <Button
                color="inherit"
                startIcon={<ExitToApp />}
                onClick={handleLogout}
                sx={{ 
                  fontSize: '0.75rem',
                  minWidth: 'auto',
                  '& .MuiButton-startIcon': { margin: 0 }
                }}
              >
                Logout
              </Button>
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
              gap: 2,
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
                /*src="/src/assets/logo.png"*/
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
                variant="outlined"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                size="small"
                sx={{
                  mx: 2,
                  backgroundColor: 'background.paper',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1
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

              <Button
                color="inherit"
                startIcon={<ExitToApp />}
                onClick={handleLogout}
                sx={{ ml: 'auto !important' }}
              >
                Logout
              </Button>
            </Toolbar>
          </AppBar>

          <AppBar position="static" color="secondary">
            <Toolbar sx={{
              justifyContent: 'center',
              gap: 4,
              padding: '8px 24px !important'
            }}>
              <Stack direction="row" spacing={3}>
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