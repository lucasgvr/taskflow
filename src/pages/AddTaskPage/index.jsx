import { getTasks } from '../../hooks/useTasks.js'
import { useDepartments } from '../../hooks/useDepartments.js'
import { useEmployees } from '../../hooks/useEmployees.js'

import { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { addDoc, collection } from 'firebase/firestore'

import { Box } from '@chakra-ui/react'

import { db } from '../../services/firebase.js'
import { doc } from 'firebase/firestore'

import { Header } from '../../components/AddTask/Header.jsx'
import { Main } from '../../components/AddTask/Main.jsx'
import { Aside } from '../../components/AddTask/Aside.jsx'

import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useQueryClient } from '@tanstack/react-query'

export function AddTaskPage() {
	const queryClient = useQueryClient()

	const [newDescription, setNewDescription] = useState('')
	const [newDeadline, setNewDeadline] = useState('')
	const [newAssign, setNewAssign] = useState('')

	const { departments } = useDepartments()
	const { employees } = useEmployees()

	const tasksCollectionRef = collection(db, 'tasks')

	const navigate = useNavigate()

	async function addTask() {
		if (!newDescription || !newDeadline || !newAssign) {
			toast.error('Todos os campos são obrigatórios!')
			return
		}

		const deadlineDate = new Date(`${newDeadline}T00:00:00`)
		const today = new Date()
		today.setHours(0, 0, 0, 0)
		deadlineDate.setHours(0, 0, 0, 0)

		if (deadlineDate < today) {
			toast.error('A data de prazo não pode ser anterior à data de hoje!')
			return
		}

		const assignRef = newAssign.includes('department')
			? doc(db, 'departments', newAssign.split(':')[1])
			: doc(db, 'employees', newAssign.split(':')[1])

		try {
			const taskRef = await addDoc(tasksCollectionRef, {
				description: newDescription,
				deadline: newDeadline,
				assign: assignRef,
				status: 'Em andamento',
				notes: [],
			})

			const notificationsCollectionRef = collection(db, 'notifications')

			const notification = {
				assignId: assignRef,
				taskId: taskRef.id,
				message: `A tarefa "${newDescription}" foi criada`,
				read: false,
				createdAt: new Date(),
			}

			await addDoc(notificationsCollectionRef, notification)

			queryClient.invalidateQueries({ queryKey: ['tasks'] })

			toast.success('Tarefa adicionada com sucesso!')

			setTimeout(() => {
				navigate('/home')
			}, 2500)
		} catch (error) {
			console.error('Erro ao adicionar tarefa:', error)
			toast.error('Ocorreu um erro ao adicionar a tarefa.')
		}
	}

	return (
		<Box
			as="div"
			bgColor="#F0F2F5"
			height="100vh"
			fontWeight="500"
			color="#FCFDFF"
			border="none"
		>
			<Header />
			<Box
				as="div"
				width="min(1440px, 90vw)"
				margin="0 auto"
				display="flex"
				justifyContent="center"
			>
				<Main
					setNewDescription={setNewDescription}
					setNewDeadline={setNewDeadline}
					setNewAssign={setNewAssign}
					departments={departments}
					employees={employees}
				/>
				<Aside addTask={addTask} />
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
