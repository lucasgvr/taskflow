// EmployeeDetailPage.js
import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { db } from '../../services/firebase' // Firebase configuration file
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getDepartments } from '../../hooks/useDepartments'

import { Header } from '../../components/Header'

import './styles.scss'
import { Button } from '../../components/Button'

import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { Loader } from '../../components/Loader'
import { useAuth } from '../../hooks/useAuth'
import { getEmployee } from '../../hooks/useEmployees'

export function EmployeePage() {
	const queryClient = useQueryClient()

	const { employeeId } = useParams()

	const navigate = useNavigate()

	const { data: departments } = useQuery({
		queryKey: ['departments'],
		queryFn: getDepartments,
		staleTime: 1000 * 60 * 5,
	})

	const { data: employee } = useQuery({
		queryKey: ['employee', employeeId],
		queryFn: () => getEmployee(employeeId),
		staleTime: 1000 * 60 * 5,
	})

	const [isEditing, setIsEditing] = useState(false)
	const [firstName, setFirstName] = useState(employee?.firstName)
	const [lastName, setLastName] = useState(employee?.lastName)
	const [email, setEmail] = useState(employee?.email)
	const [cpf, setCpf] = useState(employee?.cpf)
	const [phone, setPhone] = useState(employee?.phone)
	const [department, setDepartment] = useState(employee?.departmentId)
	const [role, setRole] = useState(employee?.role)

	const { currentUser, logout } = useAuth()

	async function handleUpdateEmployee(event) {
		event.preventDefault()

		const oldDepartmentRef = doc(db, 'departments', employee.departmentId)

		const employeeData = {
			firstName: firstName || employee.firstName,
			lastName: lastName || employee.lastName,
			email: email || employee.email,
			cpf: cpf || employee.cpf,
			phone: phone || employee.phone,
			department: department || employee.departmentId,
			role: role || employee.role,
		}

		const newDepartmentRef = doc(db, 'departments', employeeData.department)

		const newEmployeeData = {
			...employeeData,
			department: newDepartmentRef,
		}

		const isPhoneValid = /^\d+$/.test(newEmployeeData.phone)
		const isCpfValid = /^\d+$/.test(newEmployeeData.cpf)
		const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmployeeData.email)

		if (!isEmailValid) {
			toast.error('Email inválido')
			return
		}

		if (!isPhoneValid) {
			toast.error('Telefone deve conter apenas números')
			return
		}

		if (!isCpfValid) {
			toast.error('CPF deve conter apenas números')
			return
		}

		try {
			const employeeDocRef = doc(db, 'employees', employeeId)

			await updateDoc(employeeDocRef, newEmployeeData)

			await updateDoc(newDepartmentRef, {
				employees: arrayUnion(employeeDocRef),
			})

			await updateDoc(oldDepartmentRef, {
				employees: arrayRemove(employeeDocRef),
			})

			console.log(employee.departmentId)

			queryClient.invalidateQueries({ queryKey: ['employee', employeeId] })
			queryClient.invalidateQueries({
				queryKey: ['department', employee.departmentId],
			})
			queryClient.invalidateQueries({
				queryKey: ['department', department],
			})

			setIsEditing(false)
			toast.success('Funcionário atualizado com sucesso!')
		} catch (error) {
			toast.error('Erro ao atualizar funcionário')
			console.error('Erro ao atualizar funcionário: ', error)
		}
	}

	async function handleSignOut() {
		await logout()
		navigate('/')
	}

	if (!employee) {
		return <Loader />
	}

	return (
		<>
			<Header />
			<div className="employee-details">
				<h1>Detalhes do Funcionário</h1>
				{isEditing ? (
					<form className="employee-form" onSubmit={handleUpdateEmployee}>
						<label>
							Nome
							<input
								type="text"
								placeholder="First Name"
								defaultValue={employee.firstName}
								onChange={e => setFirstName(e.target.value)}
								required
							/>
						</label>
						<label>
							Sobrenome
							<input
								type="text"
								placeholder="Last Name"
								defaultValue={employee.lastName}
								onChange={e => setLastName(e.target.value)}
								required
							/>
						</label>
						<label>
							Email
							<input
								type="text"
								placeholder="Email"
								defaultValue={employee.email}
								onChange={e => setEmail(e.target.value)}
								required
							/>
						</label>
						<label>
							CPF
							<input
								type="text"
								placeholder="CPF"
								defaultValue={employee.cpf}
								onChange={e => setCpf(e.target.value)}
								required
							/>
						</label>
						<label>
							Telefone
							<input
								type="text"
								placeholder="Phone"
								defaultValue={employee.phone}
								onChange={e => setPhone(e.target.value)}
								required
							/>
						</label>
						<select
							defaultValue=""
							value={department}
							onChange={e => setDepartment(e.target.value)}
							required
						>
							<option value="" disabled>
								Selecionar Departmento
							</option>
							{departments.map(dep => (
								<option key={dep.id} value={dep.id}>
									{dep.name}
								</option>
							))}
						</select>
						<select
							defaultValue=""
							value={role}
							onChange={e => setRole(e.target.value)}
							required
						>
							<option value="" disabled>
								Selecionar Função
							</option>
							<option key="supervisor" value="supervisor">
								Supervisor
							</option>
							<option key="employee" value="employee">
								Funcionário
							</option>
						</select>
						<div className="buttons">
							<Button isOutlined onClick={() => setIsEditing(false)}>
								Cancelar
							</Button>
							<Button onClick={handleUpdateEmployee}>Atualizar Funcionário</Button>
						</div>
					</form>
				) : (
					<div className="employee-info">
						<p>
							<strong>Nome:</strong> {employee.firstName}
						</p>
						<p>
							<strong>Sobrenome:</strong> {employee.lastName}
						</p>
						<p>
							<strong>Email:</strong> {employee.email}
						</p>
						<p>
							<strong>CPF:</strong> {employee.cpf}
						</p>
						<p>
							<strong>Telefone:</strong> {employee.phone}
						</p>
						<p>
							<strong>Departamento:</strong> {employee.department?.name}
						</p>
						<p>
							<strong>Função:</strong>{' '}
							{employee.role === 'supervisor' ? 'Supervisor' : 'Funcionário'}
						</p>
						{currentUser &&
							(currentUser.role === 'supervisor' ||
								currentUser.email === employee.email) && (
								<>
									<Button isOutlined onClick={() => setIsEditing(true)}>
										Editar
									</Button>
									<Button onClick={handleSignOut}>Sair</Button>
									{currentUser.email === employee.email && (
										<Link
											to={`/employees/${employeeId}/change-password`}
											className="text-orange-400 duration-200 hover:text-orange-500"
										>
											Alterar Senha
										</Link>
									)}
								</>
							)}
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
		</>
	)
}
