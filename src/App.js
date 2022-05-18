import { BrowserRouter, Routes, Route } from "react-router-dom"

import { Login } from "./pages/LoginPage/index";
import { Home } from "./pages/HomePage/index";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={ <Home /> } />
        <Route exact path="/login" element={ <Login /> } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
