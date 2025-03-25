import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, basicFetch } from "../../api/AuthApi";

export default function Login({base_url}) {
    //console.log('IN_Login_Page')
    const navigate = useNavigate();

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

        if (name === "email" && error) {
            setError("");
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        if (name === "email") {
            setIsEmailTouched(true);
            if (!validateEmail(value)) {
                setError("Invalid email format.");
            } else {
                setError("");
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

        try {
            //console.log('Attempting to get user token')
            const response = await login(formData, base_url);
            if (response.token) {
              localStorage.setItem("token", response.token);
              //console.log(response);
              
              //Getting user_id
              //console.log('Getting user_id');

              const token = response.token
              //const singleUserEp = `${base_url}user_accounts/user/`
              const singleUserEp = `${base_url}/user_accounts/user/single_user/`;

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
                
              //
              navigate("/");
            } else {
                setError(response.error || "Login failed. Please try again.");
            }
        } catch (err) {
            setError("Login failed. Please try again.");
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
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
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
                {isEmailTouched && error && <p>{error}</p>}
                <div>
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "Logging in..." : "Submit"}
                    </button>
                    <button onClick={() => navigate('/')}>
                        Cancel
                    </button>
                </div>
            </form>
        </>
    );
}