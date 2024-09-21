import {
	deleteDoc,
	doc,
	query,
	collection,
	where,
	getDocs,
} from 'firebase/firestore'

import { db } from '../../services/firebase'

import { useState } from 'react'

import { useAuth } from '../../hooks/useAuth'

import { useQuery } from '@tanstack/react-query'

import { useQueryClient } from '@tanstack/react-query'
import { fetchAssignDetails, formatDeadline } from '../../hooks/useTasks'

import { useNavigate } from 'react-router-dom'

import Modal from 'react-modal'

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
} from './styles'

import { Button } from '../Button'

import EditIcon from '../../assets/edit-24.svg'
import DeleteIcon from '../../assets/trash-24.svg'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import '../../styles/modal.scss'

export function CardJob({ task }) {
	const queryClient = useQueryClient()
	Modal.setAppElement('#root')

	const [deleteTaskModalIsOpen, setDeleteTaskModalIsOpen] = useState(false)

	const navigate = useNavigate()

	const { currentUser } = useAuth()

	const { data: assignDetails } = useQuery({
		queryKey: ['assignDetails', task.assign?.path],
		queryFn: () => fetchAssignDetails(task),
		staleTime: 1000 * 60,
	})

	const formattedDeadline = formatDeadline(task)

	async function handleDeleteTask(id) {
		const taskDoc = doc(db, 'tasks', id)

		try {
			await deleteDoc(taskDoc)

			queryClient.invalidateQueries({ queryKey: ['tasks'] })

			const notificationsSnapshot = await getDocs(
				query(collection(db, 'notifications'), where('taskId', '==', id))
			)

			for (const doc of notificationsSnapshot.docs) {
				await deleteDoc(doc.ref)
			}

			toast.success('Tarefa e notificações apagadas com sucesso!')

			setDeleteTaskModalIsOpen(false)
		} catch (error) {
			toast.error('Erro ao apagar a tarefa ou notificações!')
			console.error('Error deleting task or notifications:', error)
		}
	}

	return (
		<Container>
			<BoxId />
			<BoxTitle>
				<JobTitle>{task.description}</JobTitle>
			</BoxTitle>
			<BoxDeadline>
				<Title>Prazo</Title>
				<SubTitle>{formattedDeadline}</SubTitle>
			</BoxDeadline>
			<BoxDeadline>
				<Title>Atribuído à</Title>
				{assignDetails && (
					<SubTitle>
						{assignDetails.name} ({assignDetails.type})
					</SubTitle>
				)}
			</BoxDeadline>
			<BoxStatus>
				<StatusWrapper status={task.status}>
					<StatusLabel>
						{task.status === 'Em andamento' ? 'Em andamento' : 'Encerrada'}
					</StatusLabel>
				</StatusWrapper>
			</BoxStatus>
			<BoxActions>
				<ButtonAction onClick={() => navigate(`/edit/${task.id}`)}>
					<img src={EditIcon} alt="Icone de editar" />
				</ButtonAction>
				{currentUser.role === 'supervisor' && (
					<ButtonAction onClick={() => setDeleteTaskModalIsOpen(true)}>
						<img src={DeleteIcon} alt="Icone de deletar" />
					</ButtonAction>
				)}
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
							Quer mesmo encerrar apagar essa tarefa? <br />
							Ela será apagada para sempre.
						</p>
						<footer>
							<Button
								width
								isOutlined={true}
								onClick={() => setDeleteTaskModalIsOpen(false)}
							>
								Cancelar
							</Button>
							<Button width onClick={() => handleDeleteTask(task.id)}>
								Apagar tarefa
							</Button>
						</footer>
					</div>
				</div>
			</Modal>
		</Container>
	)
}
