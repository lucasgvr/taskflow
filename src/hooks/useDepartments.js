import { db } from '../services/firebase'
import {
	collection,
	getDocs,
	addDoc,
	doc,
	deleteDoc,
	updateDoc,
	arrayUnion,
	getDoc,
	query,
	where,
} from 'firebase/firestore'

export async function getDepartments() {
	const collectionRef = collection(db, 'departments')
	const snapshot = await getDocs(collectionRef)

	const departmentsArray = snapshot.docs.map(department => ({
		id: department.id,
		...department.data(),
	}))

	const sortedDepartmentsArray = departmentsArray.sort((a, b) =>
		a.name.localeCompare(b.name)
	)

	return sortedDepartmentsArray
}

export async function getDepartment(departmentId) {
	const departmentRef = doc(db, 'departments', departmentId)

	const departmentSnapshot = await getDoc(departmentRef)

	const departmentData = departmentSnapshot.data()

	const employeeRefs = departmentData.employees || []

	const employeePromises = employeeRefs.map(employeeRef => getDoc(employeeRef))
	const employeeSnapshots = await Promise.all(employeePromises)

	const employees = employeeSnapshots.map(employeeSnap => ({
		id: employeeSnap.id,
		...employeeSnap.data(),
	}))

	return {
		...departmentData,
		id: departmentSnapshot.id,
		employees,
	}
}

export async function addDepartment(name) {
	await addDoc(collection(db, 'departments'), {
		name,
	})
}

export async function deleteDepartment(departmentId) {
	const departmentRef = doc(db, 'departments', departmentId)

	await deleteDoc(departmentRef)
}

export async function deleteDepartmentWithEmployees(
	departmentId,
	employeesInDepartment
) {
	const departmentDocRef = doc(db, 'departments', departmentId)
	const newDepartmentDocRef = doc(db, 'departments', 'bwLY5wnNiKoU0qZSeHQl')

	const employeeUpdates = employeesInDepartment.map(employeeDoc => {
		const employeeRef = doc(db, 'employees', employeeDoc.id)

		const employeeUpdate = updateDoc(employeeRef, {
			department: newDepartmentDocRef,
		})

		const departmentUpdate = updateDoc(newDepartmentDocRef, {
			employees: arrayUnion(employeeRef),
		})

		return Promise.all([employeeUpdate, departmentUpdate])
	})

	await Promise.all(employeeUpdates)
	await deleteDoc(departmentDocRef)
}

export async function checkIfDepartmentsNameExist(departmentName) {
	const departmentsSnapshot = await getDocs(
		query(collection(db, 'departments'), where('name', '==', departmentName))
	)

	return !departmentsSnapshot.empty
}

export async function updateDepartmentName(departmentId, departmentName) {
	const departmentRef = doc(db, 'departments', departmentId)

	await updateDoc(departmentRef, { name: departmentName })
}
