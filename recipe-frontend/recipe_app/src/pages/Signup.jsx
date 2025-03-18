import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmpassword: ""
    });
    const [error, setError] = useState("");

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };
    
    const validatePassword = (password) => {
        return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(password);
    };

    const handleChange = (e) => {
        setFormData(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
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
    
        return ""; // No errors
      };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const errorMessage = validateForm();
        if (errorMessage) return setError(errorMessage);

        console.log("Signup submitted", formData);
        setError("");
        navigate("/login");
    };

    return (
        <div>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit} >
                <div>
                    <label>Name</label>
                    <input 
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Name"
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
                        placeholder="Email"
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
                    />
                </div>
                <div>
                    <lable>Confirm Password</lable>
                    <input 
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm Password"
                    />
                </div>
                {error && <p>{error}</p>}
                <div>
                    <button type="submit">Sign Up</button>
                    <button type="button" onClick={() => navigate('/')}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
      );

}