import { Box, Text, Input, Select } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { getDepartments } from '../../hooks/useDepartments'
import { getEmployees } from '../../hooks/useEmployees'

export function Main({ setNewDescription, setNewDeadline, setNewAssign }) {
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

	console.log(employees)

	return (
		<Box as="main">
			<Box as="div">
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
								onChange={event => {
									setNewDescription(event.target.value)
								}}
							/>
						</Box>
						<Box as="div" display="flex" mt="1.5rem">
							<Box as="div">
								<Box as="label" display="inline-block" fontWeight="500" color="#787880">
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
									onChange={event => {
										setNewDeadline(event.target.value)
									}}
								/>
							</Box>
							<Box as="div" ml="1.5rem">
								<Box as="label" display="inline-block" fontWeight="500" color="#787880">
									Atribuir à
								</Box>
								<Select
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
											departments.map((dept, index) => (
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
								</Select>
							</Box>
						</Box>
					</Box>
				</Box>
			</Box>
		</Box>
	)
}
