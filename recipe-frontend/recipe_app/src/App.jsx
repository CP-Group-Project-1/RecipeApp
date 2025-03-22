import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import Home from './pages/Home';
import Signup from './pages/Signup';
import ByCat from './pages/ByCat';
import ByIngredient from './pages/ByIngredient';
import ByCuisine from './pages/ByCuisine';
import RecipePage from './pages/RecipePage';
import SavedRecipes from './pages/SavedRecipes';
import NavBar from './components/NavBar';
import ShoppingList from './pages/ShoppingList';

function App() {


  return (
    <>
    <BrowserRouter>
    <NavBar />
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<Home />} />
      <Route path="/bycat" element={<ByCat />} />
      <Route path="/byingredient" element={<ByIngredient />} />
      <Route path="/bycuisine" element={<ByCuisine />} />
      <Route path="/recipe/:idMeal" element={<RecipePage />} />
      <Route path="/saved" element={<SavedRecipes />} />
      <Route path="/shoplist" element={<ShoppingList />} />
    </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;

