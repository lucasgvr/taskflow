import { useState, useEffect } from "react";

import { db } from "../services/firebase"
import { collection, getDocs, getDoc, doc } from "firebase/firestore"

export function useDepartments() {
    const [departments, setDepartments] = useState([])

    const departmentsCollectionRef = collection(db, "departments")

    useEffect(() => {
        const getDepartments = async () => {
            const data = await getDocs(departmentsCollectionRef)

            setDepartments(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
        }

        getDepartments()
    })

    return { departments, departmentsCollectionRef }
}