import { BrowserRouter, Routes, Route } from "react-router-dom"

import { LoginPage } from "./pages/LoginPage/index"
import { HomePage } from "./pages/HomePage/index"
import { TaskEditPage } from "./pages/TaskEditPage/index"
import { ProfilePage } from "./pages/ProfilePage"
import { AddTaskPage } from "./pages/AddTaskPage"
import { CreateAccountPage } from "./pages/CreateAccountPage"
import { EmployeesPage } from "./pages/EmployeesPage"
import { ChoicePage } from "./pages/ChoicePage"
import { AddEmployeePage } from "./pages/AddEmployeePage"
import { DepartmentsPage } from "./pages/DepartmentsPage"
import { AddDepartmentPage } from "./pages/AddDepartmentPage"
import { EmployeePage } from "./pages/EmployeePage"
import { DepartmentPage } from "./pages/DepartmentPage"

import { ToastContainer } from "react-toastify"
import { AuthProvider } from "./context/AuthContext"

import { Dialog } from "./components/Dialog/dialog"
import { DialogContentWrapper } from "./components/Dialog/content"
import { createContext } from "react"

import { useState } from "react"

export const DialogContext = createContext()

function App() {
    const [isDialogOpen, setDialogOpen] = useState(false);

    const openDialog = () => setDialogOpen(true);
    const closeDialog = () => setDialogOpen(false);
    
    return (
        <BrowserRouter>
            <AuthProvider>
                <DialogContext.Provider value={{ isDialogOpen, openDialog, closeDialog }}>
                    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                        <Routes>
                            <Route exact path="/" element={ <LoginPage /> } />
                            <Route exact path="/home" element={ <HomePage /> } />
                            <Route exact path="/edit/:id" element={ <TaskEditPage /> } />
                            <Route exact path="/profile" element={ <ProfilePage /> } />
                            <Route exact path="/add" element={ <AddTaskPage /> } />
                            <Route exact path="/account/create" element={ <CreateAccountPage /> } />

                            <Route exact path="/choose" element={ <ChoicePage /> } />
                            <Route exact path="/employees" element={ <EmployeesPage /> } />
                            <Route exact path="/employees/new" element={ <AddEmployeePage /> } />
                            <Route exact path="/employees/:employeeId" element={ <EmployeePage/> } />

                            <Route exact path="/departments" element={ <DepartmentsPage /> } />
                            <Route exact path="/departments/new" element={ <AddDepartmentPage /> } />
                            <Route exact path="/departments/:departmentId" element={ <DepartmentPage /> } />

                        </Routes>

                        <DialogContentWrapper />
                    </Dialog>
                </DialogContext.Provider>
            
                <ToastContainer
                    position="top-center"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={true}
                    closeOnClick
                    rtl={false}
                    draggable
                    theme="light"
                    pauseOnFocusLoss={false}
                    pauseOnHover={false}
                />
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App