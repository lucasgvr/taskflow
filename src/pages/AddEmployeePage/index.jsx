import { Button } from "../../components/Button";
import { Header } from "../../components/Header";

import { Select } from '@chakra-ui/react'

import { useState } from "react";

import { Link } from "react-router-dom";

import { Box, Text, Input} from "@chakra-ui/react"

import { useDepartments } from "../../hooks/useDepartments";

import { db } from "../../services/firebase"
import { collection, getDocs, doc, addDoc } from "firebase/firestore"

import { useNavigate } from "react-router-dom";

export function AddEmployeePage() {
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [cpf, setCpf] = useState('')
    const [phone, setPhone] = useState('')
    const [department, setDepartment] = useState('')

    const { departments } = useDepartments()

    async function handleAddEmployee(event) {
        event.preventDefault()

        try {
            const departmentRef = doc(db, 'departments', department)
            
            await addDoc(collection(db, 'employees'), {
                firstName,
                lastName,
                email,
                password, // Consider hashing passwords in production
                cpf,
                phone,
                department: departmentRef,
                image: '' // Store the reference
            });
            
            console.log('User added successfully')
            navigate('/employees')
        } catch (error) {
            console.error('Error adding user:', error)
        }
    }

    return (
        <>
            <Header />
            <Box as='main'>
                <Box as='div'>
                    <Box as='form' marginLeft='4rem' gap='2rem' display='flex'
                    flexDirection='column' alignItems='center' justifyContent='center' onSubmit={handleAddEmployee}>
                        <Box as='fieldset' border='none' mt='3.5rem'>
                            <Text color='#5A5A66' fontWeight='600' fontSize='2rem' lineHeight='2.625rem'>
                                Adicionar Funcionário
                            </Text>

                            <Box as='div' height='1px' margin='1rem 0 2rem' backgroundColor='#E1E3E5'></Box>

                            <Box as='div' display='flex' mt='1.5rem'>
                                <Box as='div'>
                                    <Box as='label' display='inline-block' fontWeight='500' color='#787880'>
                                        Nome
                                    </Box>
                                    <Input 
                                        type='text' 
                                        fontWeight='500' 
                                        backgroundColor='#FCFDFF' 
                                        border='1px solid #E1E3E6'
                                        borderRadius='0.313rem' 
                                        padding='0.5rem 1.5rem' 
                                        width='100%' 
                                        color='#5A5A66' 
                                        mt='1rem' 
                                        onChange={event => setFirstName(event.target.value)}
                                    />
                                </Box>
                                <Box as='div' ml='1.5rem'>
                                    <Box as='label' display='inline-block' fontWeight='500' color='#787880'>
                                        Sobrenome
                                    </Box>
                                    <Input 
                                        type='text' 
                                        fontWeight='500' 
                                        backgroundColor='#FCFDFF' 
                                        border='1px solid #E1E3E6' 
                                        borderRadius='0.313rem' 
                                        padding='0.5rem 1.5rem' 
                                        width='100%' 
                                        color='#5A5A66' 
                                        mt='1rem' 
                                        onChange={event => setLastName(event.target.value)}
                                    />
                                </Box>
                            </Box>
                            <Box as='div' display='flex' mt='1.5rem'>
                                <Box as='div'>
                                    <Box as='label' display='inline-block' fontWeight='500' color='#787880'>
                                        Email
                                    </Box>
                                    <Input 
                                        type='text' 
                                        fontWeight='500' 
                                        backgroundColor='#FCFDFF' 
                                        border='1px solid #E1E3E6'
                                        borderRadius='0.313rem' 
                                        padding='0.5rem 1.5rem' 
                                        width='100%' 
                                        color='#5A5A66' 
                                        mt='1rem' 
                                        onChange={event => setEmail(event.target.value)}
                                    />
                                </Box>
                                <Box as='div' ml='1.5rem'>
                                    <Box as='label' display='inline-block' fontWeight='500' color='#787880'>
                                        Senha
                                    </Box>
                                    <Input 
                                        type='text' 
                                        fontWeight='500' 
                                        backgroundColor='#FCFDFF' 
                                        border='1px solid #E1E3E6' 
                                        borderRadius='0.313rem' 
                                        padding='0.5rem 1.5rem' 
                                        width='100%' 
                                        color='#5A5A66' 
                                        mt='1rem' 
                                        onChange={event => setPassword(event.target.value)}
                                    />
                                </Box>
                            </Box>
                            <Box as='div' display='flex' mt='1.5rem'>
                                <Box as='div'>
                                    <Box as='label' display='inline-block' fontWeight='500' color='#787880'>
                                        CPF
                                    </Box>
                                    <Input 
                                        type='text' 
                                        fontWeight='500' 
                                        backgroundColor='#FCFDFF' 
                                        border='1px solid #E1E3E6'
                                        borderRadius='0.313rem' 
                                        padding='0.5rem 1.5rem' 
                                        width='100%' 
                                        color='#5A5A66' 
                                        mt='1rem' 
                                        onChange={event => setCpf(event.target.value)}
                                    />
                                </Box>
                                <Box as='div' ml='1.5rem'>
                                    <Box as='label' display='inline-block' fontWeight='500' color='#787880'>
                                        Telefone
                                    </Box>
                                    <Input 
                                        type='text' 
                                        fontWeight='500' 
                                        backgroundColor='#FCFDFF' 
                                        border='1px solid #E1E3E6' 
                                        borderRadius='0.313rem' 
                                        padding='0.5rem 1.5rem' 
                                        width='100%' 
                                        color='#5A5A66' 
                                        mt='1rem' 
                                        onChange={event => setPhone(event.target.value)}
                                    />
                                </Box>
                            </Box>

                            <Box as='div' display='flex' mt='1.5rem'>
                                <Box as='div'>
                                    <Box as='label' display='inline-block' fontWeight='500' color='#787880'>
                                        Departamento
                                    </Box>
                                    <Select placeholder='Select option' onChange={event => setDepartment(event.target.value)}>
                                        {departments.map(department => (
                                            <option key={department.id} value={department.id}>{department.name}</option>
                                        ))}
                                    </Select>
                                </Box>
                            </Box>
                        </Box>

                        <Button>
                            <Box display='flex' justifyContent='center' alignItems='center' width='35rem'>
                                <Text>Adicionar funcionário</Text>
                            </Box>
                        </Button>

                        <Link to='/employees'>
                            <Button isOutlined>
                                <Box display='flex' justifyContent='center' alignItems='center' width='35rem'>
                                    <Text>Listar Funcionários</Text>
                                </Box>
                            </Button>
                        </Link>
                    </Box>
                </Box>
            </Box>
        </>
    )
}