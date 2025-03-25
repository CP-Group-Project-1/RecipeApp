import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute';
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

  // vite_url used if set else it uses api
  const base_url = import.meta.env.VITE_BASE_URL || "/api/v1"
  console.log('In_APP')
  console.log(`base_url = [${base_url}]`)

  return (
    <>
    <BrowserRouter>
    <NavBar />
    <Routes>
      <Route path="/login" element={<Login base_url={base_url}/>} />
      <Route path="/signup" element={<Signup base_url={base_url}/>} />
      <Route path="/" element={<Home />} />
      <Route element={<ProtectedRoute/>}>
        <Route path="/bycat" element={<ByCat />} />
        <Route path="/byingredient" element={<ByIngredient />} />
        <Route path="/bycuisine" element={<ByCuisine />} />
        <Route path="/recipe/:idMeal" element={<RecipePage base_url={base_url}/>} />
        <Route path="/saved" element={<SavedRecipes base_url={base_url}/>} />
        <Route path="/shoplist" element={<ShoppingList />} />
      </Route>
    </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;

