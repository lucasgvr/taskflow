import { Flex, Spinner } from '@chakra-ui/react'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export function Loader() {
	return (
		<>
			<Flex height="100vh" align="center" justify="center" bg="whiteAlpha.800">
				<Spinner color="var(--orange)" size="xl" thickness="6px" />
			</Flex>

			<ToastContainer
				position="top-center"
				autoClose={5000}
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
