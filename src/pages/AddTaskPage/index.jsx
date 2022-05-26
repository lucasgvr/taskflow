import { useTasks } from '../../hooks/useTasks.js'

import { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { addDoc } from 'firebase/firestore'

import { Box } from '@chakra-ui/react'

import { Header } from '../../components/AddTask/Header.jsx'
import { Main } from '../../components/AddTask/Main.jsx'
import { Aside } from '../../components/AddTask/Aside.jsx'

export function AddTaskPage() {
    const [newDescription, setNewDescription] = useState("")
    const [newDeadline, setNewDeadline] = useState("")
    const [newAssign, setNewAssign] = useState("")

    const { tasksCollectionRef } = useTasks()

    const navigate = useNavigate()
    
    async function addTask() {
        await addDoc(tasksCollectionRef, 
            {
                description: newDescription, 
                deadline: newDeadline, 
                assign: newAssign, 
                status: "Em andamento"
            })

        navigate("/home")
    }

    return (
        <Box as='body' bgColor='#F0F2F5' height='100vh' fontWeight='500' color='#FCFDFF' border='none'>
            <Header />
            <Box as='div' width='min(1440px, 90vw)' margin='0 auto' display='flex'>
                <Main setNewDescription={setNewDescription} setNewDeadline={setNewDeadline} setNewAssign={setNewAssign} />
                <Aside addTask={addTask} /> 
            </Box>
        </Box>
    )
}