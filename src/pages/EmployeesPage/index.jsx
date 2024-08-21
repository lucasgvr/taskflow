import { useEmployees } from "../../hooks/useEmployees"

import { Link } from "react-router-dom"

import { Box, Text } from '@chakra-ui/react'

import React, { useEffect, useState } from 'react'

import { db } from "../../services/firebase"
import { getDoc, doc, deleteDoc, updateDoc, arrayRemove } from "firebase/firestore"
import { Header } from "../../components/Header"
import { Button } from "../../components/Button"

import { MdModeEdit } from "react-icons/md"
import { MdDelete } from "react-icons/md"
import { FaTrashAlt } from "react-icons/fa";

import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

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
                        console.error(`Erro ao encontrar departamento para o funcionário ${employee.id}:`, error)
                        departmentsData[employee.id] = 'Error ao encontrar departamento'
                    }
                }
            }

            setDepartments(departmentsData)
        }

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

        fetchDepartments()
        // eslint-disable-next-line
    }, [departments])


    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const openModal = (employeeId) => {
        setSelectedEmployee(employeeId);
        setModalIsOpen(true);
    };
    
    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedEmployee(null);
    };

    const handleDeleteEmployee = async () => {
        if (selectedEmployee) {
            try {
                // Reference to the employee document
                const docRef = doc(db, 'employees', selectedEmployee);
    
                // Fetch the employee document to get the department reference
                const employeeDoc = await getDoc(docRef);
                if (employeeDoc.exists()) {
                    const employeeData = employeeDoc.data();
                    const departmentRef = employeeData.department;
    
                    // Remove the employee reference from the department's employees array
                    if (departmentRef) {
                        await updateDoc(departmentRef, {
                            employees: arrayRemove(docRef)
                        });
                    }
    
                    // Delete the employee document
                    await deleteDoc(docRef);
                    toast.success('Funcionário excluído com sucesso!');
                } else {
                    toast.error('Funcionário não encontrado!');
                }
            } catch (error) {
                toast.error('Erro ao excluir funcionário!');
                console.error('Erro ao excluir funcionário: ', error);
            } finally {
                closeModal();
            }
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

    function formatPhoneNumber(value) {
        value = value.replace(/\D/g, '');
    
        value = value.slice(0, 11);
    
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    
        return value;
    }

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
                                <th>Função</th> 
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((employee) => (
                                <tr key={employee.id}>
                                    <td>{employee.firstName}</td>
                                    <td>{employee.lastName}</td>
                                    <td>{employee.email}</td>
                                    <td>{formatPhoneNumber(employee.phone)}</td>
                                    <td>{formatCPF(employee.cpf)}</td>
                                    <td>{departments[employee.id] ? departments[employee.id] : 'Carregando...'}</td>
                                    <td>{employee.role === 'supervisor' ? 'Supervisor' : 'Funcionário'}</td>
                                    <td className="actions">
                                        <Link to={`/employees/${employee.id}`}><MdModeEdit size={24}>Edit</MdModeEdit></Link>
                                        <MdDelete size={24} onClick={() => openModal(employee.id)}>Delete</MdDelete>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                isOpen={modalIsOpen}
                className="deleteEmployeeModal"
                onRequestClose={closeModal}

            >
                <div className="modalWrapper">
                    <div className="modal">
                        <FaTrashAlt size={48} />
                        <h3>Excluir Funcionário</h3>
                        <p>
                            Quer mesmo excluir este funcionário? <br/>
                            Ele será apagado para sempre.  
                        </p>
                        <footer>
                            <Button width isOutlined onClick={closeModal}>Cancelar</Button>
                            <Button width onClick={() => handleDeleteEmployee()}>Excluir</Button>
                        </footer>
                    </div>
                </div>
            </Modal>

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