import { HeaderDetails } from '../HeaderDetails'
import { CardJob } from '../CardJob'

import { useTasks } from '../../hooks/useTasks'

import { Container, Background } from './styles'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export function Dashboard() {
	const { tasks } = useTasks()

	const statusOrder = {
		'Em andamento': 1,
		Encerrada: 2,
	}

	const sortedTasks = tasks.sort((a, b) => {
		if (statusOrder[a.status] !== statusOrder[b.status]) {
			return statusOrder[a.status] - statusOrder[b.status]
		}

		return new Date(a.deadline) - new Date(b.deadline)
	})

	return (
		<Container>
			<HeaderDetails />
			{sortedTasks.map(task => (
				<CardJob key={task.id} task={task} />
			))}
			<Background />

			<ToastContainer
				position="top-center"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={true}
				closeOnClick
				rtl={false}
				draggable
				theme="light"
				pauseOnFocusLoss={false}
				pauseOnHover={false}
			/>
		</Container>
	)
}
