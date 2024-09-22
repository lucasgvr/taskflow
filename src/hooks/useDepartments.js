import { db } from '../services/firebase'
import { collection, getDocs } from 'firebase/firestore'

export async function getDepartments() {
	const collectionRef = collection(db, 'departments')
	const snapshot = await getDocs(collectionRef)

	const departmentsArray = snapshot.docs.map(department => ({
		id: department.id,
		...department.data(),
	}))

	return departmentsArray
}
