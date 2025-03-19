import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();
    
    return (
        <>
        <h2>Home Page</h2>

        {/* Will remove once we create a NavBar */}
        <button onClick={() => navigate('/login')}>
            Login
        </button> 

        <button onClick={() => navigate('/signup')} style={{ marginLeft: "10px"  }}>
            Sign Up
        </button>

        <div>
            <h2>Search Recipe by:</h2>
            <button onClick={() => navigate('/bycat')}>
                Category
            </button> 

            <button onClick={() => navigate('/byingredient')}>
                Ingredient
            </button> 

            <button onClick={() => navigate('/bycuisine')}>
                Cuisines
            </button> 
        </div>
        </>
    )
}