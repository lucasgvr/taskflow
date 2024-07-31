import { Button } from "../../components/Button";
import { Header } from "../../components/Header";

import { useState } from "react";

import { Link } from "react-router-dom";

import { Box, Text, Input} from "@chakra-ui/react"

import { db } from "../../services/firebase"
import { collection, addDoc } from "firebase/firestore"

import { useNavigate } from "react-router-dom";

export function AddDepartmentPage() {
    const navigate = useNavigate();

    const [name, setName] = useState('')

    async function handleAddDepartment(event) {
        event.preventDefault()

        try {
            await addDoc(collection(db, 'departments'), {
                name
            })
            
            console.log('Department added successfully');
            navigate('/departments')
        } catch (error) {
            console.error('Error adding department:', error);
        }
    }

    return (
        <>
            <Header />
            
            <Box as='main'>
                <Box as='div'>
                    <Box as='form' marginLeft='4rem' gap='2rem' display='flex'
                    flexDirection='column' alignItems='center' justifyContent='center' onSubmit={handleAddDepartment}>
                        <Box as='fieldset' border='none' mt='3.5rem'>
                            <Text color='#5A5A66' fontWeight='600' fontSize='2rem' lineHeight='2.625rem'>
                                Adicionar Departamento
                            </Text>

                            <Box as='div' height='1px' margin='1rem 0 2rem' backgroundColor='#E1E3E5'></Box>

                            <Box as='div' display='flex' flexDirection='row' gap='1.5rem' mt='1.5rem'>
                                <Box as='div' flex='1'>
                                    <Box as='label' display='inline-block' fontWeight='500' color='#787880'>
                                        Nome
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
                                        onChange={event => setName(event.target.value)}
                                    />
                                </Box>
                            </Box>
                        </Box>

                        <Box display='flex' flexDirection='column' gap='1rem' mt='2rem'>
                            <Button>
                                <Box display='flex' justifyContent='center' alignItems='center' width='20rem'>
                                    <Text>Adicionar Departamento</Text>
                                </Box>
                            </Button>

                            <Link to='/departments'>
                                <Button isOutlined>
                                    <Box display='flex' justifyContent='center' alignItems='center' width='20rem'>
                                        <Text>Listar Departamentos</Text>
                                    </Box>
                                </Button>
                            </Link>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    )
}