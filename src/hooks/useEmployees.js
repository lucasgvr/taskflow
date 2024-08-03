import { useState, useEffect } from "react";

import { db } from "../services/firebase"
import { collection, getDocs } from "firebase/firestore"

export function useEmployees() {
    const [employees, setEmployees] = useState([])

    const employeesCollectionRef = collection(db, "employees")

    useEffect(() => {
        const getEmployees = async () => {
            const data = await getDocs(employeesCollectionRef)

            const employeesList = data.docs.map((doc) => ({...doc.data(), id: doc.id}))

            employeesList.sort((a, b) => a.firstName.localeCompare(b.firstName));
            
            setEmployees(employeesList);
        }

        getEmployees()
    })

    return { employees, employeesCollectionRef}
}