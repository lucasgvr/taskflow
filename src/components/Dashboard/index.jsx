import { HeaderDetails } from '../HeaderDetails'
import { CardJob } from '../CardJob'

import { Container, Background } from './styles'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { getTasks } from '../../hooks/useTasks'
import { useQuery } from '@tanstack/react-query'

export function Dashboard() {
	const { data } = useQuery({
		queryKey: ['tasks'],
		queryFn: getTasks,
		staleTime: 1000 * 60 * 5,
	})

	if (!data) {
		return null
	}

	const statusOrder = {
		'Em andamento': 1,
		Encerrada: 2,
	}

	const sortedTasks = data.sort((a, b) => {
		if (statusOrder[a.status] !== statusOrder[b.status]) {
			return statusOrder[a.status] - statusOrder[b.status]
		}

		return new Date(a.deadline) - new Date(b.deadline)
	})

	return (
		<Container>
			<HeaderDetails tasks={sortedTasks} />

			{sortedTasks.map(task => (
				<CardJob key={task.id} task={task} />
			))}

			<Background />

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
		</Container>
	)
}
