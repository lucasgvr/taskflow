import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { DialogContext } from '../../App'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
	getNotifications,
	markNotificationAsRead,
} from '../../hooks/useNotifications'

export function UserNotifications({ userId, departmentId }) {
	const queryClient = useQueryClient()

	const navigate = useNavigate()

	const { closeDialog } = useContext(DialogContext)

	const { data: notifications } = useQuery({
		queryKey: ['notifications'],
		queryFn: () => getNotifications(userId, departmentId),
		staleTime: 1000 * 60 * 5,
	})

	function handleGoToTask(taskId) {
		navigate(`/edit/${taskId}`)

		closeDialog()
	}

	function handleReadNotification(notificationId) {
		markNotificationAsRead(notificationId)

		queryClient.invalidateQueries({ queryKey: ['notifications'] })
	}

	if (!notifications) return null

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
							{notification.message.includes('criada')
								? 'Tarefa criada'
								: 'Tarefa atualizada'}{' '}
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
							{notification.read ? null : (
								<button
									type="button"
									className="px-2 py-2 flex-1 text-zinc-900 border-2 border-zinc-500 rounded hover:opacity-75"
									onClick={() => handleReadNotification(notification.id)}
								>
									Marcar como lida
								</button>
							)}
							<button
								type="button"
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
