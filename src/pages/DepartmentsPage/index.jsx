import { Link } from 'react-router-dom'

import { Box, Text } from '@chakra-ui/react'

import { Header } from '../../components/Header'
import { Button } from '../../components/Button'

import { MdModeEdit } from 'react-icons/md'
import { MdDelete } from 'react-icons/md'

import { useState } from 'react'
import {
	doc,
	deleteDoc,
	collection,
	query,
	where,
	getDocs,
	updateDoc,
	arrayUnion,
} from 'firebase/firestore'
import { db } from '../../services/firebase'
import Modal from 'react-modal'
import { FaTrashAlt } from 'react-icons/fa'

import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import './styles.scss'

import { useQuery } from '@tanstack/react-query'
import { getDepartments } from '../../hooks/useDepartments'

export function DepartmentsPage() {
	Modal.setAppElement('#root')

	const { data: departments } = useQuery({
		queryKey: ['departments'],
		queryFn: getDepartments,
		staleTime: 1000 * 60 * 5,
	})

	const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false)
	const [confirmDeleteModalIsOpen, setConfirmDeleteModalIsOpen] = useState(false)

	const [selectedDepartment, setSelectedDepartment] = useState(null)
	const [employeesInDepartment, setEmployeesInDepartment] = useState([])

	const openDeleteModal = departmentId => {
		setSelectedDepartment(departmentId)
		setDeleteModalIsOpen(true)
	}

	const closeDeleteModal = () => {
		setDeleteModalIsOpen(false)
	}

	const openConfirmDeleteModal = employees => {
		setEmployeesInDepartment(employees)
		setConfirmDeleteModalIsOpen(true)
	}

	const closeConfirmDeleteModal = () => {
		setConfirmDeleteModalIsOpen(false)
		setEmployeesInDepartment([])
	}

	const handleDeleteDepartment = async () => {
		if (selectedDepartment) {
			if (selectedDepartment === 'bwLY5wnNiKoU0qZSeHQl') {
				console.error('Este departamento não pode ser excluído')
				toast.error('Este departamento não pode ser excluído')
				closeDeleteModal()
				return
			}

			try {
				const departmentDocRef = doc(db, 'departments', selectedDepartment)

				const employeesRef = collection(db, 'employees')

				const employeesQuery = query(
					employeesRef,
					where('department', '==', departmentDocRef)
				)

				const employeeSnapshots = await getDocs(employeesQuery)

				if (!employeeSnapshots.empty) {
					openConfirmDeleteModal(employeeSnapshots.docs)
					return
				}

				await deleteDoc(departmentDocRef)
				toast.success('Departamento excluído com sucesso')
			} catch (error) {
				toast.error('Erro ao excluir departamento')
				console.error('Erro ao excluir departamento: ', error)
			} finally {
				closeDeleteModal()
			}
		}
	}

	const confirmDeleteDepartment = async () => {
		try {
			const departmentDocRef = doc(db, 'departments', selectedDepartment)
			const newDepartmentDocRef = doc(db, 'departments', 'bwLY5wnNiKoU0qZSeHQl')

			const employeeUpdates = employeesInDepartment.map(employeeDoc => {
				const employeeUpdate = updateDoc(employeeDoc.ref, {
					department: newDepartmentDocRef,
				})

				const departmentUpdate = updateDoc(newDepartmentDocRef, {
					employees: arrayUnion(employeeDoc.ref),
				})

				return Promise.all([employeeUpdate, departmentUpdate])
			})

			await Promise.all(employeeUpdates)

			await deleteDoc(departmentDocRef)

			toast.success(
				'Departamento excluído e funcionários associados atualizados com sucesso'
			)
		} catch (error) {
			toast.error('Erro ao excluir departamento')
			console.error('Erro ao excluir departamento: ', error)
		} finally {
			closeConfirmDeleteModal()
			closeDeleteModal()
		}
	}

	return (
		<>
			<Header />
			<div className="departmentsPage">
				<Link to="/departments/new" className="addDepartment">
					<Button>
						<Box display="flex" justifyContent="center" alignItems="center">
							<Text>Adicionar departamento</Text>
						</Box>
					</Button>
				</Link>

				<div className="departmentListContainer">
					<h1>Departamentos</h1>

					<table>
						<thead>
							<tr>
								<th>Nome</th>
							</tr>
						</thead>
						<tbody>
							{departments.map(department => (
								<tr key={department.id}>
									<td>{department.name}</td>
									<td className="actions">
										<Link to={`/departments/${department.id}`}>
											<MdModeEdit size={24}>Edit</MdModeEdit>
										</Link>
										<MdDelete size={24} onClick={() => openDeleteModal(department.id)}>
											Delete
										</MdDelete>
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
							Quer mesmo excluir este departamento? <br />
							Ele será apagado para sempre.
						</p>
						<footer>
							<Button width isOutlined onClick={closeDeleteModal}>
								Cancelar
							</Button>
							<Button width onClick={handleDeleteDepartment}>
								Excluir
							</Button>
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
							Ainda existem funcionários neste departamento <br />
							Ele será apagado para sempre.
						</p>
						<footer>
							<Button width onClick={closeConfirmDeleteModal}>
								Cancelar
							</Button>
							<Button width isOutlined onClick={confirmDeleteDepartment}>
								Excluir
							</Button>
						</footer>
					</div>
				</div>
			</Modal>

			<ToastContainer
				position="top-center"
				autoClose={2500}
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
