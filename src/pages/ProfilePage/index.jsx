import { Box } from '@chakra-ui/react'

import { Header } from '../../components/Profile/Header.jsx'
import { Main } from '../../components/Profile/Main.jsx'
import { Aside } from '../../components/Profile/Aside.jsx'

export function ProfilePage() {
    return (
        <Box as='div' bgColor='#F0F2F5' height='100vh' fontWeight='500' color='#FCFDFF' border='none'>
            <Header/>
            <Box as='div' width='min(1440px, 90vw)' margin='0 auto' display='flex'>
                <Aside /> 
                <Main />
            </Box>
        </Box>
    )
}         