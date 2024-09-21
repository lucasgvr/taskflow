import { useNavigate } from 'react-router-dom'

import { useState, useEffect } from 'react'

import {
	deleteDoc,
	doc,
	getDoc,
	query,
	collection,
	where,
	getDocs,
} from 'firebase/firestore'
import { db } from '../../services/firebase'

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
import { useAuth } from '../../hooks/useAuth'

export function CardJob({ task }) {
	Modal.setAppElement('#root')

	const [deleteTaskModalIsOpen, setDeleteTaskModalIsOpen] = useState(false)

	const [assignName, setAssignName] = useState('')
	const [assignType, setAssignType] = useState('')
	const [formattedDeadline, setFormattedDeadline] = useState('')

	const navigate = useNavigate()

	const { currentUser } = useAuth()

	useEffect(() => {
		async function fetchAssignDetails() {
			if (task.assign) {
				const assignDoc = await getDoc(task.assign)
				if (assignDoc.exists()) {
					const isDepartment = task.assign.path.includes('departments')
					setAssignName(
						isDepartment
							? assignDoc.data().name
							: `${assignDoc.data().firstName} ${assignDoc.data().lastName}` || 'N/A'
					)
					setAssignType(isDepartment ? 'Departamento' : 'Funcionário')
				} else {
					setAssignName('Sem atribuição')
					setAssignType('')
				}
			}
		}

		fetchAssignDetails()

		function formatDeadline() {
			if (task.status === 'Encerrada') {
				setFormattedDeadline('Finalizada')
				return
			}

			const deadlineDate = new Date(task.deadline + 'T00:00:00') // Ensuring the time is set to midnight
			const today = new Date()
			const tomorrow = new Date(today)
			tomorrow.setDate(today.getDate() + 1)

			today.setHours(0, 0, 0, 0)
			tomorrow.setHours(0, 0, 0, 0)
			deadlineDate.setHours(0, 0, 0, 0)

			if (deadlineDate.getTime() === today.getTime()) {
				setFormattedDeadline('Hoje')
			} else if (deadlineDate.getTime() === tomorrow.getTime()) {
				setFormattedDeadline('Amanhã')
			} else {
				const timeDifference = deadlineDate.getTime() - today.getTime()
				const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24))

				if (daysDifference > 0) {
					setFormattedDeadline(`${daysDifference} dias`)
				} else {
					setFormattedDeadline('Atrasada')
				}
			}
		}

		formatDeadline()
		// eslint-disable-next-line
	}, [])

	const handleDeleteTask = async id => {
		const taskDoc = doc(db, 'tasks', id)

		const notificationsQuery = query(
			collection(db, 'notifications'),
			where('taskId', '==', id)
		)

		try {
			// Delete the task
			await deleteDoc(taskDoc)

			// Find and delete the associated notifications
			const notificationsSnapshot = await getDocs(notificationsQuery)
			notificationsSnapshot.forEach(async doc => {
				await deleteDoc(doc.ref) // Delete each notification document
			})

			toast.success('Tarefa e notificações apagadas com sucesso!')

			// Navigate back after a delay
			setTimeout(() => {
				navigate('/home')
			}, 5000)
		} catch (error) {
			toast.error('Erro ao apagar a tarefa ou notificações!')
			console.error('Error deleting task or notifications:', error)
		}
	}

	return (
		<Container>
			<BoxId></BoxId>
			<BoxTitle>
				<JobTitle>{task.description}</JobTitle>
			</BoxTitle>
			<BoxDeadline>
				<Title>Prazo</Title>
				<SubTitle>{formattedDeadline}</SubTitle>
			</BoxDeadline>
			<BoxDeadline>
				<Title>Atribuído à</Title>
				<SubTitle>
					{assignName} {assignType ? `(${assignType})` : ''}
				</SubTitle>
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
