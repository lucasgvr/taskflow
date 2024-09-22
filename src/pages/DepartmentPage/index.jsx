import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Box, Text, Input } from '@chakra-ui/react'

import { Header } from '../../components/Header'
import { Button } from '../../components/Button'

import { Loader } from '../../components/Loader'

import { MdModeEdit } from 'react-icons/md'
import { MdDelete } from 'react-icons/md'
import { FaTrashAlt } from 'react-icons/fa'

import { Link } from 'react-router-dom'

import './styles.scss'

import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Modal from 'react-modal'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
	checkIfDepartmentsNameExist,
	getDepartment,
	updateDepartmentName,
} from '../../hooks/useDepartments'
import { deleteEmployee } from '../../hooks/useEmployees'

export function DepartmentPage() {
	const queryClient = useQueryClient()

	Modal.setAppElement('#root')

	const { departmentId } = useParams()

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

	const { data: department } = useQuery({
		queryKey: ['department', departmentId],
		queryFn: () => getDepartment(departmentId),
		staleTime: 1000 * 60 * 5,
	})

	async function handleDeleteEmployee() {
		if (selectedEmployee) {
			try {
				await deleteEmployee(selectedEmployee)

				queryClient.invalidateQueries({ queryKey: ['department', departmentId] })

				toast.success('Funcionário excluído com sucesso!')
			} catch (error) {
				toast.error('Erro ao excluir funcionário!')
				console.error('Erro ao excluir funcionário: ', error)
			} finally {
				closeModal()

				setTimeout(() => {
					navigate('/departments')
				}, 2500)
			}
		}
	}

	async function handleUpdateDepartmentName() {
		if (departmentId === 'bwLY5wnNiKoU0qZSeHQl') {
			console.error('Este departamento não pode ser editado')
			toast.error('Este departamento não pode ser editado')
			setIsEditing(false)

			return
		}

		try {
			if (!departmentName) {
				toast.error('Nome do departamento não pode ser vazio!')
				return
			}

			if (await checkIfDepartmentsNameExist(departmentName)) {
				toast.error('Nome do departamento já existe!')
				return
			}

			await updateDepartmentName(departmentId, departmentName)

			queryClient.invalidateQueries({ queryKey: ['department', departmentId] })
			queryClient.invalidateQueries({ queryKey: ['departments'] })

			toast.success('Nome do departamento atualizado com sucesso!')

			setIsEditing(false)

			setTimeout(() => {
				navigate('/departments')
			}, 2500)
		} catch (error) {
			toast.error('Erro ao atualizar nome do departamento')
			console.error('Erro ao atualizar nome do departamento:', error)
		}
	}

	function formatCPF(value) {
		let formattedValue = value.replace(/\D/g, '')

		formattedValue = value.slice(0, 11)

		formattedValue = value.replace(/(\d{3})(\d)/, '$1.$2')
		formattedValue = value.replace(/(\d{3})(\d)/, '$1.$2')
		formattedValue = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')

		return formattedValue
	}

	function formatPhoneNumber(value) {
		let formattedValue = value.replace(/\D/g, '')

		formattedValue = value.slice(0, 11)

		formattedValue = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')

		return formattedValue
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
							<Button onClick={handleUpdateDepartmentName}>
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
				{department.employees.length > 0 ? (
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
								{department.employees.map(employee => (
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
