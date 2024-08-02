import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Box, Text, Input } from '@chakra-ui/react'

import { Header } from "../../components/Header"
import { Button } from "../../components/Button"

import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "../../services/firebase"

import './styles.scss'

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
                    console.log('Department Data:', departmentData);
                    setDepartment(departmentData);
    
                    if (departmentData.employees) {
                        fetchEmployees(departmentData.employees);
                    }
                } else {
                    console.log('No such document!');
                    setDepartment(null);
                }
            } catch (error) {
                console.error('Error fetching document:', error);
                throw error;
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
                        console.log('No such employee document!');
                        return null;
                    }
                }).filter(data => data !== null); 
    
                setEmployees(employeeData);
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        }

        fetchDepartment()
    }, [departmentId])

    async function updateDepartmentName() {
        try {
            const departmentRef = doc(db, 'departments', departmentId);
            await updateDoc(departmentRef, { name: departmentName });
            console.log('Department name updated successfully');
            setDepartmentName(departmentName)
            setIsEditing(false)

            navigate('/departments')
        } catch (error) {
            console.error('Error updating department name:', error);
        }
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
                        <Button onClick={() =>updateDepartmentName()}>
                            <Box display='flex' justifyContent='center' alignItems='center'>
                                <Text>Salvar</Text>
                            </Box>
                        </Button>
                        
                    :
                        <Button onClick={() =>setIsEditing(true)}>
                            <Box display='flex' justifyContent='center' alignItems='center'>
                                <Text>Editar departamento</Text>
                            </Box>
                        </Button>
                    }

                </div>
                {employees.length > 0 && (
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
                                    <p><strong>Função:</strong> {employee.role === 'supervisor' ? 'Supervisor' : 'Employee'}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                    )}
            </div>
        </>
    )
}         