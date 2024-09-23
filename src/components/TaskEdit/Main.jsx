import { useState, useEffect } from 'react'

import { Box, Text, Input, Select } from '@chakra-ui/react'
import { useAuth } from '../../hooks/useAuth'
import { Loader } from '../Loader'

import { getDepartments } from '../../hooks/useDepartments'
import { useQuery } from '@tanstack/react-query'
import { getAssignName } from '../../hooks/useTasks'
import { getEmployees } from '../../hooks/useEmployees'
import { SelectDropdown } from '../SelectDropdown'

export function Main({
	task,
	setNewDescription,
	setNewDeadline,
	setNewStatus,
	setNewAssign,
}) {
	const [assignName, setAssignName] = useState('')

	const { currentUser } = useAuth()

	const { data: departments } = useQuery({
		queryKey: ['departments'],
		queryFn: getDepartments,
		staleTime: 1000 * 60 * 5,
	})

	const { data: employees } = useQuery({
		queryKey: ['employees'],
		queryFn: getEmployees,
		staleTime: 1000 * 60 * 5,
	})

	const options = [
		{
			label: 'Departamentos',
			options: departments?.map(dept => ({
				label: dept.name,
				value: `department:${dept.id}`,
			})),
		},
		{
			label: 'Funcionários',
			options: employees?.map(emp => ({
				label: `${emp.firstName} ${emp.lastName}`,
				value: `employee:${emp.id}`,
			})),
		},
	]

	useEffect(() => {
		async function fetchAssignName() {
			if (task.assign) {
				const name = await getAssignName(task.assign)
				setAssignName(name)
			} else {
				setAssignName('Desconhecido')
			}
		}

		fetchAssignName()
	}, [task.assign])

	if (!task) {
		return <Loader />
	}

	return (
		<Box as="main">
			<Box as="div">
				{currentUser.role === 'supervisor' ? (
					<Box as="form">
						<Box as="fieldset" border="none" mt="3.5rem">
							<Text
								color="#5A5A66"
								fontWeight="600"
								fontSize="2rem"
								lineHeight="2.625rem"
							>
								Dados da Tarefa
							</Text>
							<Box
								as="div"
								height="1px"
								margin="1rem 0 2rem"
								backgroundColor="#E1E3E5"
							/>
							<Box as="div">
								<Box as="label" display="inline-block" fontWeight="500" color="#787880">
									Descrição
								</Box>
								<Input
									type="text"
									fontWeight="500"
									backgroundColor="#FCFDFF"
									border="1px solid #E1E3E6"
									borderRadius="0.313rem"
									padding="0.75rem 1.5rem"
									width="100%"
									color="#5A5A66"
									defaultValue={task.description}
									onChange={event => setNewDescription(event.target.value)}
								/>
							</Box>
							<Box as="div" display="flex" mt="1.5rem">
								<Box as="div">
									<Box
										as="label"
										display="inline-block"
										fontWeight="500"
										color="#787880"
									>
										Prazo
									</Box>
									<Input
										type="date"
										fontWeight="500"
										backgroundColor="#FCFDFF"
										border="1px solid #E1E3E6"
										borderRadius="0.313rem"
										padding="0.75rem 1.5rem"
										width="100%"
										color="#5A5A66"
										defaultValue={task.deadline}
										contentEditable="true"
										onChange={event => setNewDeadline(event.target.value)}
									/>
								</Box>
								<Box as="div" ml="1.5rem">
									<Box
										as="label"
										display="inline-block"
										fontWeight="500"
										color="#787880"
									>
										Status
									</Box>
									<Select
										fontWeight="500"
										backgroundColor="#FCFDFF"
										border="1px solid #E1E3E6"
										borderRadius="0.313rem"
										width="100%"
										color="#5A5A66"
										defaultValue={task.status}
										onChange={event => {
											setNewStatus(event.target.value)
										}}
									>
										<option value="">Selecionar</option>
										<option value="Em andamento">Em andamento</option>
										<option value="Encerrada">Encerrada</option>
									</Select>
								</Box>
							</Box>
							<Box as="div" mt="1rem">
								<Box as="label" display="inline-block" fontWeight="500" color="#787880">
									Atribuir à
								</Box>
								{/* <Select
									fontWeight="500"
									backgroundColor="#FCFDFF"
									border="1px solid #E1E3E6"
									borderRadius="0.313rem"
									width="100%"
									color="#5A5A66"
									onChange={event => {
										setNewAssign(event.target.value)
									}}
								>
									<option value="">Selecionar</option>
									<optgroup label="Departamentos">
										{departments ? (
											departments.map(dept => (
												<option
													key={departments.indexOf(dept)}
													value={`department:${dept.id}`}
												>
													{dept.name}
												</option>
											))
										) : (
											<option disabled>Nenhum departamento disponível</option>
										)}
									</optgroup>
									<optgroup label="Funcionários">
										{employees ? (
											employees.map(emp => (
												<option key={employees.indexOf(emp)} value={`employee:${emp.id}`}>
													{emp.firstName} {emp.lastName}
												</option>
											))
										) : (
											<option disabled>Nenhum funcionário disponível</option>
										)}
									</optgroup>
								</Select> */}
								<SelectDropdown options={options} setNewAssign={setNewAssign} />
							</Box>
						</Box>
					</Box>
				) : (
					<Box as="form">
						<Box as="fieldset" border="none" mt="3.5rem">
							<Text
								color="#5A5A66"
								fontWeight="600"
								fontSize="2rem"
								lineHeight="2.625rem"
							>
								Dados da Tarefa
							</Text>
							<Box
								as="div"
								height="1px"
								margin="1rem 0 2rem"
								backgroundColor="#E1E3E5"
							/>
							<Box as="div">
								<Box as="label" display="inline-block" fontWeight="500" color="#787880">
									Descrição
								</Box>
								<Text
									fontWeight="500"
									backgroundColor="#FCFDFF"
									border="1px solid #E1E3E6"
									borderRadius="0.313rem"
									padding="0.75rem 1.5rem"
									width="100%"
									color="#5A5A66"
								>
									{task.description}
								</Text>
							</Box>
							<Box as="div" display="flex" mt="1.5rem">
								<Box as="div">
									<Box
										as="label"
										display="inline-block"
										fontWeight="500"
										color="#787880"
									>
										Prazo
									</Box>
									<Text
										fontWeight="500"
										backgroundColor="#FCFDFF"
										border="1px solid #E1E3E6"
										borderRadius="0.313rem"
										padding="0.75rem 1.5rem"
										width="100%"
										color="#5A5A66"
									>
										{task.deadline}
									</Text>
								</Box>
								<Box as="div" ml="1.5rem">
									<Box
										as="label"
										display="inline-block"
										fontWeight="500"
										color="#787880"
									>
										Status
									</Box>
									<Text
										fontWeight="500"
										backgroundColor="#FCFDFF"
										border="1px solid #E1E3E6"
										borderRadius="0.313rem"
										padding="0.75rem 1.5rem"
										width="100%"
										color="#5A5A66"
									>
										{task.status}
									</Text>
								</Box>
							</Box>
							<Box as="div" mt="1rem">
								<Box as="label" display="inline-block" fontWeight="500" color="#787880">
									Atribuir à
								</Box>
								<Text
									fontWeight="500"
									backgroundColor="#FCFDFF"
									border="1px solid #E1E3E6"
									borderRadius="0.313rem"
									padding="0.75rem 1.5rem"
									width="100%"
									color="#5A5A66"
								>
									{assignName}
								</Text>
							</Box>
						</Box>
					</Box>
				)}
			</Box>
		</Box>
	)
}
