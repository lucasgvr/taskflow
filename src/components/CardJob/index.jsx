import { useNavigate } from 'react-router-dom';
import EditIcon from '../../assets/edit-24.svg';
import DeleteIcon from '../../assets/trash-24.svg';

import Modal from "react-modal"
import { Button } from '../Button';

import { useState } from 'react';

import "../../styles/modal.scss"

import {
  Container,
  BoxId,
  BoxTitle,
  BoxDeadline,
  BoxStatus,
  BoxActions,
  JobTitle,
  Title,
  SubTitle,
  StatusWrapper,
  StatusLabel,
  ButtonAction,
} from './styles';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../services/firebase';

export function CardJob({ task }) {
  const navigate = useNavigate()

  const [deleteTaskModalIsOpen, setDeleteTaskModalIsOpen] = useState(false)

  const handleDeleteTask = async (id) => {
    const taskDoc = doc(db, "tasks", id)

    await deleteDoc(taskDoc)
  }

  return (
    <Container>
      <BoxId>
      </BoxId>
      <BoxTitle>
        <JobTitle>{task.description}</JobTitle>
      </BoxTitle>
      <BoxDeadline>
        <Title>Prazo</Title>
        <SubTitle>{task.deadline}</SubTitle>
      </BoxDeadline>
      <BoxDeadline>
        <Title>Atribuído à</Title>
        <SubTitle>{task.assign}</SubTitle>
      </BoxDeadline>
      <BoxStatus>
        <StatusWrapper status={task.status}>
          <StatusLabel>
            {task.status === "Em andamento" ? 'Em andamento' : 'Encerrada'}
          </StatusLabel>
        </StatusWrapper>
      </BoxStatus>
      <BoxActions>
        <ButtonAction onClick={() => navigate(`/edit/${task.id}`)}>
          <img
            src={EditIcon}
            alt="Icone de editar"
          />
        </ButtonAction>
        <ButtonAction onClick={() => setDeleteTaskModalIsOpen(true)}>
          <img
            src={DeleteIcon}
            alt="Icone de deletar"
          />
        </ButtonAction>
      </BoxActions>
      <Modal
        isOpen={deleteTaskModalIsOpen}
        className="modal"
        onRequestClose={() => setDeleteTaskModalIsOpen(false)}
        shouldCloseOnOverlayClick={true}
      >
        <div className="modalWrapper">
          <div className="modal">
            <h3>Apagar tarefa</h3>
            <p>
                Quer mesmo encerrar apagar essa tarefa? <br/>
                Ela será apagada para sempre.  
            </p>
            <footer>
              <Button width isOutlined={true} onClick={() => setDeleteTaskModalIsOpen(false)}>Cancelar</Button>
              <Button width onClick={() => handleDeleteTask(task.id)}>Apagar tarefa</Button>
            </footer>
          </div>
        </div>
      </Modal>
    </Container>
  );
}
