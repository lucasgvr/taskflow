import { Link } from 'react-router-dom'

import { Box, Text } from '@chakra-ui/react'

import { Button } from '../../components/Button'

import { Header } from '../../components/Header'

import './styles.scss'

export function ChoicePage() {
	return (
		<>
			<Header />
			<div className="choicePage">
				<div className="buttons">
					<Link to="/employees">
						<Button>
							<Box display="flex" justifyContent="center" alignItems="center">
								<Text>Cadastrar novo funcionário</Text>
							</Box>
						</Button>
					</Link>
					<Link to="/departments">
						<Button>
							<Box display="flex" justifyContent="center" alignItems="center">
								<Text>Cadastrar novo departamento</Text>
							</Box>
						</Button>
					</Link>
				</div>
			</div>
		</>
	)
}
