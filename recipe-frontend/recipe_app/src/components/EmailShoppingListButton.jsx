import React, { useState } from "react";
import { postEmail } from "../../api/AuthApi"; 
import { toast } from "react-toastify";


const EmailShoppingListButton = ({ token, baseUrl }) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSendEmail = async () => {
        console.log(token)
        setLoading(true);
        setMessage("");
        console.log("Sending email...");
    
        const response = await postEmail(token, baseUrl);
        console.log("Response from API:", response); 
    
        if (response.success) {
             toast.success("Shopping list sent!");
        } else {
             toast.success(`Error: ${response.error}`);
        }
    
        setLoading(false);
    };
    

    return (
        <div>
            <button onClick={handleSendEmail} disabled={loading}>
                {loading ? "Sending..." : "Send to Email"}
            </button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default EmailShoppingListButton;
