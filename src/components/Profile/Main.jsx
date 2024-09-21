import { Box, Text, Heading } from '@chakra-ui/react'

import { useAuth } from '../../hooks/useAuth'

export function Main() {
	const { currentUser } = useAuth()

	return (
		<Box as="main">
			<Box as="div">
				<Box as="form" marginLeft="4rem">
					<Box as="fieldset" border="none" mt="3.5rem">
						<Text
							color="#5A5A66"
							fontWeight="600"
							fontSize="2rem"
							lineHeight="2.625rem"
						>
							Dados do Perfil
						</Text>
						<Box
							as="div"
							height="1px"
							margin="1rem 0 2rem"
							backgroundColor="#E1E3E5"
						></Box>
						<Box as="div">
							<Box as="label" display="inline-block" fontWeight="500" color="#787880">
								Nome
							</Box>
							<Heading
								fontWeight="600"
								fontSize="1.75rem"
								lineHeight="1.875rem"
								mb="3.875rem"
								color="#5a5a66"
							>
								{currentUser.firstName} {currentUser.lastName}
							</Heading>
						</Box>
						<Box as="div" display="flex" mt="1.5rem">
							<Box as="div">
								<Box as="label" display="inline-block" fontWeight="500" color="#787880">
									Email
								</Box>
								<Heading
									fontWeight="600"
									fontSize="1.75rem"
									lineHeight="1.875rem"
									mb="3.875rem"
									color="#5a5a66"
								>
									{currentUser.email}
								</Heading>
							</Box>
							<Box as="div" ml="1.5rem">
								<Box as="label" display="inline-block" fontWeight="500" color="#787880">
									Telefone
								</Box>
								<Heading
									fontWeight="600"
									fontSize="1.75rem"
									lineHeight="1.875rem"
									mb="3.875rem"
									color="#5a5a66"
								>
									{currentUser.phone}
								</Heading>
							</Box>
						</Box>
					</Box>
				</Box>
			</Box>
		</Box>
	)
}
