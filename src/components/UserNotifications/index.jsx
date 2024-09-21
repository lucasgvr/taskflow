import { useEffect, useState } from 'react'
import { db } from '../../services/firebase'
import {
	collection,
	query,
	where,
	getDocs,
	doc,
	updateDoc,
} from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { DialogContext } from '../../App'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function UserNotifications({ userId, departmentId }) {
	const navigate = useNavigate()

	const { closeDialog } = useContext(DialogContext)

	const [notifications, setNotifications] = useState([])

	async function fetchNotifications(userId, departmentId) {
		const notificationsRef = collection(db, 'notifications')

		const departmentRef = doc(db, 'departments', departmentId)
		const employeeRef = doc(db, 'employees', userId)

		const q = query(notificationsRef, where('assignId', '==', employeeRef))

		const q2 = query(notificationsRef, where('assignId', '==', departmentRef))

		try {
			const querySnapshot2 = await getDocs(q2)
			const notifications2 = querySnapshot2.docs.map(doc => ({
				id: doc.id,
				...doc.data(),
			}))

			const querySnapshot = await getDocs(q)
			const notifications = querySnapshot.docs.map(doc => ({
				id: doc.id,
				...doc.data(),
			}))

			return [...notifications, ...notifications2]
		} catch (error) {
			console.error('Erro ao buscar notificações:', error)
			return []
		}
	}

	async function markNotificationAsRead(notificationId) {
		const notificationRef = doc(db, 'notifications', notificationId)

		try {
			// Update the notification document to set `read` to true
			await updateDoc(notificationRef, {
				read: true,
			})

			setNotifications(prevNotifications =>
				prevNotifications.map(notification =>
					notification.id === notificationId
						? { ...notification, read: true }
						: notification
				)
			)
		} catch (error) {
			console.error('Error updating notification:', error)
		}
	}

	function handleGoToTask(taskId) {
		navigate(`/edit/${taskId}`)

		closeDialog()
	}

	useEffect(() => {
		async function loadNotifications() {
			const fetchedNotifications = await fetchNotifications(userId, departmentId)
			console.log(fetchedNotifications)
			setNotifications(fetchedNotifications)
		}

		loadNotifications()
		// eslint-disable-next-line
	}, [userId, departmentId])

	return (
		<div className="flex flex-col gap-4">
			{notifications.length === 0 && (
				<p className="text-zinc-500">Nenhuma notificação</p>
			)}

			{notifications
				.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate()) // Sort by most recent
				.map(notification => (
					<div
						key={notification.id}
						className={`border-2 rounded-xl p-4 min-h-[100px] ${notification.read ? 'border-gray-400 bg-gray-200' : 'border-zinc-500'}`}
					>
						<h1
							className={`text-l font-bold ${notification.read ? 'text-zinc-500' : 'text-zinc-900'}`}
						>
							{notification.message.includes('atualizada')
								? 'Tarefa atualizada'
								: 'Tarefa criada'}{' '}
						</h1>
						<p
							className={`text-gray-500 line-clamp-2 ${notification.read ? 'text-zinc-400' : 'text-zinc-600'}`}
						>
							{notification.message}
						</p>
						<p className="text-gray-400 text-sm">
							{formatDistanceToNow(notification.createdAt.toDate(), {
								addSuffix: true,
								locale: ptBR,
							})}
						</p>
						<div className="flex gap-4 mt-4 flex-1">
							<button
								className="px-2 py-2 flex-1 text-zinc-900 border-2 border-zinc-500 rounded hover:opacity-75"
								onClick={() => markNotificationAsRead(notification.id)}
								disabled={notification.read}
							>
								Marcar como lida
							</button>
							<button
								className="px-2 py-2 bg-zinc-500 text-zinc-100 rounded hover:opacity-90 flex-1"
								onClick={() => handleGoToTask(notification.taskId)}
							>
								Ir para a tarefa
							</button>
						</div>
					</div>
				))}
		</div>
	)
}
