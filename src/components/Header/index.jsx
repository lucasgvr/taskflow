import backArrowImg from "../../assets/arrow.svg"

import { Button } from '../Button/index'

import { Box, Text } from '@chakra-ui/react'

import { Link, Navigate, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth"

import "./styles.scss"

import DefaultImg from "../../assets/default.png"
import { useEffect } from "react";
import { db } from "../../services/firebase";
import { doc, getDoc } from "firebase/firestore";

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
    }, [currentUser])

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
                <div className="container">
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
                        <a className="profile" onClick={navigateToProfile}>
                            <div>
                                <h2>{currentUser.firstName} {currentUser.lastName}</h2>
                                <h6>Ver Perfil</h6>
                            </div>
                            <img src={DefaultImg} alt="User Avatar" />
                        </a>
                    </div>
                </div>
            </header>
        </>
    )
}