import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../../api/AuthApi"; 

export default function Signup() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isEmailTouched, setIsEmailTouched] = useState(false);
    const [isConfirmPasswordTouched, setIsConfirmPasswordTouched] = useState(false);

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };
    
    const validatePassword = (password) => {
        return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(password);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));

        if (name === "email" && error) {
            setError("");
        }
        if (name === "confirmPassword" && error) {
            setError("");
        }
    };
    
    const handleBlur = (e) => {
        const { name, value } = e.target;
    
        // Validate email only when the field loses focus
        if (name === "email") {
            setIsEmailTouched(true);
            if (!validateEmail(value)) {
                setError("Invalid email format.");
            } else {
                setError("");
            }
        }
    
        // Validate confirm password only when the field loses focus
        if (name === "confirmPassword") {
            setIsConfirmPasswordTouched(true);
            if (value !== formData.password) {
                setError("Passwords do not match.");
            } else {
                setError("");
            }
        }
    };

    const validateForm = () => {
        const { name, email, password, confirmPassword } = formData;
        
        if (![name, email, password, confirmPassword].every(Boolean)) 
            return "All fields are required";
        if (!validateEmail(email)) 
            return "Invalid email format (example@domain.com)";
        if (!validatePassword(password)) 
            return "Password must be at least 8 characters, include a number, and a special character";
        if (password !== confirmPassword) 
            return "Passwords do not match";
    
        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const errorMessage = validateForm();
        if (errorMessage) {
            setError(errorMessage);
            return;
        }
        setIsLoading(true);

        try {
            const response = await signup(formData);
            if (response.success) {
                navigate("/login");
            } else {
                setError(response.error || "Signup failed. Please try again.");
            }
        } catch (err) {
            setError("Signup failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit} method="POST">
                <div>
                    <label>Name</label>
                    <input 
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Name"
                        required
                    />
                </div>
                <div>
                    <label>
                        Email (example@domain.com)
                    </label>
                    <input 
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Email"
                        required
                    />
                </div>
                <div>
                    <label>
                        Password (min 8 chars, number, special char)
                    </label>
                    <input 
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        required
                    />
                </div>
                <div>
                    <label>Confirm Password</label>
                    <input 
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Confirm Password"
                        required
                    />
                </div>
                {(isEmailTouched || isConfirmPasswordTouched) && error && <p>{error}</p>}
                <div>
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "Signing up..." : "Sign Up"}
                    </button>
                    <button type="button" onClick={() => navigate('/')}>
                        Cancel
                    </button>
                </div>
            </form>
        </>
    );
}