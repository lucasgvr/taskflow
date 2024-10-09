import { UserNotifications } from '../UserNotifications'
import { DialogContent, DialogTitle, DialogClose } from './dialog'
import { IoCloseSharp } from 'react-icons/io5'
import { useAuth } from '../../hooks/useAuth'
import { markAllNotificationsAsRead } from '../../hooks/useNotifications'
import { useQueryClient } from '@tanstack/react-query'

export function DialogContentWrapper() {
	const queryClient = useQueryClient()

	const { currentUser } = useAuth()

	if (!currentUser) return null
	const departmentId =
		currentUser.department._key.path.segments[
			currentUser.department._key.path.segments.length - 1
		]

	async function handleMarkAllNotificationsAsRead(userId) {
		await markAllNotificationsAsRead(userId)

		queryClient.invalidateQueries({ queryKey: ['notifications'] })
	}

	return (
		<DialogContent>
			<div className="flex flex-col">
				<div className="flex items-center justify-between">
					<DialogTitle>Notificações</DialogTitle>
					<DialogClose>
						<IoCloseSharp className="size-6 text-zinc-600" />
					</DialogClose>
				</div>
				<div>
					<button
						type="button"
						className="mb-6 text-zinc-500 rounded hover:opacity-90 flex-1"
						onClick={() => handleMarkAllNotificationsAsRead(currentUser.id)}
					>
						Marcar todas como lidas
					</button>
				</div>

				<UserNotifications userId={currentUser.id} departmentId={departmentId} />
			</div>
		</DialogContent>
	)
}
