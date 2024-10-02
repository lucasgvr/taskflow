import backArrowImg from '../../assets/arrow.svg'

import { Button } from '../Button/index'

import { Box, Text } from '@chakra-ui/react'

import { Link, Navigate, useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../../hooks/useAuth'

import { IoMdNotifications } from 'react-icons/io'

import './styles.scss'

import DefaultImg from '../../assets/default.png'
import { DialogTrigger } from '../Dialog/dialog'

import { useQuery } from '@tanstack/react-query'
import { getNotifications } from '../../hooks/useNotifications'

export function Header() {
	const { currentUser } = useAuth()

	if (!currentUser) {
		return <Navigate to="/" replace />
	}

	const navigate = useNavigate()

	const { data: notifications } = useQuery({
		queryKey: ['notifications'],
		queryFn: () => getNotifications(currentUser.id, currentUser.departmentId),
		staleTime: 1000 * 60 * 5,
	})

	const navigateToProfile = () => {
		navigate(`/employees/${currentUser.id}`)
		window.location.reload()
	}

	const location = useLocation()

	let linkPath

	if (location.pathname.startsWith('/employees/')) {
		linkPath = '/employees'
	} else if (location.pathname.startsWith('/departments/')) {
		linkPath = '/departments'
	} else {
		linkPath = '/home'
	}

	if (location.pathname.includes('password')) {
		linkPath = '/home'
	}

	return (
		<>
			<header id="header">
				<div className="headerContainer">
					<div>
						<div className="buttonContainer">
							<Link className="backButton" to={linkPath}>
								<img src={backArrowImg} alt="" />
							</Link>
							{currentUser.role === 'supervisor' && (
								<Box className="buttons" display="flex">
									<Button>
										<Link to="/employees">
											<Text>Funcionários</Text>
										</Link>
									</Button>
									<Button>
										<Link to="/departments">
											<Text>Departamentos</Text>
										</Link>
									</Button>
								</Box>
							)}
						</div>
						<div className="profileContainer">
							<div className="relative flex justify-end">
								<DialogTrigger asChild>
									<IoMdNotifications
										size={24}
										className="cursor-pointer text-zinc-300 "
									/>
								</DialogTrigger>
								{notifications?.some(notification => !notification.read) && (
									<span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
								)}
							</div>
							<button type="button" className="profile" onClick={navigateToProfile}>
								<div>
									<h2>
										{currentUser.firstName} {currentUser.lastName}
									</h2>
									<h6>Ver Perfil</h6>
								</div>
								<img src={DefaultImg} alt="User Avatar" />
							</button>
						</div>
					</div>
				</div>
			</header>
		</>
	)
}
