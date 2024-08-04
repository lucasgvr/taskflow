import { useState, useEffect } from "react"

import { doc, getDoc } from "firebase/firestore"
import { db } from "../../services/firebase"

import { Box, Text, Input} from "@chakra-ui/react"

export function Main({ taskId, setNewDescription, setNewDeadline, setNewStatus }) {
    const [task, setTask] = useState([])
    
    useEffect(() => {
        const docRef = doc(db, "tasks", taskId)

        const getTask = async () => {
            const doc = await getDoc(docRef)

            setTask({...doc.data(), id: doc.id})
        }

        getTask()
        // eslint-disable-next-line
    }, [])

    return (
        <Box as='main'>
            <Box as='div'>
                <Box as='form'>
                    <Box as='fieldset' border='none' mt='3.5rem'>
                        <Text color='#5A5A66' fontWeight='600' fontSize='2rem' lineHeight='2.625rem'>Dados da Tarefa</Text>
                        <Box as='div' height='1px' margin='1rem 0 2rem' backgroundColor='#E1E3E5'></Box>
                        <Box as='div'>
                            <Box as='label' display='inline-block' fontWeight='500' color='#787880'>
                                Descrição
                            </Box>
                            <Input 
                                type="text" 
                                fontWeight='500' 
                                backgroundColor='#FCFDFF' 
                                border='1px solid #E1E3E6' 
                                borderRadius='0.313rem' 
                                padding='0.75rem 1.5rem' 
                                width='100%' 
                                color='#5A5A66' 
                                defaultValue={task.description} 
                                onChange={(event) => setNewDescription(event.target.value)}
                            />
                        </Box>
                        <Box as='div' display='flex' mt='1.5rem'>
                            <Box as='div'>
                                <Box as='label' display='inline-block' fontWeight='500' color='#787880'>
                                    Prazo
                                </Box>
                                <Input 
                                    type="text" 
                                    fontWeight='500' 
                                    backgroundColor='#FCFDFF' 
                                    border='1px solid #E1E3E6' 
                                    borderRadius='0.313rem' 
                                    padding='0.75rem 1.5rem' 
                                    width='100%' 
                                    color='#5A5A66' 
                                    defaultValue={task.deadline} 
                                    contentEditable="true" 
                                    onChange={(event) => setNewDeadline(event.target.value)}
                                />
                            </Box>
                            <Box as='div' ml='1.5rem'>
                                <Box as='label' display='inline-block' fontWeight='500' color='#787880'>
                                    Status (Em andamento/Encerrada)
                                </Box>
                                <Input 
                                    type="text" 
                                    fontWeight='500' 
                                    backgroundColor='#FCFDFF' 
                                    border='1px solid #E1E3E6' 
                                    borderRadius='0.313rem' 
                                    padding='0.75rem 1.5rem' 
                                    width='100%' 
                                    color='#5A5A66' 
                                    defaultValue={task.status}
                                    onChange={(event) => setNewStatus(event.target.value)}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}