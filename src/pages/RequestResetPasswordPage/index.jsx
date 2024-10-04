import { db } from '../../services/firebase'
import {
	collection,
	where,
	getDocs,
	query,
	updateDoc,
	doc,
} from 'firebase/firestore'

import emailjs from 'emailjs-com'

import { useState } from 'react'

import { toast, ToastContainer } from 'react-toastify'

import { Button } from '../../components/Button/index'

import illustrationImg from '../../assets/illustration.svg'
import arrowImg from '../../assets/arrow.svg'

import './styles.scss'

const APP_URL = import.meta.env.VITE_APP_URL
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const EMAILJS_USER_ID = import.meta.env.VITE_EMAILJS_USER_ID

export function RequestResetPasswordPage() {
	const [email, setEmail] = useState('')

	async function generateResetToken(email) {
		const employeesCollectionRef = collection(db, 'employees')

		const employeesSnapshot = await getDocs(
			query(employeesCollectionRef, where('email', '==', email))
		)

		const employeesList = employeesSnapshot.docs.map(doc => ({
			...doc.data(),
			id: doc.id,
		}))

		if (employeesList.length === 0) {
			toast.error('Usuário não encontrado')
			return
		}

		const token =
			Math.random().toString(36).substring(2) +
			Math.random().toString(36).substring(2)
		const expirationTime = Date.now() + 3600000

		const userDoc = employeesList[0]
		await updateDoc(doc(db, 'employees', userDoc.id), {
			resetToken: token,
			resetTokenExpires: expirationTime,
		})

		sendResetEmail(email, `${APP_URL}/reset-password/${token}`)
	}

	async function sendResetEmail(email, resetLink) {
		const templateParams = {
			to_email: email,
			reset_link: resetLink,
		}

		const emailPromise = emailjs.send(
			EMAILJS_SERVICE_ID,
			EMAILJS_TEMPLATE_ID,
			templateParams,
			EMAILJS_USER_ID
		)

		toast.promise(emailPromise, {
			pending: 'Enviando email...',
			success: 'Email enviado com sucesso!',
			error: 'Erro ao enviar email',
		})

		try {
			await emailPromise
		} catch (error) {
			console.log('Erro ao enviar email', error)
		}
	}

	return (
		<div id="pageAuth">
			<aside>
				<img
					src={arrowImg}
					alt="Back arrow"
					className="absolute top-4 left-4 cursor-pointer"
					onClick={() => window.history.back()}
				/>
				<img
					src={illustrationImg}
					alt="Ilustração simbolizando perguntas e respostas"
				/>
				<strong>Redefinir senha.</strong>
				<p>
					Insira o email associado à sua conta e vamos te enviar um link para
					redefinir sua senha.
				</p>
			</aside>

			<main>
				<div className="mainContent">
					<div className="separator">Insira o email associado à sua conta</div>
					<div className="form">
						<input
							type="email"
							placeholder="Email"
							onChange={event => setEmail(event.target.value)}
						/>
						<Button onClick={() => generateResetToken(email)}>Redefinir senha</Button>
					</div>
				</div>
			</main>

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
