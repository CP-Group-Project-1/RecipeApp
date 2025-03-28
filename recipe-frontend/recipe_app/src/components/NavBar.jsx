import { useAuth } from "../../api/useAuth"
import { logout } from "../../api/AuthApi"
import { useNavigate } from "react-router-dom";
import AuthButton from "./AuthButton";
import { useState, useEffect } from "react";
import Search from "./Search";
import { 
    AppBar, 
    Toolbar, 
    Typography, 
    Button, 
    ButtonGroup,
    IconButton,
    Box
  } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';


export default function NavBar() {
    const navigate = useNavigate();
    const { isAuthenticated, setAuth } = useAuth();
    const [visible, setVisible] = useState(isAuthenticated);

    useEffect(() => {
        setVisible(isAuthenticated);
    }, [isAuthenticated]);

    const handleLogout = () => {
        logout(setAuth);
        navigate("/");
        window.location.reload();
    };

    if (!visible) return null;

   

    return (
        // <div style={{ padding: "10px"}}>
        //     <AuthButton />
        //     <button onClick={() => navigate('/')}>Home</button> 
        //     <button onClick={() => navigate('/saved')}>Saved</button>
        //     <button onClick={() => navigate('/shoplist')}>Shopping List</button> 
            
        //     <Search />
            
        //     <div style={{ float: "right" }}>
        //         <button onClick={handleLogout}>Logout</button>
        //     </div>
        // </div>
        <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
            <Toolbar>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={() => navigate('/')}
            >
                <MenuIcon />
            </IconButton>
            
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Cook n Cart
            </Typography>

            <ButtonGroup variant="text" color="inherit" sx={{ mr: 2 }}>
                <Button onClick={() => navigate('/saved')}>Saved</Button>
                <Button onClick={() => navigate('/shoplist')}>Shopping List</Button>
            </ButtonGroup>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="subtitle1">Search Recipe by:</Typography>
                <ButtonGroup variant="text" color="inherit">
                <Button onClick={() => navigate('/bycat')}>Category</Button>
                <Button onClick={() => navigate('/byingredient')}>Ingredient</Button>
                <Button onClick={() => navigate('/bycuisine')}>Cuisine</Button>
                </ButtonGroup>
            </Box>

            <Box sx={{ flexGrow: 1 }} /> {/* Spacer */}

            <Button 
                color="inherit" 
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
            >
                Logout
            </Button>
            </Toolbar>
        </AppBar>
        </Box>
    );
}
