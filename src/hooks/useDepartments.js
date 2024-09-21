import { useState, useEffect } from 'react'

import { db } from '../services/firebase'
import { collection, getDocs } from 'firebase/firestore'

export function useDepartments() {
	const [departments, setDepartments] = useState([])

	const departmentsCollectionRef = collection(db, 'departments')

	useEffect(() => {
		const getDepartments = async () => {
			const data = await getDocs(departmentsCollectionRef)

			const departmentsList = data.docs.map(doc => ({ ...doc.data(), id: doc.id }))

			departmentsList.sort((a, b) => a.name.localeCompare(b.name))

			setDepartments(departmentsList)
		}

		getDepartments()
		//eslint-disable-next-line
	}, [departments])

	return { departments, departmentsCollectionRef }
}
