import React, { useState } from "react";
import { postEmail } from "../../api/AuthApi"; // Assuming postEmail is correctly defined in AuthApi

const EmailShoppingListButton = ({ token, baseUrl }) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSendEmail = async () => {
        setLoading(true);
        setMessage("");
        console.log("Sending email...");
    
        const response = await postEmail(token, baseUrl);
        console.log("Response from API:", response);  // Log the response
    
        if (response.success) {
            setMessage("Shopping list has been sent to your email!");
        } else {
            setMessage(`Error: ${response.error}`);
        }
    
        setLoading(false);
    };
    

    return (
        <div>
            <button onClick={handleSendEmail} disabled={loading}>
                {loading ? "Sending..." : "Send Shopping List to Email"}
            </button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default EmailShoppingListButton;
