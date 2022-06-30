import { Box, Image, Text } from "@chakra-ui/react"

import MoneyGrayImg from "../../assets/money-gray.svg"
import TrashImg from "../../assets/trash-24.svg"

export function Aside({ addTask }) {
    return (
        <Box as='aside' backgroundColor='#FCFDFF' borderRadius='0.313rem' border='1px solid #E1E3E6' color='#5A5A66' width='22rem' ml='8rem' textAlign='center' padding='2.5rem 3.375rem' display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
            <Text mb='1.75rem' fontWeight='600' fontSize='1rem' lineHeight='1.625rem'>
                Preencha os dados ao lado <br /> para adicionar a tarefa
            </Text>
            <Box as='div' 
                display='flex' 
                alignItems='center' 
                justifyContent='center'
            >
                <Box 
                    as='button' 
                    borderRadius='0.313rem' 
                    border='0' 
                    fontWeight='700' 
                    fontSize='0.875rem' 
                    lineHeight='1.625rem'
                    textTransform='uppercase' 
                    transition='all .2s' 
                    display='inline-flex' 
                    justifyContent='center' 
                    alignItems='center' 
                    padding='0.75rem 3rem' 
                    width='3rem' 
                    height='3rem' 
                    backgroundColor='#36B336' 
                    color='#FCFDFF' 
                    onClick={ addTask }
                    _hover={ {backgroundColor: '#3CC73C'} }
                >
                    Adicionar
                </Box>
                <Box 
                    as='a' 
                    href='/home' 
                    border='0' 
                    borderRadius='0.313rem'  
                    ml='1rem' 
                    width='3rem' 
                    height='3rem' 
                    display='flex' 
                    alignItems='center' 
                    justifyContent='center' 
                    backgroundColor='#E1E3E5' 
                    color='#FCFDFF' 
                    _hover={{backgroundColor: '#F0F2F5'}}
                >
                    <Image src={ TrashImg } width='1.5rem' height='1.5rem' />
                </Box>
            </Box>
        </Box>
    )
}