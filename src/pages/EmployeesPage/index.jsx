import { Link } from 'react-router-dom'

import { Box, Text } from '@chakra-ui/react'

import React, { useEffect, useState } from 'react'

import { db } from '../../services/firebase'
import {
	getDoc,
	doc,
	deleteDoc,
	updateDoc,
	arrayRemove,
} from 'firebase/firestore'
import { Header } from '../../components/Header'
import { Button } from '../../components/Button'

import { MdModeEdit } from 'react-icons/md'
import { MdDelete } from 'react-icons/md'
import { FaTrashAlt } from 'react-icons/fa'

import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import './styles.scss'

import Modal from 'react-modal'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteEmployee, getEmployees } from '../../hooks/useEmployees'

export function EmployeesPage() {
	const queryClient = useQueryClient()

	Modal.setAppElement('#root')

	const { data: employees } = useQuery({
		queryKey: ['employees'],
		queryFn: getEmployees,
		staleTime: 1000 * 60 * 5,
	})

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

	async function handleDeleteEmployee() {
		if (selectedEmployee) {
			try {
				const employeeToDelete = employees.find(
					employee => employee.id === selectedEmployee
				)

				await deleteEmployee(selectedEmployee)

				queryClient.invalidateQueries({ queryKey: ['employees'] })
				queryClient.invalidateQueries({
					queryKey: ['department', employeeToDelete.departmentId],
				})

				toast.success('Funcionário excluído com sucesso!')
			} catch (error) {
				toast.error('Erro ao excluir funcionário!')
				console.error('Erro ao excluir funcionário: ', error)
			} finally {
				closeModal()
			}
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

	return (
		<>
			<Header />
			<div className="employeesPage">
				<Link to="/employees/new" className="addEmployee">
					<Button>
						<Box display="flex" justifyContent="center" alignItems="center">
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
							{employees?.map(employee => (
								<tr key={employee.id}>
									<td>{employee.firstName}</td>
									<td>{employee.lastName}</td>
									<td>{employee.email}</td>
									<td>{formatPhoneNumber(employee.phone)}</td>
									<td>{formatCPF(employee.cpf)}</td>
									<td>{employee.department.name}</td>
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
