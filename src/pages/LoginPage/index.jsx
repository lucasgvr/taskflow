import { useState } from 'react'

import { Navigate } from 'react-router-dom'

import { Button } from '../../components/Button/index'

import illustrationImg from '../../assets/illustration.svg'
import logInImg from '../../assets/log-in.svg'

import { useAuth } from '../../hooks/useAuth'

import { Link } from 'react-router-dom'

import { ToastContainer } from 'react-toastify'
import { useQueryClient } from '@tanstack/react-query'

import './styles.scss'

export function LoginPage() {
	const queryClient = useQueryClient()

	const { login, currentUser } = useAuth()

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const handleSignIn = async () => {
		await login(email, password)

		queryClient.invalidateQueries({ queryKey: ['notifications'] })
	}

	return (
		<>
			{currentUser && <Navigate to="/home" replace={true} />}
			<div id="pageAuth">
				<aside>
					<img
						src={illustrationImg}
						alt="Ilustração simbolizando perguntas e respostas"
					/>
					<strong>Sua gestão pode ser melhor.</strong>
					<p>Gerencia as tarefas e necessidades da sua empresa.</p>
				</aside>

				<main>
					<div className="mainContent">
						<div className="separator">Entre com email e senha</div>
						<div className="form">
							<input
								type="email"
								placeholder="Email"
								onChange={event => setEmail(event.target.value)}
							/>
							<input
								type="password"
								placeholder="Senha"
								onChange={event => setPassword(event.target.value)}
							/>
							<Button onClick={handleSignIn}>
								<img src={logInImg} alt="Log In Icon" />
								Entrar
							</Button>
						</div>
						<Link
							to={'/reset-password'}
							className="text-orange-400 duration-200 hover:text-orange-500 mt-4 text-left"
						>
							Esqueceu a senha?
						</Link>
					</div>
				</main>
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
