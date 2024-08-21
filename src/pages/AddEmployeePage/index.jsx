import { Button } from "../../components/Button";
import { Header } from "../../components/Header";

import { Select } from '@chakra-ui/react'

import { useState } from "react";

import { Link } from "react-router-dom";

import { Box, Text, Input} from "@chakra-ui/react"

import { useDepartments } from "../../hooks/useDepartments";

import { db } from "../../services/firebase"
import { collection, doc, addDoc, updateDoc, arrayUnion } from "firebase/firestore"

import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

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
    const [role, setRole] = useState('')

    const [formattedCpf, setFormattedCpf] = useState('')
    const [formattedPhone, setFormattedPhone] = useState('')

    const { departments } = useDepartments()

    async function handleAddEmployee(event) {
        event.preventDefault()

        if (!firstName || !lastName || !email || !password || !cpf || !phone || !department || !role) {
            toast.error('Todos os campos são obrigatórios');
            return;
        }

        const isPhoneValid = /^\d{11}$/.test(phone);

        const isCpfValid = /^\d{11}$/.test(cpf);

        const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!isEmailValid.test(email)) {
            toast.error('Email inválido');
            return;
        }

        if (!isPhoneValid) {
            toast.error('Telefone deve conter apenas números e 11 dígitos');
            return;
        }

        if (!isCpfValid) {
            toast.error('CPF deve conter apenas números e 11 dígitos');
            return;
        }

        try {
            const departmentRef = doc(db, 'departments', department)
            
            const employeeRef = await addDoc(collection(db, 'employees'), {
                firstName,
                lastName,
                email,
                password, 
                cpf,
                phone,
                department: departmentRef,
                role,
                image: '' 
            });

            await updateDoc(departmentRef, {
                employees: arrayUnion(employeeRef)
            }); 
            
            toast.success('Funcionário adicionado com sucesso!')
            setTimeout(() => {
                navigate('/employees')
            }, 5000)
        } catch (error) {
            toast.error('Erro ao adicionar funcionário')
            console.error('Erro ao adicionar funcionário:', error)
        }
    }

    function formatCPF(value) {
        value = value.replace(/\D/g, '');
    
        value = value.slice(0, 11);

        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    
        return value;
    }

    const handleCpfChange = (e) => {
        const formattedCPF = formatCPF(e.target.value);
        setCpf(e.target.value.replace(/\D/g, ''));
        setFormattedCpf(formattedCPF);
    };

    function formatPhoneNumber(value) {
        value = value.replace(/\D/g, '');
    
        value = value.slice(0, 11);
    
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    
        return value;
    }

    const handlePhoneChange = (e) => {
        const formattedPHONE = formatPhoneNumber(e.target.value);
        setPhone(e.target.value.replace(/\D/g, ''));
        setFormattedPhone(formattedPHONE);
    };

    return (
        <>
            <Header />

            <Box as='main'>
                <Box as='div'>
                    <Box as='form' marginLeft='4rem' gap='2rem' display='flex' flexDirection='column' alignItems='center' justifyContent='center' onSubmit={handleAddEmployee}>
                        <Box as='fieldset' border='none' mt='3.5rem'>
                            <Text color='#5A5A66' fontWeight='600' fontSize='2rem' lineHeight='2.625rem'>
                                Adicionar Funcionário
                            </Text>

                            <Box as='div' height='1px' margin='1rem 0 2rem' backgroundColor='#E1E3E5'></Box>

                            <Box as='div' display='flex' flexDirection='row' gap='1.5rem' mt='1.5rem'>
                                <Box as='div' flex='1'>
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
                                
                                <Box as='div' flex='1'>
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

                            <Box as='div' display='flex' flexDirection='row' gap='1.5rem' mt='1.5rem'>
                                <Box as='div' flex='1'>
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
                                <Box as='div' flex='1'>
                                    <Box as='label' display='inline-block' fontWeight='500' color='#787880'>
                                        Senha
                                    </Box>
                                    <Input 
                                        type='password' 
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

                            <Box as='div' display='flex' flexDirection='row' gap='1.5rem' mt='1.5rem'>
                                <Box as='div' flex='1'>
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
                                        value={formattedCpf}
                                        onChange={handleCpfChange}
                                    />
                                </Box>
                            <Box as='div' flex='1'>
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
                                        value={formattedPhone}
                                        onChange={handlePhoneChange}
                                    />
                                </Box>
                            </Box>

                            <Box as='div' mt='1.5rem'>
                                <Box as='label' display='inline-block' fontWeight='500' color='#787880'>
                                    Departamento
                                </Box>
                                <Select 
                                    placeholder='Selecionar Departamento' 
                                    width='100%' 
                                    backgroundColor='#FCFDFF' 
                                    border='1px solid #E1E3E6' 
                                    borderRadius='0.313rem' 
                                    color='#5A5A66' 
                                    mt='1rem' 
                                    onChange={event => setDepartment(event.target.value)}
                                >
                                    {departments.map(department => (
                                    <option key={department.id} value={department.id}>{department.name}</option>
                                    ))}
                                </Select>
                            </Box>
                            <Box as='div' mt='1.5rem'>
                                <Box as='label' display='inline-block' fontWeight='500' color='#787880'>
                                    Função
                                </Box>
                                <Select 
                                    placeholder='Selecionar Função' 
                                    width='100%' 
                                    backgroundColor='#FCFDFF' 
                                    border='1px solid #E1E3E6' 
                                    borderRadius='0.313rem' 
                                    color='#5A5A66' 
                                    mt='1rem' 
                                    onChange={event => setRole(event.target.value)}
                                >
                                    <option key='supervisor' value='supervisor'>Supervisor</option>
                                    <option key='employee' value='employee'>Funcionário</option>
                                </Select>
                            </Box>
                        </Box>

                        <Box display='flex' flexDirection='column' gap='1rem' mt='2rem'>
                            <Button>
                                <Box display='flex' justifyContent='center' alignItems='center' width='35rem'>
                                    <Text>Adicionar funcionário</Text>
                                </Box>
                            </Button>

                            <Link to='/employees'>
                                <Button isOutlined>
                                    <Box display='flex' justifyContent='center' alignItems='center' width='38rem'>
                                        <Text>Listar Funcionários</Text>
                                    </Box>
                                </Button>
                            </Link>
                        </Box>
                    </Box>
                </Box>
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
        </>
    )
}