import { useEmployees } from "../../hooks/useEmployees"
import { useDepartments } from "../../hooks/useDepartments"

import { Link } from "react-router-dom";

import { Box, Text } from '@chakra-ui/react'

import React, { useEffect, useState } from 'react'

import { db } from "../../services/firebase"
import { collection, getDocs, getDoc, doc } from "firebase/firestore"
import { Header } from "../../components/Header"
import { Button } from "../../components/Button"


export function EmployeesPage() {
    const { employees } = useEmployees()

    const [departments, setDepartments] = useState({})

    useEffect(() => {
        async function fetchDepartments() {
            const departmentsData = {}

            for (const employee of employees) {
                if (employee.id) {
                    try {
                        const departmentName = await getDepartmentOfEmployee(employee.id)
                        departmentsData[employee.id] = departmentName
                    } catch (error) {
                        console.error(`Error fetching department for employee ${employee.id}:`, error)
                        departmentsData[employee.id] = 'Error fetching department'
                    }
                }
            }

            setDepartments(departmentsData)
        }

        fetchDepartments()
    }, [employees])

    async function getDepartmentOfEmployee(employeeId) {
        const employeeDocRef = doc(db, 'employees', employeeId)
        const employeeDocSnapshot = await getDoc(employeeDocRef)

        if (employeeDocSnapshot.exists()) {
            const employeeData = employeeDocSnapshot.data()
            const departmentRef = employeeData.department
            
            const departmentDocSnapshot = await getDoc(departmentRef)

            if (!employeeDocSnapshot.exists()) {
                return('Departamento não encontrado')
            }

            const departmentData = departmentDocSnapshot.data()

            return(departmentData.name)
        }
    }

    return (
        <>
            <Header />
            <div>
                <Link to='/employees/new'>
                    <Button>
                        <Box display='flex' justifyContent='center' alignItems='center'>
                            <Text>Adicionar funcionário</Text>
                        </Box>
                    </Button>
                </Link>

                <div>
                    <h1>Funcionários</h1>

                    <table>
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>CPF</th>
                                <th>Department</th>
                                <th>Password</th>
                                <th>Actions</th> 
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((employee) => (
                                <tr key={employee.id}>
                                    <td>{employee.firstName}</td>
                                    <td>{employee.lastName}</td>
                                    <td>{employee.email}</td>
                                    <td>{employee.phone}</td>
                                    <td>{employee.cpf}</td>
                                    <td>{departments[employee.id]}</td>
                                    <td>{employee.password}</td>
                                    <td>
                                        <Link to={`/employees/${employee.id}`}><button>Edit</button></Link>
                                        <button>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}         