import { useDepartments } from "../../hooks/useDepartments"

import { Link } from "react-router-dom";

import { Box, Text } from '@chakra-ui/react'

import { Header } from "../../components/Header"
import { Button } from "../../components/Button"

import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";

import { useState } from "react";
import { doc, deleteDoc, collection, query, where, getDocs, updateDoc } from "firebase/firestore"
import { db } from "../../services/firebase"
import Modal from 'react-modal'
import { FaTrashAlt } from "react-icons/fa";

import './styles.scss'

export function DepartmentsPage() {
    Modal.setAppElement('#root');


    const { departments } = useDepartments()

    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    const [confirmDeleteModalIsOpen, setConfirmDeleteModalIsOpen] = useState(false);

    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [employeesInDepartment, setEmployeesInDepartment] = useState([]);

    const openDeleteModal = (departmentId) => {
        setSelectedDepartment(departmentId);
        setDeleteModalIsOpen(true);
    };

    const closeDeleteModal = () => {
        setDeleteModalIsOpen(false);
    };

    const openConfirmDeleteModal = (employees) => {
        setEmployeesInDepartment(employees);
        setConfirmDeleteModalIsOpen(true);
    };

    const closeConfirmDeleteModal = () => {
        setConfirmDeleteModalIsOpen(false);
        setEmployeesInDepartment([]);
    };

     const handleDeleteDepartment = async () => {
        if (selectedDepartment) {
            try {
                const departmentDocRef = doc(db, 'departments', selectedDepartment);
                
                const employeesRef = collection(db, 'employees');

                const employeesQuery = query(
                    employeesRef,
                    where('department', '==', departmentDocRef)
                );

                const employeeSnapshots = await getDocs(employeesQuery);

                if (!employeeSnapshots.empty) {
                    // If employees are found, open the confirmation modal
                    openConfirmDeleteModal(employeeSnapshots.docs);
                    return; // Don't proceed with deletion until confirmation
                }

               

                await deleteDoc(departmentDocRef);
            } catch (error) {
                console.error('Error removing department: ', error);
            } finally {
                closeDeleteModal();
            }
        }
    }

    const confirmDeleteDepartment = async () => {
        console.log(selectedDepartment)
        try {
            const departmentDocRef = doc(db, 'departments', selectedDepartment);
            const newDepartmentDocRef = doc(db, 'departments', 'bwLY5wnNiKoU0qZSeHQl');

                
            const employeeUpdates = employeesInDepartment.map(employeeDoc => 
                updateDoc(employeeDoc.ref, { department: newDepartmentDocRef })
            );

            await Promise.all(employeeUpdates);

            await deleteDoc(departmentDocRef);

            console.log('Department and associated employees updated successfully');
        } catch (error) {
            console.error('Error removing department: ', error);
        } finally {
            closeConfirmDeleteModal();
            closeDeleteModal();
        }
    };

    return (
        <>
            <Header />
            <div className="departmentsPage">
                <Link to='/departments/new' className="addDepartment">
                    <Button>
                        <Box display='flex' justifyContent='center' alignItems='center'>
                            <Text>Adicionar departamento</Text>
                        </Box>
                    </Button>
                </Link>

                <div className="departmentListContainer">
                    <h1>Departamentos</h1>

                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Actions</th> 
                            </tr>
                        </thead>
                        <tbody>
                            {departments.map((department) => (
                                <tr key={department.id}>
                                    <td>{department.name}</td>
                                    <td className="actions"> 
                                        <MdModeEdit size={24}>Edit</MdModeEdit> 
                                        <MdDelete size={24} onClick={() => openDeleteModal(department.id)}>Delete</MdDelete> 
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                isOpen={deleteModalIsOpen}
                className="deleteEmployeeModal"
                onRequestClose={closeDeleteModal}

            >
                <div className="modalWrapper">
                    <div className="modal">
                        <FaTrashAlt size={48} />
                        <h3>Excluir Departamento</h3>
                        <p>
                            Quer mesmo excluir este departamento? <br/>
                            Ele será apagado para sempre.  
                        </p>
                        <footer>
                            <Button width isOutlined onClick={closeDeleteModal}>Cancelar</Button>
                            <Button width onClick={handleDeleteDepartment}>Excluir</Button>
                        </footer>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={confirmDeleteModalIsOpen}
                className="deleteEmployeeModal"
                onRequestClose={closeConfirmDeleteModal}

            >
                <div className="modalWrapper">
                    <div className="modal">
                        <FaTrashAlt size={48} />
                        <h3>Tem Certeza?</h3>
                        <p>
                            Ainda existem funcionários neste departamento <br/>
                            Ele será apagado para sempre.  
                        </p>
                        <footer>
                            <Button width onClick={closeConfirmDeleteModal}>Cancelar</Button>
                            <Button width isOutlined onClick={confirmDeleteDepartment}>Excluir</Button>
                        </footer>
                    </div>
                </div>
            </Modal>
        </>
    )
}         