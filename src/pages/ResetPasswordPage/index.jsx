import { db } from '../../services/firebase'
import {
	collection,
	where,
	getDocs,
	query,
	updateDoc,
	doc,
} from 'firebase/firestore'

import { useNavigate } from 'react-router-dom'

import { useEffect, useState } from 'react'

import { toast } from 'react-toastify'

import { Button } from '../../components/Button/index'
import illustrationImg from '../../assets/illustration.svg'
import './styles.scss'

import { useParams } from 'react-router-dom'

export function ResetPasswordPage() {
	const { token } = useParams()

	const navigate = useNavigate()

	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [isTokenValid, setIsTokenValid] = useState(false)

	useEffect(() => {
		async function checkTokenValidity() {
			const userSnapshot = await getDocs(
				query(
					collection(db, 'employees'),
					where('resetToken', '==', token),
					where('resetTokenExpires', '>', Date.now())
				)
			)

			if (userSnapshot.docs.length === 0) {
				toast.error('Token inválido ou expirado')
				setIsTokenValid(false)
			} else {
				setIsTokenValid(true)
			}
		}

		checkTokenValidity()
	}, [token])

	async function handleResetPassword() {
		if (password.length < 6) {
			toast.error('Senha deve ter pelo menos 6 caracteres')
			return
		}

		if (password !== confirmPassword) {
			toast.error('Senhas não coincidem')
			console.log('Senhas não coincidem')
			return
		}

		const userSnapshot = await getDocs(
			query(collection(db, 'employees'), where('resetToken', '==', token))
		)

		const userDoc = userSnapshot.docs[0]

		await updateDoc(doc(db, 'employees', userDoc.id), {
			password: password,
			resetToken: null,
			resetTokenExpires: null,
		})

		toast.success('Senha redefinida com sucesso')

		setTimeout(() => {
			navigate('/')
		}, 2000)
	}

	return (
		<div id="pageAuth">
			<aside>
				<img
					src={illustrationImg}
					alt="Ilustração simbolizando perguntas e respostas"
				/>
				<strong>Redefinir senha.</strong>
				<p>Insira sua nova senha.</p>
			</aside>

			<main>
				<div className="mainContent">
					<div className="separator">Insira sua nova senha</div>
					<div className="form">
						<input
							type="password"
							placeholder="Nova senha"
							onChange={event => setPassword(event.target.value)}
							disabled={!isTokenValid}
						/>
						<input
							type="password"
							placeholder="Confirmar nova senha"
							onChange={event => setConfirmPassword(event.target.value)}
							disabled={!isTokenValid}
						/>

						{!isTokenValid ? (
							<Button isOutlined onClick={() => navigate('/')}>
								Voltar para o início
							</Button>
						) : (
							<Button onClick={handleResetPassword} disabled={!isTokenValid}>
								Redefinir senha
							</Button>
						)}
					</div>
				</div>
			</main>
		</div>
	)
}
