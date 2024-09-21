import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Box, Text, Input } from '@chakra-ui/react'

import { Header } from '../../components/Header'
import { Button } from '../../components/Button'

import {
	doc,
	getDoc,
	updateDoc,
	query,
	collection,
	where,
	getDocs,
	arrayRemove,
	deleteDoc,
} from 'firebase/firestore'
import { db } from '../../services/firebase'

import { Loader } from '../../components/Loader'

import { MdModeEdit } from 'react-icons/md'
import { MdDelete } from 'react-icons/md'
import { FaTrashAlt } from 'react-icons/fa'

import { Link } from 'react-router-dom'

import './styles.scss'

import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Modal from 'react-modal'

export function DepartmentPage() {
	Modal.setAppElement('#root')

	const { departmentId } = useParams()

	const [department, setDepartment] = useState('')
	const [employees, setEmployees] = useState([])

	const [isEditing, setIsEditing] = useState(false)
	const [departmentName, setDepartmentName] = useState('')

	const navigate = useNavigate()

	const [modalIsOpen, setModalIsOpen] = useState(false)
	const [selectedEmployee, setSelectedEmployee] = useState(null)

	const openModal = employeeId => {
		setSelectedEmployee(employeeId)
		setModalIsOpen(true)
	}

	const closeModal = () => {
		setModalIsOpen(false)
		setSelectedEmployee(null)
	}

	const handleDeleteEmployee = async () => {
		if (selectedEmployee) {
			try {
				// Reference to the employee document
				const docRef = doc(db, 'employees', selectedEmployee)

				// Fetch the employee document to get the department reference
				const employeeDoc = await getDoc(docRef)
				if (employeeDoc.exists()) {
					const employeeData = employeeDoc.data()
					const departmentRef = employeeData.department

					// Remove the employee reference from the department's employees array
					if (departmentRef) {
						await updateDoc(departmentRef, {
							employees: arrayRemove(docRef),
						})
					}

					// Delete the employee document
					await deleteDoc(docRef)
					toast.success('Funcionário excluído com sucesso!')
				} else {
					toast.error('Funcionário não encontrado!')
				}
			} catch (error) {
				toast.error('Erro ao excluir funcionário!')
				console.error('Erro ao excluir funcionário: ', error)
			} finally {
				closeModal()

				setTimeout(() => {
					navigate('/departments')
				}, 5000)
			}
		}
	}

	useEffect(() => {
		async function fetchDepartment() {
			try {
				const departmentRef = doc(db, 'departments', departmentId)
				const departmentSnapshot = await getDoc(departmentRef)

				if (departmentSnapshot.exists()) {
					const departmentData = departmentSnapshot.data()
					setDepartment(departmentData)

					if (departmentData.employees) {
						fetchEmployees(departmentData.employees)
					}
				} else {
					toast.error('Erro ao carregar departamento')
					setTimeout(() => {
						navigate('/departments')
					}, 5000)
					setDepartment(null)
				}
			} catch (error) {
				toast.error('Erro ao carregar departamento')
				console.error('Erro ao carregar departamento: ', error)
				setTimeout(() => {
					navigate('/departments')
				}, 5000)
			}
		}

		async function fetchEmployees(employeeRefs) {
			try {
				const employeePromises = employeeRefs.map(employeeRef =>
					getDoc(employeeRef)
				)

				const employeeSnapshots = await Promise.all(employeePromises)

				const employeeData = employeeSnapshots
					.map(snapshot => {
						if (snapshot.exists()) {
							return {
								id: snapshot.id, // Add the document ID here
								...snapshot.data(), // Spread the document data
							}
						} else {
							console.log('Não existe funcionário')
							return null
						}
					})
					.filter(data => data !== null)

				const sortedEmployeeData = employeeData.sort((a, b) => {
					if (a.firstName < b.firstName) return -1
					if (a.firstName > b.firstName) return 1
					return 0
				})

				setEmployees(sortedEmployeeData)
			} catch (error) {
				console.error('Erro ao carregar funcionários:', error)
			}
		}

		fetchDepartment()
		// eslint-disable-next-line
	}, [])

	async function updateDepartmentName() {
		if (departmentId === 'bwLY5wnNiKoU0qZSeHQl') {
			console.error('Este departamento não pode ser editado')
			toast.error('Este departamento não pode ser editado')
			setIsEditing(false)

			return
		}

		try {
			const departmentRef = doc(db, 'departments', departmentId)

			const q = query(
				collection(db, 'departments'),
				where('name', '==', departmentName)
			)
			const querySnapshot = await getDocs(q)

			if (!querySnapshot.empty) {
				toast.error('Nome do departamento já existe!')
				return
			}

			if (!departmentName) {
				toast.error('Nome do departamento não pode ser vazio!')
				return
			}

			await updateDoc(departmentRef, { name: departmentName })
			toast.success('Nome do departamento atualizado com sucesso!')
			setDepartmentName(departmentName)
			setIsEditing(false)

			setTimeout(() => {
				navigate('/departments')
			}, 5000)
		} catch (error) {
			toast.error('Erro ao atualizar nome do departamento')
			console.error('Erro ao atualizar nome do departamento:', error)
		}
	}

	function formatCPF(value) {
		value = value.replace(/\D/g, '')

		value = value.slice(0, 11)

		value = value.replace(/(\d{3})(\d)/, '$1.$2')
		value = value.replace(/(\d{3})(\d)/, '$1.$2')
		value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')

		return value
	}

	function formatPhoneNumber(value) {
		value = value.replace(/\D/g, '')

		value = value.slice(0, 11)

		value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')

		return value
	}

	if (!department) {
		return <Loader />
	}

	return (
		<>
			<Header />
			<div className="editDepartmentsPage">
				<div className="titleButton">
					<div className="departmentInfo">
						<h1>
							Departamento:{' '}
							{isEditing ? (
								<Input
									type="text"
									fontWeight="500"
									backgroundColor="#FCFDFF"
									border="1px solid #E1E3E6"
									borderRadius="0.313rem"
									padding="0.5rem 1.5rem"
									color="#5A5A66"
									placeholder="Novo nome do departamento"
									mt="1rem"
									onChange={event => setDepartmentName(event.target.value)}
								/>
							) : (
								department.name
							)}
						</h1>
					</div>

					{isEditing ? (
						<div className="buttons">
							<Button isOutlined onClick={() => setIsEditing(false)}>
								<Box display="flex" justifyContent="center" alignItems="center">
									<Text>Cancelar</Text>
								</Box>
							</Button>
							<Button onClick={() => updateDepartmentName()}>
								<Box display="flex" justifyContent="center" alignItems="center">
									<Text>Salvar</Text>
								</Box>
							</Button>
						</div>
					) : (
						<Button onClick={() => setIsEditing(true)}>
							<Box display="flex" justifyContent="center" alignItems="center">
								<Text>Editar departamento</Text>
							</Box>
						</Button>
					)}
				</div>
				{employees.length > 0 ? (
					<div className="employeesList">
						<h2>Funcionários:</h2>
						<table>
							<thead>
								<tr>
									<th>Nome</th>
									<th>Sobrenome</th>
									<th>Email</th>
									<th>Telefone</th>
									<th>CPF</th>
									<th>Função</th>
								</tr>
							</thead>
							<tbody>
								{employees.map(employee => (
									<tr key={employee.id}>
										<td>{employee.firstName}</td>
										<td>{employee.lastName}</td>
										<td>{employee.email}</td>
										<td>{formatPhoneNumber(employee.phone)}</td>
										<td>{formatCPF(employee.cpf)}</td>
										<td>
											{employee.role === 'supervisor' ? 'Supervisor' : 'Funcionário'}
										</td>
										<td className="actions">
											<Link to={`/employees/${employee.id}`}>
												<MdModeEdit size={24}>Edit</MdModeEdit>
											</Link>
											<MdDelete size={24} onClick={() => openModal(employee.id)}>
												Delete
											</MdDelete>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				) : (
					<div className="noEmployeesMessage">
						<h2>Nenhum funcionário encontrado</h2>
					</div>
				)}
			</div>

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
							Quer mesmo excluir este funcionário? <br />
							Ele será apagado para sempre.
						</p>
						<footer>
							<Button width isOutlined onClick={closeModal}>
								Cancelar
							</Button>
							<Button width onClick={() => handleDeleteEmployee()}>
								Excluir
							</Button>
						</footer>
					</div>
				</div>
			</Modal>
		</>
	)
}
