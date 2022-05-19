import EditIcon from '../../assets/edit-24.svg';
import DeleteIcon from '../../assets/trash-24.svg';

import {
  Container,
  BoxId,
  BoxTitle,
  BoxDeadline,
  BoxStatus,
  BoxActions,
  Id,
  JobTitle,
  Title,
  SubTitle,
  StatusWrapper,
  StatusLabel,
  ButtonAction,
} from './styles';

export function CardJob({ data }) {
  return (
    <Container>
      <BoxId>
        <Id>{data.id}</Id>
      </BoxId>
      <BoxTitle>
        <JobTitle>{data.title}</JobTitle>
      </BoxTitle>
      <BoxDeadline>
        <Title>Prazo</Title>
        <SubTitle>{data.deadline}</SubTitle>
      </BoxDeadline>
      <BoxStatus>
        <StatusWrapper status={data.status}>
          <StatusLabel>
            {data.status === "IN_PROGRESS" ? 'Em andamento' : 'Encerrado'}
          </StatusLabel>
        </StatusWrapper>
      </BoxStatus>
      <BoxActions>
        <ButtonAction>
          <img
            src={EditIcon}
            alt="Icone de editar"
          />
        </ButtonAction>
        <ButtonAction>
          <img
            src={DeleteIcon}
            alt="Icone de deletar"
          />
        </ButtonAction>
      </BoxActions>
    </Container>
  );
}
