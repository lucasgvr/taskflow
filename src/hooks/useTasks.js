import { db } from '../services/firebase'
import { collection, getDocs, getDoc, doc } from 'firebase/firestore'

export async function getTasks() {
	const collectionRef = collection(db, 'tasks')
	const snapshot = await getDocs(collectionRef)

	const tasksArray = snapshot.docs.map(task => ({
		id: task.id,
		...task.data(),
	}))

	return tasksArray
}

export async function getTask(taskId) {
	const docRef = doc(db, 'tasks', taskId)
	const docSnap = await getDoc(docRef)

	return { ...docSnap.data(), id: docSnap.id }
}

export async function fetchAssignDetails(task) {
	if (task.assign) {
		const assignDoc = await getDoc(task.assign)
		if (assignDoc.exists()) {
			const isDepartment = task.assign.path.includes('departments')
			return {
				name: isDepartment
					? assignDoc.data().name
					: `${assignDoc.data().firstName} ${assignDoc.data().lastName}`,
				type: isDepartment ? 'Departamento' : 'Funcionário',
			}
		}

		return { name: 'Sem atribuição', type: '' }
	}

	return { name: 'Sem atribuição', type: '' }
}

export function formatDeadline(task) {
	if (task.status === 'Encerrada') {
		return 'Finalizada'
	}

	const deadlineDate = new Date(`${task.deadline}T00:00:00`)
	const today = new Date()
	const tomorrow = new Date(today)
	tomorrow.setDate(today.getDate() + 1)

	today.setHours(0, 0, 0, 0)
	tomorrow.setHours(0, 0, 0, 0)
	deadlineDate.setHours(0, 0, 0, 0)

	if (deadlineDate.getTime() === today.getTime()) {
		return 'Hoje'
	}

	if (deadlineDate.getTime() === tomorrow.getTime()) {
		return 'Amanhã'
	}

	const timeDifference = deadlineDate.getTime() - today.getTime()
	const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24))

	return daysDifference > 0 ? `${daysDifference} dias` : 'Atrasada'
}

export async function getAssignName(taskAssign) {
	if (taskAssign) {
		const assignPath = taskAssign.path

		const isEmployee = assignPath.startsWith('employees/')
		const isDepartment = assignPath.startsWith('departments/')

		if (isEmployee || isDepartment) {
			const assignDocSnap = await getDoc(taskAssign)
			if (assignDocSnap.exists()) {
				const assignData = assignDocSnap.data()
				return isEmployee
					? `${assignData.firstName} ${assignData.lastName}`
					: assignData.name
			}
		}
	} else {
		return 'Desconhecido'
	}
}
