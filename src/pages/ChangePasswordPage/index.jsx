import { useQuery } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import { getEmployee } from '../../hooks/useEmployees'
import { useParams } from 'react-router-dom'
import { useState } from 'react'

import { db } from '../../services/firebase'
import { doc, updateDoc } from 'firebase/firestore'

import { Header } from '../../components/Header'

import DefaultImg from '../../assets/default.png'
import { Button } from '../../components/Button'

import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'

export function ChangePasswordPage() {
	const queryClient = useQueryClient()

	const { employeeId } = useParams()

	const navigate = useNavigate()

	const [password, setPassword] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [confirmNewPassword, setConfirmNewPassword] = useState('')

	const { data: employee } = useQuery({
		queryKey: ['employee', employeeId],
		queryFn: () => getEmployee(employeeId),
		staleTime: 1000 * 60 * 5,
	})

	async function handleChangePassword(event) {
		event.preventDefault()

		if (newPassword !== confirmNewPassword) {
			toast.error('As senhas não coincidem')
			return
		}

		if (newPassword.length < 6) {
			toast.error('A nova senha deve ter no mínimo 6 caracteres')
			return
		}

		if (password !== employee.password) {
			toast.error('Senha atual incorreta')
			return
		}

		if (password === newPassword) {
			toast.error('A nova senha não pode ser igual à senha atual')
			return
		}

		try {
			const employeeRef = doc(db, 'employees', employeeId)

			await updateDoc(employeeRef, { password: newPassword })

			toast.success('Senha alterada com sucesso')
			queryClient.invalidateQueries({ queryKey: ['employee', employeeId] })

			setTimeout(() => {
				navigate('/home')
			}, 2500)
		} catch (error) {
			toast.error('Erro ao alterar senha')
			console.error('Erro ao alterar senha: ', error)
		}
	}

	return (
		<div>
			<Header />
			<div className="flex flex-col items-center mt-16">
				<div className="flex items-center gap-32 mb-12">
					<p className="text-3xl font-semibold text-zinc-600">
						{employee.firstName} {employee.lastName}
					</p>
					<img
						src={DefaultImg}
						alt="User avatar"
						className="rounded-full h-24 border-2 border-orange-300 border-solid"
					/>
				</div>
				<form onSubmit={handleChangePassword} className="flex flex-col w-96 gap-4">
					<input
						type="password"
						placeholder="Senha atual"
						className="border-2 border-zinc-300 rounded-md p-2 focus:outline-none"
						onChange={event => setPassword(event.target.value)}
					/>
					<input
						type="password"
						placeholder="Nova senha"
						className="border-2 border-zinc-300 rounded-md p-2 focus:outline-none"
						onChange={event => setNewPassword(event.target.value)}
					/>
					<input
						type="password"
						placeholder="Confirmar nova senha"
						className="border-2 border-zinc-300 rounded-md p-2 mb-8 focus:outline-none"
						onChange={event => setConfirmNewPassword(event.target.value)}
					/>
					<Button type="submit">Alterar senha</Button>
				</form>
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
		</div>
	)
}
