import { Box, Heading, Image } from "@chakra-ui/react"

export default function Aside() {
    return (
        <Box as='aside' backgroundColor='#FCFDFF' borderRadius='0.313rem' border='1px solid #E1E3E6' color='#5A5A66' width='22rem' textAlign='center' padding='2.5rem 3.375rem' display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
            <Image src='https://github.com/lucasgvr.png' alt='Dinheiro' mb='1.5rem' borderRadius='50%' border='.25rem solid #F1972C'/>
            <Heading fontWeight='600' fontSize='1.75rem' lineHeight='1.875rem' mb='3.875rem'>Lucas</Heading>
                <Box as='button' 
                    borderRadius='0.313rem' 
                    border='0' 
                    fontWeight='700' 
                    fontSize='0.875rem' 
                    lineHeight='1.625rem'
                    textTransform='uppercase' 
                    transition='all .2s' 
                    display='flex' 
                    justifyContent='center' 
                    alignItems='center' 
                    padding='0.75rem 3rem' 
                    height='3rem' 
                    backgroundColor='#36B336' 
                    color='#FCFDFF' 
                    _hover={{backgroundColor: '#3CC73C'}}> Salvar Dados
                </Box>
        </Box>
    );
}