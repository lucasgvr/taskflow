import { BrowserRouter, Routes, Route } from "react-router-dom"

import { LoginPage } from "./pages/LoginPage/index";
import { HomePage } from "./pages/HomePage/index";
import { TaskEditPage } from "./pages/TaskEditPage/index";
import { ProfilePage } from "./pages/ProfilePage";
import { AddTaskPage } from "./pages/AddTaskPage";
import { CreateAccountPage } from "./pages/CreateAccountPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={ <LoginPage /> } />
                <Route exact path="/home" element={ <HomePage /> } />
                <Route exact path="/edit/:id" element={ <TaskEditPage /> } />
                <Route exact path="/profile" element={ <ProfilePage /> } />
                <Route exact path="/add" element={ <AddTaskPage /> } />
                <Route exact path="/account/create" element={ <CreateAccountPage /> } />
            </Routes>
        </BrowserRouter>
    )
}

export default App