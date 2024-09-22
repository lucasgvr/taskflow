import { useState, useEffect } from 'react'

import { db } from '../services/firebase'
import {
	collection,
	getDocs,
	query,
	where,
	doc,
	getDoc,
	arrayRemove,
	deleteDoc,
	updateDoc,
	addDoc,
	arrayUnion,
} from 'firebase/firestore'

export async function getEmployees() {
	const collectionRef = collection(db, 'employees')
	const snapshot = await getDocs(collectionRef)

	const employeesArray = await Promise.all(
		snapshot.docs.map(async employeeDoc => {
			const employeeData = employeeDoc.data()
			const departmentRef = employeeData.department

			let departmentData = null
			let departmentId = null

			if (departmentRef) {
				const departmentDoc = await getDoc(departmentRef)
				if (departmentDoc.exists()) {
					departmentData = departmentDoc.data()
					departmentId = departmentDoc.id
				}
			}

			return {
				id: employeeDoc.id,
				...employeeData,
				department: departmentData,
				departmentId: departmentId,
			}
		})
	)

	const sortedEmployeesArray = employeesArray.sort((a, b) =>
		a.firstName.localeCompare(b.firstName)
	)

	return sortedEmployeesArray
}

export async function getEmployee(employeeId) {
	const employeeRef = doc(db, 'employees', employeeId)
	const employeeSnapshot = await getDoc(employeeRef)

	if (employeeSnapshot.exists()) {
		const employeeData = employeeSnapshot.data()
		const departmentRef = employeeData.department

		let departmentData = null
		let departmentId = null

		if (departmentRef) {
			const departmentDoc = await getDoc(departmentRef)
			if (departmentDoc.exists()) {
				departmentData = departmentDoc.data()
				departmentId = departmentDoc.id // Extract the departmentId
			}
		}

		return {
			id: employeeSnapshot.id,
			...employeeData,
			department: departmentData, // Department data
			departmentId: departmentId, // Include the departmentId
		}
	}

	return null
}

export async function getEmployeesByDepartment(departmentId) {
	const departmentRef = doc(db, 'departments', departmentId)
	const employeesCollectionRef = collection(db, 'employees')

	const employeesSnapshot = await getDocs(
		query(employeesCollectionRef, where('department', '==', departmentRef))
	)

	const employeesList = employeesSnapshot.docs.map(doc => ({
		...doc.data(),
		id: doc.id,
	}))

	return employeesList
}

export async function addEmployee(employeeData, deparmentId) {
	const departmentRef = doc(db, 'departments', deparmentId)

	const employeeWithDepartment = {
		...employeeData,
		department: departmentRef,
	}

	const employeeDoc = await addDoc(
		collection(db, 'employees'),
		employeeWithDepartment
	)

	await updateDoc(departmentRef, {
		employees: arrayUnion(employeeDoc),
	})
}

export async function deleteEmployee(employeeId) {
	const employeeRef = doc(db, 'employees', employeeId)

	const employeeSnapshot = await getDoc(employeeRef)

	if (employeeSnapshot.exists()) {
		const employeeData = employeeSnapshot.data()
		const departmentRef = employeeData.department

		if (departmentRef) {
			await updateDoc(departmentRef, {
				employees: arrayRemove(employeeRef),
			})
		}

		await deleteDoc(employeeRef)
	}
}
