import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, basicFetch } from "../../api/AuthApi";
import { useAuth } from "../../api/useAuth";

export default function Login({base_url}) {
    //console.log('IN_Login_Page')
    const navigate = useNavigate();
    
    // adding setAuth
    const { setAuth } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isEmailTouched, setIsEmailTouched] = useState(false);

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        
        // Clear error when user types
        if (error) setError("");

    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        if (name === "email") {
            setIsEmailTouched(true);
            if (!validateEmail(value)) {
                setError("Invalid email format.");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateEmail(formData.email)) {
            setError("Invalid email format.");
            return;
        }

        setIsLoading(true);
        setError(""); // clear previous errors

        try {
            //console.log('Attempting to get user token')
            const response = await login(formData, base_url);
            if (response.token && response.success) {
              localStorage.setItem("token", response.token);
              //console.log(response);
              
              //Getting user_id
              //console.log('Getting user_id');

              const token = response.token
              //const singleUserEp = `${base_url}user_accounts/user/`
              const singleUserEp = `${base_url}/user_accounts/user/single_user/`;
                // console.log(`singleuserEp = ${singleUserEp}`);
              const userPayload = {
                method: "GET",
                headers:{
                "Content-Type": "application/json",
                "Authorization": `Token ${token}`
              }
              //body: JSON.stringify(data)
              }
              //console.log(`Hitting Endpoint = [${singleUserEp}]`);
              const userBody = await basicFetch(singleUserEp, userPayload);
              //console.log(userBody);
              //console.log(`user_id = [${userBody.id}]`);
              localStorage.setItem("user_id", userBody.id);
                
              // adding setAuth
              setAuth(true);
              // edit navigate
              navigate("/", { replace: true });
            } else {
                // Handle specific error cases
                setError(response.error );
            }
        } catch (err) {
            setError("Login failed. Please check your connection and try again.");
            console.error("Login error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <h2>Login</h2>
            <br></br>
            <form onSubmit={handleSubmit} method="POST">
                <div>
                    <label>Username</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className={error && !validateEmail(formData.email) ? "error" : ""}
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}
                <div className="form-actions">
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="submit-button"
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner"></span>
                                Logging in...
                            </>
                        ) : "Login"}
                    </button>
                </div>
            </form>
        </>
    );
}