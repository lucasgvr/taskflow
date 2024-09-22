import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'

import { useEmployees } from '../../hooks/useEmployees'

import { doc, updateDoc, collection, addDoc } from 'firebase/firestore'
import { db } from '../../services/firebase'

import { Button } from '../../components/Button'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getTask } from '../../hooks/useTasks'

import {
	Box,
	Textarea,
	Heading,
	VStack,
	Text,
	HStack,
	IconButton,
} from '@chakra-ui/react'

import { Header } from '../../components/TaskEdit/Header'
import { Main } from '../../components/TaskEdit/Main'
import { Aside } from '../../components/TaskEdit/Aside'

import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useAuth } from '../../hooks/useAuth'

import { DeleteIcon } from '@chakra-ui/icons'
import { addNote, deleteNote } from '../../hooks/useNotes'

export function TaskEditPage() {
	const queryClient = useQueryClient()

	const [newDescription, setNewDescription] = useState('')
	const [newDeadline, setNewDeadline] = useState('')
	const [newStatus, setNewStatus] = useState('')
	const [newAssign, setNewAssign] = useState('')
	const [newNote, setNewNote] = useState('')

	const params = useParams()
	const taskId = params.id

	const { employees } = useEmployees()
	const { currentUser } = useAuth()

	const navigate = useNavigate()

	const { data: task } = useQuery({
		queryKey: ['task', taskId],
		queryFn: () => getTask(taskId),
		staleTime: 1000 * 60 * 5,
		enabled: !!taskId,
	})

	if (!task) return null

	async function updateTask(
		id,
		newDescription,
		newDeadline,
		newStatus,
		newAssign
	) {
		console.log(id, newDescription, newDeadline, newStatus, newAssign)
		const taskDoc = doc(db, 'tasks', id)

		let assignRef

		const deadlineDate = new Date(`${newDeadline}T00:00:00`)
		const today = new Date()
		today.setHours(0, 0, 0, 0)
		deadlineDate.setHours(0, 0, 0, 0)

		if (deadlineDate < today) {
			toast.error('A data de prazo está anterior à data de hoje!')
			return
		}

		if (newAssign) {
			assignRef = newAssign.includes('department')
				? doc(db, 'departments', newAssign.split(':')[1])
				: doc(db, 'employees', newAssign.split(':')[1])
		}

		const newFields = {
			description: newDescription || task.description,
			deadline: newDeadline || task.deadline,
			status: newStatus || task.status,
			assign: assignRef || task.assign,
		}

		const notificationsCollectionRef = collection(db, 'notifications')

		const notification = {
			assignId: assignRef || task.assign,
			taskId: id,
			message: `A tarefa "${newDescription || task.description}" foi atualizada`,
			read: false,
			createdAt: new Date(),
		}

		await addDoc(notificationsCollectionRef, notification)

		await updateDoc(taskDoc, newFields)

		queryClient.invalidateQueries({ queryKey: ['tasks'] })
		queryClient.invalidateQueries({ queryKey: ['task'] })

		toast.success('Tarefa atualizada com sucesso!')

		setTimeout(() => {
			navigate('/home')
		}, 2500)
	}

	async function handleAddNote() {
		if (newNote === '') {
			toast.error('A anotação não pode estar vazia!')
			return
		}

		await addNote(taskId, currentUser, newNote)

		queryClient.invalidateQueries({ queryKey: ['task'] })

		toast.success('Anotação adicionada com sucesso!')
		setNewNote('')
	}

	async function handleDeleteNote(taskId, noteToDelete) {
		await deleteNote(taskId, noteToDelete)

		queryClient.invalidateQueries({ queryKey: ['task'] })

		toast.success('Anotação removida com sucesso!')
	}

	return (
		<Box as="div" fontWeight="500" color="#FCFDFF" border="none">
			<Header />
			<Box
				as="div"
				width="min(1440px, 90vw)"
				margin="0 auto"
				display="flex"
				justifyContent="center"
			>
				<Main
					task={task}
					setNewDescription={setNewDescription}
					setNewDeadline={setNewDeadline}
					setNewStatus={setNewStatus}
					setNewAssign={setNewAssign}
					employees={employees}
				/>
				<Aside
					updateTask={updateTask}
					taskId={taskId}
					newDescription={newDescription}
					newDeadline={newDeadline}
					newStatus={newStatus}
					newAssign={newAssign}
				/>
			</Box>

			<Box
				as="div"
				width="min(900px, 90vw)"
				margin="4rem auto"
				display="flex"
				gap="1rem"
				alignItems="center"
				justifyContent="center"
			>
				<Textarea
					placeholder="Adicionar anotações..."
					backgroundColor="#fff"
					color="#5A5A66"
					borderRadius="0.313rem"
					resize="none"
					value={newNote}
					onChange={e => setNewNote(e.target.value)}
				/>
				<Button onClick={handleAddNote}>Adicionar</Button>
			</Box>
			<Box as="div" width="min(900px, 90vw)" margin="1rem auto">
				<Heading size="md" mb="1rem" color="#5A5A66">
					Anotações
				</Heading>
				<VStack spacing={4} align="start" width="100%">
					{task?.notes && task.notes.length > 0 ? (
						task.notes.map(note => (
							<Box
								key={task.notes.indexOf(note)}
								p={4}
								width="100%"
								borderRadius="0.313rem"
								border="1px solid #E1E3E6"
							>
								<HStack justifyContent="space-between" width="100%">
									<VStack align="start" width="100%">
										<Text color="#5A5A66">{note.description}</Text>
										<Box display="flex" justifyContent="space-between" width="100%">
											<Text color="#5A5A66" fontSize="sm">
												Criado por: {note.createdBy}
											</Text>
											<Text color="#5A5A66" fontSize="sm">
												Data de criação: {new Date(note.createdAt).toLocaleString()}
											</Text>
										</Box>
									</VStack>
									{(currentUser.role === 'supervisor' ||
										currentUser.id === note.createdById) && (
										<IconButton
											icon={<DeleteIcon color="#fff" />}
											aria-label="Delete Note"
											onClick={() => handleDeleteNote(task.id, note)}
											bgColor="var(--orange)"
											size="sm"
											transition="0.25s"
											_hover={{ filter: 'brightness(0.9)' }}
										/>
									)}
								</HStack>
							</Box>
						))
					) : (
						<Text color="#5A5A66">Não há anotações para esta tarefa</Text>
					)}
				</VStack>
			</Box>

			<ToastContainer
				position="top-center"
				autoClose={2500}
				hideProgressBar={false}
				newestOnTop={true}
				closeOnClick
				rtl={false}
				draggable
				theme="light"
				pauseOnFocusLoss={false}
				pauseOnHover={false}
			/>
		</Box>
	)
}
