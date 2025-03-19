import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import Home from './pages/Home';
import Signup from './pages/Signup';
import ByCat from './pages/ByCat';
import ByIngredient from './pages/ByIngredient';
import ByCuisine from './pages/ByCuisine';
import RecipePage from './pages/RecipePage';

function App() {


  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<Home />} />
      <Route path="/bycat" element={<ByCat />} />
      <Route path="/byingredient" element={<ByIngredient />} />
      <Route path="/bycuisine" element={<ByCuisine />} />
      <Route path="/recipe/:idMeal" element={<RecipePage />} />
    </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;

