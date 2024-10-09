import { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { addDoc, collection } from 'firebase/firestore'

import { Box } from '@chakra-ui/react'

import { db } from '../../services/firebase.js'
import { doc, getDoc } from 'firebase/firestore'

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

			if (newAssign.includes('department')) {
				const departmentSnapshot = await getDoc(assignRef)
				if (departmentSnapshot.exists()) {
					const departmentData = departmentSnapshot.data()
					const employeeRefs = departmentData.employees || []

					const notificationPromises = employeeRefs.map(async employeeRef => {
						const notification = {
							assignId: employeeRef, // Employee reference
							taskId: taskRef.id,
							message: `A tarefa "${newDescription}" foi criada`,
							read: false,
							createdAt: new Date(),
						}
						await addDoc(notificationsCollectionRef, notification)
					})
					await Promise.all(notificationPromises)
				}
			} else {
				const notification = {
					assignId: assignRef,
					taskId: taskRef.id,
					message: `A tarefa "${newDescription}" foi criada`,
					read: false,
					createdAt: new Date(),
				}
				await addDoc(notificationsCollectionRef, notification)
			}

			queryClient.invalidateQueries({ queryKey: ['tasks'] })
			queryClient.invalidateQueries({ queryKey: ['notifications'] })

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
