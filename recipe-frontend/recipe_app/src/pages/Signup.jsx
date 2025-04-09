import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../../api/AuthApi";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Grid,
  Link
} from "@mui/material";
import { styled } from "@mui/system";

const FormPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 500,
  margin: "auto",
  marginTop: theme.spacing(4)
}));

export default function Signup({ base_url }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8 && 
           /\d/.test(password) && 
           /[!@#$%^&*(),.?":{}|<>]/.test(password);
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

    switch (name) {
      case "email":
        newErrors.email = !validateEmail(value);
        break;
      case "password":
        newErrors.password = !validatePassword(value);
        break;
      case "confirmPassword":
        newErrors.confirmPassword = value !== formData.password;
        break;
    }

    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {
      name: !formData.name,
      email: !validateEmail(formData.email),
      password: !validatePassword(formData.password),
      confirmPassword: formData.password !== formData.confirmPassword,
    };

    setErrors(newErrors);

    if (newErrors.name) return "Name is required";
    if (newErrors.email) return "Invalid email format";
    if (newErrors.password) return "Password must be 8+ chars with a number and special character";
    if (newErrors.confirmPassword) return "Passwords don't match";

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
      const response = await signup(base_url, formData);
      if (response.success) {
        navigate("/", { replace: true });
      } else {
        setErrorMessage(response.error || "Signup failed. Please try again.");
      }
    } catch (err) {
      setErrorMessage("Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <FormPaper elevation={3}>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          Create Account
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
            id="name"
            label="Full Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            helperText={errors.name && "Please enter your name"}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
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
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.password}
            helperText={errors.password ? 
              "Must be 8+ chars with number & special character" : 
              "At least 8 characters with number & special character"}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.confirmPassword}
            helperText={errors.confirmPassword && "Passwords don't match"}
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
              "Sign Up"
            )}
          </Button>

        </Box>
      </FormPaper>
    </Container>
  );
}