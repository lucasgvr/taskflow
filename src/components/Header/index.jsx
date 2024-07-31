import backArrowImg from "../../assets/arrow.svg"

import { Button } from '../Button/index'

import { Box, Text } from '@chakra-ui/react'

import { Link, useLocation } from "react-router-dom";


import "./styles.scss"

export function Header() {
    const location = useLocation()

    const linkPath = location.pathname === '/home' ? '/' : '/home';

    return (
        <header id="header">
            <div className="container">
                <div>
                    <div className="buttonContainer">
                        <Link className="backButton" to={linkPath}>
                            <img src={ backArrowImg } alt="" />
                        </Link>
                        <Link to='/choose'>
                            <Button>
                                <Box display='flex' justifyContent='center' alignItems='center'>
                                    <Text>Departamentos/Funcionários</Text>
                                </Box>
                            </Button>
                        </Link>
                    </div>
                    <Link className="profile" to="/profile">
                        <div>
                            <h2>Lucas Rocha</h2>
                            <h6>Ver Perfil</h6>
                        </div>
                        <img src="https://avatars.githubusercontent.com/lucasgvr" alt="User Avatar" />
                    </Link>
                </div>
            </div>
        </header>
    )
}