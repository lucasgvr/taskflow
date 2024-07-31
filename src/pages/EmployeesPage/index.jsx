import { useEmployees } from "../../hooks/useEmployees"

import { Link } from "react-router-dom"

import { Box, Text } from '@chakra-ui/react'

import React, { useEffect, useState } from 'react'

import { db } from "../../services/firebase"
import { getDoc, doc } from "firebase/firestore"
import { Header } from "../../components/Header"
import { Button } from "../../components/Button"

import { MdModeEdit } from "react-icons/md"
import { MdDelete } from "react-icons/md"
import { FaTrashAlt } from "react-icons/fa";

import './styles.scss'

import Modal from 'react-modal'

export function EmployeesPage() {
    Modal.setAppElement('#root');

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
    })

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

    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);
    const confirmDelete = () => {
        console.log('Employee deleted');
        closeModal();
    };

    return (
        <>
            <Header />
            <div className="employeesPage">
                <Link to='/employees/new' className="addEmployee">
                    <Button>
                        <Box display='flex' justifyContent='center' alignItems='center'>
                            <Text>Adicionar funcionário</Text>
                        </Box>
                    </Button>
                </Link>

                <div className="employeeListContainer">
                    <h1>Funcionários</h1>

                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Sobrenome</th>
                                <th>Email</th>
                                <th>Telefone</th>
                                <th>CPF</th>
                                <th>Departamento</th>
                                <th>Senha</th>
                                <th>Opções</th> 
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
                                    <td className="actions">
                                        <Link to={`/employees/${employee.id}`}><MdModeEdit size={24}>Edit</MdModeEdit></Link>
                                        <MdDelete size={24} onClick={openModal}>Delete</MdDelete>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Delete Confirmation"
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        padding: '4rem',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                        backgroundColor: '#fff',
                        border: 'none',
                    },
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    },
                }}
                >
                <Box display="flex" alignItems="center" justifyContent="center" mb="1rem">
                    <FaTrashAlt size="2rem" color="var(--orange)" />
                </Box>
                <Text fontWeight="bold" mb="1rem" textAlign="center">
                    Tem certeza que deseja excluir este funcionário?
                </Text>
                <Box display="flex" justifyContent="space-around">
                    <Button isOutlined onClick={confirmDelete}>
                        Sim, excluir
                    </Button>
                    <Button onClick={closeModal}>
                        Cancelar
                    </Button>
                </Box>
            </Modal>
        </>
    )
}         