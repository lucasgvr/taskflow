import { Box, Text, Input} from "@chakra-ui/react"

export function Main() {
    return (
        <Box as='main'>
            <Box as='div'>
                <Box as='form' marginLeft='4rem'>
                    <Box as='fieldset' border='none' mt='3.5rem'>
                        <Text color='#5A5A66' fontWeight='600' fontSize='2rem' lineHeight='2.625rem'>
                            Dados do Perfil
                        </Text>
                        <Box as='div' height='1px' margin='1rem 0 2rem' backgroundColor='#E1E3E5'></Box>
                        <Box as='div'>
                            <Box as='label' display='inline-block' fontWeight='500' color='#787880'>
                                Nome
                            </Box>
                            <Input 
                                type="text" 
                                fontWeight='500' 
                                backgroundColor='#FCFDFF' 
                                border='1px solid #E1E3E6' 
                                borderRadius='0.313rem' 
                                padding='0.75rem 1.5rem' 
                                width='100%' 
                                color='#5A5A66' 
                                value='Lucas' 
                            />
                        </Box>
                        <Box as='div' display='flex' mt='1.5rem'>
                            <Box as='div'>
                                <Box as='label' display='inline-block' fontWeight='500' color='#787880'>
                                    Email
                                </Box>
                                <Input 
                                    type='text' 
                                    fontWeight='500' 
                                    backgroundColor='#FCFDFF' 
                                    border='1px solid #E1E3E6'
                                    borderRadius='0.313rem' 
                                    padding='0.5rem 1.5rem' 
                                    width='100%' 
                                    color='#5A5A66' 
                                    mt='1rem' 
                                    value='lucas.voriarocha@gmail.com'
                                />
                            </Box>
                            <Box as='div' ml='1.5rem'>
                                <Box as='label' display='inline-block' fontWeight='500' color='#787880'>
                                    Telefone
                                </Box>
                                <Input 
                                    type='text' 
                                    fontWeight='500' 
                                    backgroundColor='#FCFDFF' 
                                    border='1px solid #E1E3E6' 
                                    borderRadius='0.313rem' 
                                    padding='0.5rem 1.5rem' 
                                    width='100%' 
                                    color='#5A5A66' 
                                    mt='1rem' 
                                    value ='(43) 99922-1392'
                                />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}