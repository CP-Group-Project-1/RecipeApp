import { useAuth } from "../../api/useAuth";
import { useNavigate } from "react-router-dom";

export default function Search() {
    const isAuthenticated = useAuth();
    const navigate = useNavigate();

    return (
        <>
            {isAuthenticated && (
                <>
                    <button onClick={() => navigate('/saved')}>
                        Saved
                    </button>

                    <button onClick={() => navigate('/shoplist')}>
                        Shopping List
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
            )}
        </>
    );
}
