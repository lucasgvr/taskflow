import { useTasks } from "../../hooks/useTasks"

import { Box, Image, Text } from '@chakra-ui/react'

import { Button } from '../Button/index'
import { Container, InfoWrapper, InfoItem, Title, SubTitle } from './styles'

import { Link, Navigate } from "react-router-dom"

import PlusIcon from "../../assets/plus-24.svg"
import { useAuth } from "../../hooks/useAuth"

export function HeaderDetails() {
    const { tasks } = useTasks()
    const { currentUser } = useAuth()

    const countOpen = tasks.filter(task => {
        if (task.status === "Em andamento") {
            return true;
        }
    
        return false;
    }).length

    const countClosed = tasks.filter(task => {
        if (task.status === "Encerrada") {
            return true;
        }
    
        return false;
    }).length

    if(!currentUser) {
        return <Navigate to='/' />
    }

    return (
        <Container>
            <InfoWrapper>
                <InfoItem>
                    <Title>{tasks.length}</Title>
                    <SubTitle>Tarefas ao total</SubTitle>
                </InfoItem>
                <InfoItem>
                    <Title>{countOpen}</Title>
                    <SubTitle>Em andamento</SubTitle>
                </InfoItem>
                <InfoItem>
                    <Title>{countClosed}</Title>
                    <SubTitle>Encerradas</SubTitle>
                </InfoItem>
            </InfoWrapper>
            {currentUser.role === 'supervisor' && (
                <Link as='a' to='/add'>
                    <Button>
                        <Box display='flex' justifyContent='center' alignItems='center'>
                            <Image src={ PlusIcon } alt="" />
                            <Text>Adicionar nova tarefa</Text>
                        </Box>
                    </Button>
                </Link>
            )}
        </Container>
    )
}