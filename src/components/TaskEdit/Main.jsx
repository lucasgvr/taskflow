import { useState, useEffect } from "react"

import { doc, getDoc } from "firebase/firestore"
import { db } from "../../services/firebase"

import { Box, Text, Input, Select } from "@chakra-ui/react"
import { useAuth } from "../../hooks/useAuth"
import { Loader } from "../Loader"

export function Main({ taskId, setNewDescription, setNewDeadline, setNewStatus, setNewAssign, departments, employees }) {
    const [task, setTask] = useState([])
    const [assignName, setAssignName] = useState('');

    const { currentUser } = useAuth()

    useEffect(() => {
        const fetchTaskAndAssignName = async () => {
            // Fetch task data
            const taskDocRef = doc(db, 'tasks', taskId);
            const taskDoc = await getDoc(taskDocRef);
            const taskData = { ...taskDoc.data(), id: taskDoc.id };

            setTask(taskData);

            // Check if taskData.assign is a Firestore DocumentReference
            if (taskData.assign) {
                const assignRef = taskData.assign;  // This is a Firestore DocumentReference
                const assignPath = assignRef.path;  // Extract the path

                const isEmployee = assignPath.startsWith('employees/');
                const isDepartment = assignPath.startsWith('departments/');
                
                if (isEmployee || isDepartment) {
                    const assignDocSnap = await getDoc(assignRef); // Use the reference directly to fetch data
                    if (assignDocSnap.exists()) {
                        const assignData = assignDocSnap.data();
                        setAssignName(isEmployee ? `${assignData.firstName} ${assignData.lastName}` : assignData.name);
                    }
                }
            } else {
                setAssignName('Desconhecido');
            }
        };

        fetchTaskAndAssignName();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [taskId]);

    if (!task) {
        return <Loader />
    }

    return (
        <Box as='main'>
            <Box as='div'>
                {currentUser.role === 'supervisor' ? (

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
                                    type="date" 
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
                                    Status
                                </Box>
                                <Select 
                                    fontWeight='500' 
                                    backgroundColor='#FCFDFF' 
                                    border='1px solid #E1E3E6' 
                                    borderRadius='0.313rem' 
                                    width='100%' 
                                    color='#5A5A66' 
                                    defaultValue={task.status}
                                    onChange={(event) => {setNewStatus(event.target.value)}} 
                                    >
                                    <option value="">Selecionar</option>
                                    <option value="Em andamento">Em andamento</option>
                                    <option value="Encerrada">Encerrada</option>
                                </Select>
                            </Box>
                        </Box>
                        <Box as='div' mt='1rem'>
                                <Box as='label' display='inline-block' fontWeight='500' color='#787880'>
                                    Atribuir à
                                </Box>
                                <Select 
                                    fontWeight='500' 
                                    backgroundColor='#FCFDFF' 
                                    border='1px solid #E1E3E6' 
                                    borderRadius='0.313rem' 
                                    width='100%' 
                                    color='#5A5A66' 
                                    onChange={(event) => {setNewAssign(event.target.value)}} 
                                >
                                    <option value="">Selecionar</option>
                                    <optgroup label="Departamentos">
                                        {departments.map((dept, index) => (
                                            <option key={index} value={`department:${dept.id}`}>{dept.name}</option>
                                        ))}
                                    </optgroup>
                                    <optgroup label="Funcionários">
                                        {employees.map((emp, index) => (
                                            <option key={index} value={`employee:${emp.id}`}>{emp.firstName} {emp.lastName}</option>
                                        ))}
                                    </optgroup>
                                </Select>
                            </Box>
                    </Box>
                </Box>
                ) : (
                    <Box as='form'>
                    <Box as='fieldset' border='none' mt='3.5rem'>
                        <Text color='#5A5A66' fontWeight='600' fontSize='2rem' lineHeight='2.625rem'>Dados da Tarefa</Text>
                        <Box as='div' height='1px' margin='1rem 0 2rem' backgroundColor='#E1E3E5'></Box>
                        <Box as='div'>
                            <Box as='label' display='inline-block' fontWeight='500' color='#787880'>
                                Descrição
                            </Box>
                            <Text 
                                fontWeight='500' 
                                backgroundColor='#FCFDFF' 
                                border='1px solid #E1E3E6' 
                                borderRadius='0.313rem' 
                                padding='0.75rem 1.5rem' 
                                width='100%' 
                                color='#5A5A66' 
                            >{task.description}</Text>
                        </Box>
                        <Box as='div' display='flex' mt='1.5rem'>
                            <Box as='div'>
                                <Box as='label' display='inline-block' fontWeight='500' color='#787880'>
                                    Prazo
                                </Box>
                                <Text 
                                    fontWeight='500' 
                                    backgroundColor='#FCFDFF' 
                                    border='1px solid #E1E3E6' 
                                    borderRadius='0.313rem' 
                                    padding='0.75rem 1.5rem' 
                                    width='100%' 
                                    color='#5A5A66' 
                                >{task.deadline}</Text>
                            </Box>
                            <Box as='div' ml='1.5rem'>
                                <Box as='label' display='inline-block' fontWeight='500' color='#787880'>
                                    Status
                                </Box>
                                <Text 
                                    fontWeight='500' 
                                    backgroundColor='#FCFDFF' 
                                    border='1px solid #E1E3E6' 
                                    borderRadius='0.313rem' 
                                    padding='0.75rem 1.5rem' 
                                    width='100%' 
                                    color='#5A5A66' 
                                >{task.status}</Text>
                            </Box>
                        </Box>
                        <Box as='div' mt='1rem'>
                                <Box as='label' display='inline-block' fontWeight='500' color='#787880'>
                                    Atribuir à
                                </Box>
                                <Text 
                                    fontWeight='500' 
                                    backgroundColor='#FCFDFF' 
                                    border='1px solid #E1E3E6' 
                                    borderRadius='0.313rem' 
                                    padding='0.75rem 1.5rem' 
                                    width='100%' 
                                    color='#5A5A66'
                                >
                                    {assignName || 'Desconhecido'}
                                </Text>
                            </Box>
                    </Box>
                </Box>
                )}
            </Box>
        </Box>
    );
}