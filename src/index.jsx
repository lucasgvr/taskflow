import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import { ChakraProvider } from '@chakra-ui/react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import './styles/global.scss'
import './index.css'

const queryClient = new QueryClient()

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
	<QueryClientProvider client={queryClient}>
		<ChakraProvider>
			<React.StrictMode>
				<App />
			</React.StrictMode>
		</ChakraProvider>
	</QueryClientProvider>
)
