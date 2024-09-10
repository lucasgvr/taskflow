import { useState, useEffect } from "react"

import { db } from "../services/firebase"
import { collection, getDocs } from "firebase/firestore"

export function useTasks() {
    const [tasks, setTasks] = useState([])

    const tasksCollectionRef = collection(db, "tasks")

    useEffect(() => {
        const getTasks = async () => {
            const data = await getDocs(tasksCollectionRef)

            setTasks(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
        }

        getTasks()
    }, [tasks])

    return { tasks, tasksCollectionRef}
}