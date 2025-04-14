import { useNavigate } from "react-router-dom";
import { useAuth } from "../../api/useAuth";
import RandomRecipe from "../components/RandomRecipe";
import LogoComponent from "../components/Logo";


export default function Home() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    return (
        <div style={{ padding: "20px" }}>
            <h2 className="selected-title1" 
            style={{marginBottom:"-15px", marginTop:"5px"}}
            >Welcome to Cook n Cart</h2>
            <LogoComponent className="home-logo" />
            {/* The following is needed for to see login/signup */}
            {!isAuthenticated ? (
                <div style={{ textAlign: "center", marginTop: "40px" }}>
                    <p>Please login or sign up to access all features</p>
                    <button 
                        onClick={() => navigate('/auth')}
                        style={{ marginTop: "20px", padding: "10px 20px" }}
                    >
                        Login / Sign Up
                    </button>
                </div>
            ) : (
                <>
                <div className="home-container">
                    <h3>
                    Discover delicious recipes by searching through categories, ingredients, or cuisines.
                    </h3>
                    <p>
                    <strong>Cook n Cart</strong> provides a unique feature that allows you to seamlessly add the ingredients from any recipe to your personalized shopping list. Once you're ready, you can even email the list to yourself for easy access while you're at the store.
                    </p>
                    <p style={{ fontSize:"25px", marginBottom:"-5px", fontStyle:"oblique"}} ><strong>Happy cooking!</strong></p>
                    <hr></hr>
                </div>

                    <h2 className="selected-title1"
                    style={{
                        fontSize:"35px", 
                        marginTop:"-10px", 
                        textAlign:"left",
                        marginLeft: "10px"
                    }}
                    >
                        Try something new!
                        </h2>
                    <div className="recipe-list2">
                        <RandomRecipe />
                        <RandomRecipe />
                        <RandomRecipe />
                        <RandomRecipe />
                        <RandomRecipe />
                        <RandomRecipe />
                    </div>
                </>
            )}
        </div>
    )
}
