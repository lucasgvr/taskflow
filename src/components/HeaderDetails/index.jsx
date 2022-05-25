import { Button } from '../Button/index';

import PlusIcon from "../../assets/plus-24.svg"

import { Container, InfoWrapper, ButtonWrapper, InfoItem, Title, SubTitle } from './styles';
import { Box, Image, Text } from '@chakra-ui/react';

import { useTasks } from "../../hooks/useTasks"

export function HeaderDetails() {
  const { tasks } = useTasks()

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
      <ButtonWrapper as='a' href='/add'>
        <Button>
          <Box display='flex' justifyContent='center' alignItems='center'>
            <Image src={ PlusIcon } alt="" />
            <Text>Adicionar nova tarefa</Text>
          </Box>
        </Button>
      </ButtonWrapper>
    </Container>
  )
}