import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '../../services/firebase'

import { Box } from '@chakra-ui/react'

import { Header } from '../../components/TaskEdit/Header'
import { Main } from '../../components/TaskEdit/Main'
import { Aside } from '../../components/TaskEdit/Aside'

export function TaskEditPage() {
    const [task, setTask] = useState([])
  
    const [newDescription, setNewDescription] = useState("")
    const [newDeadline, setNewDeadline] = useState("")
    const [newStatus, setNewStatus] = useState("")

    const params = useParams()
    const taskId = params.id

    const navigate = useNavigate()

    useEffect(() => {
        const docRef = doc(db, "tasks", taskId)

        const getTask = async () => {
            const doc = await getDoc(docRef)

            setTask({...doc.data(), id: doc.id})
        }

        getTask()

        setNewDescription(task.description)
        setNewDeadline(task.deadline)
        setNewStatus(task.status)
    }, [taskId, task.description, task.deadline, task.status])

    const updateTask = async (id, newDescription, newDeadline, newStatus) => {
        const taskDoc = doc(db, "tasks", id)
        
        const newFields = {
            description: newDescription, 
            deadline: newDeadline, 
            status: newStatus
        }

        await updateDoc(taskDoc, newFields)

        navigate("/home")
    }

    return (
        <Box as='div' bgColor='#F2F0F5' height='100vh' fontWeight='500' color='#FCFDFF' border='none'>
            <Header taskId={taskId} />
            <Box as='div' width='min(1440px, 90vw)' margin='0 auto' display='flex'>
                <Main taskId={taskId} setNewDescription={setNewDescription} setNewDeadline={setNewDeadline} setNewStatus={setNewStatus} />
                <Aside updateTask={updateTask} taskId={taskId} newDescription={newDescription} newDeadline={newDeadline} newStatus={newStatus} /> 
            </Box>
        </Box>
    )
}