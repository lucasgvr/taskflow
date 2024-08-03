import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Box, Text, Input } from '@chakra-ui/react'

import { Header } from "../../components/Header"
import { Button } from "../../components/Button"

import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "../../services/firebase"

import { Loader } from '../../components/Loader';

import './styles.scss'
import { toast } from 'react-toastify';

export function DepartmentPage() {

    const { departmentId } = useParams()

    const [department, setDepartment] = useState('');
    const [employees, setEmployees] = useState([]);

    const [isEditing, setIsEditing] = useState(false);
    const [departmentName, setDepartmentName] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchDepartment() {
            try {
                const departmentRef = doc(db, 'departments', departmentId);
                const departmentSnapshot = await getDoc(departmentRef);
        
                if (departmentSnapshot.exists()) {
                    const departmentData = departmentSnapshot.data();
                    setDepartment(departmentData);
    
                    if (departmentData.employees) {
                        fetchEmployees(departmentData.employees);
                    }
                } else {
                    toast.error('Erro ao carregar departamento');
                    setTimeout(() => {
                        navigate('/departments');
                    }, 5000)
                    setDepartment(null);
                }
            } catch (error) {
                toast.error('Erro ao carregar departamento');
                console.error('Erro ao carregar departamento: ', error);
                setTimeout(() => {
                    navigate('/departments');
                }, 5000)
            }
        }

        async function fetchEmployees(employeeRefs) {
            try {
                const employeePromises = employeeRefs.map(employeeRef => getDoc(employeeRef));
    
                const employeeSnapshots = await Promise.all(employeePromises);
    
                const employeeData = employeeSnapshots.map(snapshot => {
                    if (snapshot.exists()) {
                        return snapshot.data();
                    } else {
                        console.log('Não existe funcionário'); 
                        return null;
                    }
                }).filter(data => data !== null); 
    
                const sortedEmployeeData = employeeData.sort((a, b) => {
                    if (a.firstName < b.firstName) return -1;
                    if (a.firstName > b.firstName) return 1;
                    return 0;
                });
        
                setEmployees(sortedEmployeeData);
            } catch (error) {
                console.error('Erro ao carregar funcionários:', error);
            }
        }

        fetchDepartment()
        // eslint-disable-next-line
    }, [departmentId])

    async function updateDepartmentName() {
        try {
            const departmentRef = doc(db, 'departments', departmentId);
            await updateDoc(departmentRef, { name: departmentName });
            toast.success('Nome do departamento atualizado com sucesso!');
            setDepartmentName(departmentName)
            setIsEditing(false)

            setTimeout(() => {
                navigate('/departments')
            }, 5000)
        } catch (error) {
            toast.error('Erro ao atualizar nome do departamento');
            console.error('Erro ao atualizar nome do departamento:', error);
        }
    }

    if (!department) {
        return <Loader />
    }
    

    return (
        <>
            <Header />
            <div className="editDepartmentsPage">
                <div className='titleButton'>
                    
                    <div className="departmentInfo">
                        <h1>Departamento: {isEditing ? 
                            <Input 
                                type='text' 
                                fontWeight='500' 
                                backgroundColor='#FCFDFF' 
                                border='1px solid #E1E3E6' 
                                borderRadius='0.313rem' 
                                padding='0.5rem 1.5rem' 
                                color='#5A5A66' 
                                placeholder='Novo nome do departamento'
                                mt='1rem' 
                                onChange={event => setDepartmentName(event.target.value)}
                            />
                            :
                            department.name}
                        </h1>
                    </div>
                

                    {isEditing ? 
                    <div className='buttons'>
                        <Button isOutlined onClick={() =>setIsEditing(false)}>
                            <Box display='flex' justifyContent='center' alignItems='center'>
                                <Text>Cancelar</Text>
                            </Box>
                        </Button>
                        <Button onClick={() =>updateDepartmentName()}>
                            <Box display='flex' justifyContent='center' alignItems='center'>
                                <Text>Salvar</Text>
                            </Box>
                        </Button>
                    </div>
                        
                    :
                        <Button onClick={() =>setIsEditing(true)}>
                            <Box display='flex' justifyContent='center' alignItems='center'>
                                <Text>Editar departamento</Text>
                            </Box>
                        </Button>
                    }

                </div>
                {employees.length > 0 ? (
                    <div className="employeesList">
                        <h2>Funcionários:</h2>
                        <ul>
                            {employees.map((employee, index) => (
                                <li key={index} className="employeeItem">
                                    <p><strong>Nome:</strong> {employee.firstName}</p>
                                    <p><strong>Sobrenome:</strong> {employee.lastName}</p>
                                    <p><strong>Email:</strong> {employee.email}</p>
                                    <p><strong>CPF:</strong> {employee.cpf}</p>
                                    <p><strong>Telefone:</strong> {employee.phone}</p>
                                    <p><strong>Senha:</strong> {employee.password}</p>
                                    <p><strong>Função:</strong> {employee.role === 'supervisor' ? 'Supervisor' : 'Funcionário'}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                    )
                    : (
                        <div className="noEmployeesMessage">
                            <h2>Nenhum funcionário encontrado</h2>
                        </div>
                    )}
            </div>
        </>
    )
}         