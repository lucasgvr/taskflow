import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

import { useDepartments } from '../../hooks/useDepartments'
import { useEmployees } from '../../hooks/useEmployees'

import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '../../services/firebase'

import { Button } from '../../components/Button'

import { Box, Textarea, Heading, VStack, Text, HStack, IconButton } from '@chakra-ui/react'

import { Header } from '../../components/TaskEdit/Header'
import { Main } from '../../components/TaskEdit/Main'
import { Aside } from '../../components/TaskEdit/Aside'

import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

import { DeleteIcon } from '@chakra-ui/icons';

export function TaskEditPage() {
    const [task, setTask] = useState([])
  
    const [newDescription, setNewDescription] = useState("")
    const [newDeadline, setNewDeadline] = useState("")
    const [newStatus, setNewStatus] = useState("")
    const [newAssign, setNewAssign] = useState("")
    // eslint-disable-next-line
    const [newNotes, setNewNotes] = useState("")
    const [newNote, setNewNote] = useState("")


    const params = useParams()
    const taskId = params.id

    const { departments } = useDepartments()
    const { employees } = useEmployees()

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
        setNewAssign(task.assign)
        setNewNotes(task.notes)
        // eslint-disable-next-line
    }, [])

    const updateTask = async (id, newDescription, newDeadline, newStatus, newAssign, updatedNotes) => {
        const taskDoc = doc(db, "tasks", id)

        let assignRef

        const deadlineDate = new Date(newDeadline + 'T00:00:00')
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        deadlineDate.setHours(0, 0, 0, 0);

        if (deadlineDate < today) {
            toast.error("A data de prazo está anterior à data de hoje!")
        }
    
        if (newAssign) {
            assignRef = newAssign.includes('department') ? 
                doc(db, 'departments', newAssign.split(':')[1]) :
                doc(db, 'employees', newAssign.split(':')[1]);
        }
        
        const newFields = {
            description: newDescription || task.description, 
            deadline:  deadlineDate < today ? task.deadline : newDeadline, 
            status: newStatus || task.status,
            assign: assignRef || task.assign,
            notes: updatedNotes || task.notes
        }

        await updateDoc(taskDoc, newFields)

        toast.success('Tarefa atualizada com sucesso!')

        setTimeout(() => {
            navigate('/home')
        }, 5000)
    }

    const addNote = () => {
        const createdAt = new Date().toISOString()

        const updatedNotes = [
            ...(task.notes || []), 
            { 
                description: newNote,
                createdBy: 'Lucas Rocha',
                createdAt: createdAt
            }
        ]        
        setTask({ ...task, notes: updatedNotes });
        toast.success('Anotação adicionada com sucesso!')
        setNewNote("");
    };

    const handleDeleteNote = (noteIndex) => {
        const updatedNotes = task.notes.filter((_, index) => index !== noteIndex);
        setTask({ ...task, notes: updatedNotes });
        toast.success('Anotação removida com sucesso!');
    };

    return (
        <Box as='div' fontWeight='500' color='#FCFDFF' border='none'>
            <Header taskId={taskId} />
            <Box as='div' width='min(1440px, 90vw)' margin='0 auto' display='flex' justifyContent='center'>
                <Main taskId={taskId} setNewDescription={setNewDescription} setNewDeadline={setNewDeadline} setNewStatus={setNewStatus} setNewAssign={setNewAssign} departments={departments} employees={employees} />
                <Aside updateTask={updateTask} taskId={taskId} newDescription={newDescription} newDeadline={newDeadline} newStatus={newStatus} newAssign={newAssign} /> 
            </Box>

            <Box as='div' width='min(900px, 90vw)' margin='4rem auto' display='flex' gap='1rem' alignItems='center' justifyContent='center'>
                <Textarea
                    placeholder="Adicionar anotações..."
                    backgroundColor='#fff'
                    color='#5A5A66'
                    borderRadius='0.313rem'
                    resize='none'
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                />  
                <Button onClick={addNote}>Adicionar</Button>
            </Box>
            <Box as='div' width='min(900px, 90vw)' margin='1rem auto'>
                <Heading size="md" mb="1rem" color='#5A5A66'>Anotações</Heading>
                <VStack spacing={4} align="start" width='100%'>
                        {task && task.notes && task.notes.length > 0 ? task.notes.map((note, index) => (
                        <Box key={index} p={4} width='100%' borderRadius="0.313rem" border='1px solid #E1E3E6'>
                            <HStack justifyContent="space-between" width='100%'>
                                <VStack align="start" width='100%'>
                                    <Text color='#5A5A66'>{note.description}</Text>
                                    <Box display='flex' justifyContent='space-between' width='100%'>
                                        <Text color='#5A5A66' fontSize="sm">Criado por: {note.createdBy}</Text>
                                        <Text color='#5A5A66' fontSize="sm">Data de criação: {new Date(note.createdAt).toLocaleString()}</Text>
                                    </Box>
                                </VStack>
                                <IconButton
                                    icon={<DeleteIcon />}
                                    aria-label="Delete Note"
                                    onClick={() => handleDeleteNote(index)}
                                    bgColor='var(--orange)'
                                    size='sm'
                                    transition='0.25s'
                                    _hover={{ filter: 'brightness(0.9)' }}
                                />
                            </HStack>
                        </Box>
                    )) : (
                        <Text color='#5A5A66'>Não há anotações para esta tarefa</Text>
                    )}
                </VStack>
            </Box>

            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                draggable
                theme="light"
                pauseOnFocusLoss={false}
                pauseOnHover={false}
            />
        </Box>
    )
}