import backArrowImg from "../../assets/arrow.svg"

import { Button } from '../Button/index'

import { Box, Text } from '@chakra-ui/react'

import { Link } from "react-router-dom";


import "./styles.scss"

export function Header() {
    return (
        <header id="header">
            <div className="container">
                <div>
                    <div className="buttonContainer">
                        <a className="backButton" href="/">
                            <img src={ backArrowImg } alt="" />
                        </a>
                        <Link to='/employees'>
                        <Button>
                            <Box display='flex' justifyContent='center' alignItems='center'>
                                <Text>Departamentos/Funcionários</Text>
                            </Box>
                        </Button>
                        </Link>
                    </div>
                    <a className="profile" href="/profile">
                        <div>
                            <h2>Lucas Rocha</h2>
                            <h6>Ver Perfil</h6>
                        </div>
                        <img src="https://avatars.githubusercontent.com/lucasgvr" alt="User Avatar" />
                    </a>
                </div>
            </div>
        </header>
    )
}