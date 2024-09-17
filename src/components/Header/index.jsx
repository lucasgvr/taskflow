import backArrowImg from "../../assets/arrow.svg"

import { Button } from '../Button/index'

import { Box, Text } from '@chakra-ui/react'

import { Link, Navigate, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth"

import { IoMdNotifications } from "react-icons/io";

import "./styles.scss"

import DefaultImg from "../../assets/default.png"
import { useEffect } from "react";
import { db } from "../../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { DialogTrigger } from "../Dialog/dialog";

export function Header() {
    const { currentUser, setUser } = useAuth()

    const navigate = useNavigate()

    const fetchUserData = async () => {
        if(currentUser) {
            const docRef = doc(db, 'employees', currentUser.uid)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                const data = docSnap.data()
                setUser({
                    ...currentUser,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    phone: data.phone,
                    password: data.password,
                    role: data.role,
                })
            }
        }
    }

    useEffect(() => {
       fetchUserData()
    //eslint-disable-next-line
    }, [currentUser,])

    const navigateToProfile = () => {
        navigate(`/employees/${currentUser.id}`)
        window.location.reload()
    }

    const location = useLocation()

    if (!currentUser) {
        return <Navigate to="/" replace />;
    }

    let linkPath
    
    if (location.pathname.startsWith('/employees/')) {
        linkPath = '/employees';
    } else if (location.pathname.startsWith('/departments/')) {
        linkPath = '/departments';
    } else {
        linkPath = '/home';
    }

    return (
        <>
            <header id="header">
                <div className="headerContainer">
                    <div>
                        <div className="buttonContainer">
                            <Link className="backButton" to={linkPath}>
                                <img src={ backArrowImg } alt="" />
                            </Link>
                            {currentUser.role === 'supervisor' && (
                                <Box className='buttons' display='flex'>
                                    <Button>
                                        <Link display='flex' justifyContent='center' alignItems='center' to='/employees'>
                                            <Text>Funcionários</Text>
                                        </Link>
                                    </Button>
                                    <Button>
                                        <Link display='flex' justifyContent='center' alignItems='center' to='/departments'>
                                            <Text>Departamentos</Text>
                                        </Link>
                                    </Button>
                                </Box>
                            )}
                        </div>
                        <div className="profileContainer">
                            <div className="relative flex justify-end">
                                <DialogTrigger asChild>
                                    <IoMdNotifications size={24} className="cursor-pointer text-zinc-300 " />
                                </DialogTrigger>
                                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                            </div>
                            <button className="profile" onClick={navigateToProfile}>
                                <div>
                                    <h2>{currentUser.firstName} {currentUser.lastName}</h2>
                                    <h6>Ver Perfil</h6>
                                </div>
                                <img src={DefaultImg} alt="User Avatar" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}