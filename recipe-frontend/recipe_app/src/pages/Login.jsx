import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, basicFetch } from "../../api/AuthApi";
import { useAuth } from "../../api/useAuth";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";

const FormPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 500,
  margin: "auto",
  marginTop: theme.spacing(4)
}));

export default function Login({ base_url }) {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: false,
    password: false,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear specific error when typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
    if (errorMessage) setErrorMessage("");
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let newErrors = { ...errors };

    if (name === "email") {
      newErrors.email = !validateEmail(value);
    }

    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {
      email: !validateEmail(formData.email),
      password: !formData.password,
    };

    setErrors(newErrors);

    if (newErrors.email) return "Invalid email format";
    if (newErrors.password) return "Password is required";

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await login(formData, base_url);
      
      if (response.token) {
        localStorage.setItem("token", response.token);
        
        // Get user ID
        const userResponse = await basicFetch(`${base_url}/user_accounts/user/single_user/`, {
          method: "GET",
          headers: {
            "Authorization": `Token ${response.token}`,
            "Content-Type": "application/json"
          }
        });
        
        localStorage.setItem("user_id", userResponse.id);
        setAuth(true);
        navigate("/", { replace: true });
      } else {
        // Handle specific error cases
        if (response.error && response.error.toLowerCase().includes("password")) {
          setErrorMessage("Invalid password. Please try again.");
        } else if (response.error && response.error.toLowerCase().includes("user")) {
          setErrorMessage("No account found with this email.");
        } else {
          setErrorMessage(response.error || "Login failed. Please try again.");
        }
      }
    } catch (err) {
      setErrorMessage("Unable to connect to server. Please try again later.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <FormPaper elevation={3}>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          Sign In
        </Typography>
        
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMessage}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email}
            helperText={errors.email ? "Invalid email format" : "example@domain.com"}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            helperText={errors.password && "Password is required"}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Sign In"
            )}
          </Button>
        </Box>
      </FormPaper>
    </Container>
  );
}