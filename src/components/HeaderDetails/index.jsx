import { Button } from '../Button/index';

import PlusIcon from "../../assets/plus-24.svg"

import { Container, InfoWrapper, ButtonWrapper, InfoItem, Title, SubTitle } from './styles';

export function HeaderDetails() {
  return (
    <Container>
      <InfoWrapper>
        <InfoItem>
          <Title>12</Title>
          <SubTitle>Tarefas ao total</SubTitle>
        </InfoItem>
        <InfoItem>
          <Title>7</Title>
          <SubTitle>Em andamento</SubTitle>
        </InfoItem>
        <InfoItem>
          <Title>4</Title>
          <SubTitle>Encerradas</SubTitle>
        </InfoItem>
      </InfoWrapper>
      <ButtonWrapper>
        <Button>
          <img src={ PlusIcon } alt="" />
          Adicionar nova tarefa
        </Button>
      </ButtonWrapper>
    </Container>
  )
}