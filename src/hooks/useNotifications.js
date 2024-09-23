import { db } from '../services/firebase'
import {
	collection,
	doc,
	where,
	query,
	getDocs,
	updateDoc,
} from 'firebase/firestore'

export async function getNotifications(userId, departmentId) {
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

export async function markNotificationAsRead(notificationId) {
	const notificationRef = doc(db, 'notifications', notificationId)

	try {
		await updateDoc(notificationRef, {
			read: true,
		})
	} catch (error) {
		console.error('Erro ao atualizar notificações:', error)
	}
}
