import { Button } from '../../components/Button'
import { Header } from '../../components/Header'

import { useState } from 'react'

import { Link } from 'react-router-dom'

import { Box, Text, Input } from '@chakra-ui/react'

import { db } from '../../services/firebase'
import { collection, query, getDocs, where } from 'firebase/firestore'

import { useNavigate } from 'react-router-dom'

import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { addDepartment } from '../../hooks/useDepartments'
import { useQueryClient } from '@tanstack/react-query'

export function AddDepartmentPage() {
	const queryClient = useQueryClient()

	const navigate = useNavigate()

	const [name, setName] = useState('')

	async function handleAddDepartment(event) {
		event.preventDefault()

		try {
			const q = query(collection(db, 'departments'), where('name', '==', name))
			const querySnapshot = await getDocs(q)

			if (!querySnapshot.empty) {
				toast.error('Nome do departamento já existe!')
				return
			}

			if (!name) {
				toast.error('Nome do departamento não pode ser vazio!')
				return
			}

			await addDepartment(name)

			queryClient.invalidateQueries({ queryKey: ['departments'] })

			toast.success('Departamento adicionado com sucesso!')

			setTimeout(() => {
				navigate('/departments')
			}, 2500)
		} catch (error) {
			toast.error('Erro ao Adicionar Departamento')
			console.error('Erro ao adicionar departamento: ', error)
		}
	}

	return (
		<>
			<Header />

			<Box as="main">
				<Box as="div">
					<Box
						as="form"
						marginLeft="4rem"
						gap="2rem"
						display="flex"
						flexDirection="column"
						alignItems="center"
						justifyContent="center"
						onSubmit={handleAddDepartment}
					>
						<Box as="fieldset" border="none" mt="3.5rem">
							<Text
								color="#5A5A66"
								fontWeight="600"
								fontSize="2rem"
								lineHeight="2.625rem"
							>
								Adicionar Departamento
							</Text>

							<Box
								as="div"
								height="1px"
								margin="1rem 0 2rem"
								backgroundColor="#E1E3E5"
							/>

							<Box
								as="div"
								display="flex"
								flexDirection="row"
								gap="1.5rem"
								mt="1.5rem"
							>
								<Box as="div" flex="1">
									<Box
										as="label"
										display="inline-block"
										fontWeight="500"
										color="#787880"
									>
										Nome
									</Box>
									<Input
										type="text"
										fontWeight="500"
										backgroundColor="#FCFDFF"
										border="1px solid #E1E3E6"
										borderRadius="0.313rem"
										padding="0.5rem 1.5rem"
										width="100%"
										color="#5A5A66"
										mt="1rem"
										onChange={event => setName(event.target.value)}
									/>
								</Box>
							</Box>
						</Box>

						<Box display="flex" flexDirection="column" gap="1rem" mt="2rem">
							<Button>
								<Box
									display="flex"
									justifyContent="center"
									alignItems="center"
									width="20rem"
								>
									<Text>Adicionar Departamento</Text>
								</Box>
							</Button>

							<Link to="/departments">
								<Button isOutlined>
									<Box
										display="flex"
										justifyContent="center"
										alignItems="center"
										width="20rem"
									>
										<Text>Listar Departamentos</Text>
									</Box>
								</Button>
							</Link>
						</Box>
					</Box>
				</Box>
			</Box>

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
