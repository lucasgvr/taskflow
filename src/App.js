import { BrowserRouter, Routes, Route } from "react-router-dom"

import { Login } from "./pages/LoginPage/index";
import { Home } from "./pages/HomePage/index";
import { TaskEditPage } from "./pages/TaskEditPage/index";
import { ProfilePage } from "./pages/ProfilePage";
import { AddTaskPage } from "./pages/AddTaskPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={ <Login /> } />
        <Route exact path="/home" element={ <Home /> } />
        <Route exact path="/edit/:id" element={ <TaskEditPage /> } />
        <Route exact path="/profile" element={ <ProfilePage /> } />
        <Route exact path="/add" element={ <AddTaskPage /> } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
