import { useNavigate } from "react-router-dom"

import { useState } from "react"

import { db } from "../../services/firebase"
import { doc, deleteDoc } from "firebase/firestore"

import Modal from "react-modal"

import { Box, Image, Text } from "@chakra-ui/react"

import { Button } from "../Button"

import TrashImg from "../../assets/trash-24.svg"
import MoneyColorImg from "../../assets/edit-24.svg"

import "../../styles/modal.scss"

import { toast } from "react-toastify"
import { useAuth } from "../../hooks/useAuth"

export function Aside({ updateTask, taskId, newDescription, newDeadline, newStatus, newAssign }) {
    const [deleteTaskModalIsOpen, setDeleteTaskModalIsOpen] = useState(false)

    const { currentUser } = useAuth()

    const navigate = useNavigate()
  
    const handleDeleteTask = async (id) => {
        const taskDoc = doc(db, "tasks", id)

        toast.success('Tarefa apagada com sucesso!')

        await deleteDoc(taskDoc)

        setTimeout(() => {
            navigate('/home');
        }, 5000);
    }

    return (
        <Box as='aside' backgroundColor='#FCFDFF' borderRadius='0.313rem' border='1px solid #E1E3E6' color='#5A5A66' width='22rem' ml='8rem' textAlign='center' padding='2.5rem 3.375rem' display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
            <Image src={ MoneyColorImg } alt='Dinheiro' mb='1.5rem' height='4rem' width='4rem' />
            <Text mb='1.75rem' fontWeight='600' fontSize='0.875rem' lineHeight='1.625rem'></Text>
            <Box 
                as='div' 
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
                    onClick={() => updateTask(taskId, newDescription, newDeadline, newStatus, newAssign)}
                    _hover={{backgroundColor: '#3CC73C'}}
                >
                    Salvar
                </Box>
                {currentUser.role === 'supervisor' && (
                    <Box as='a' onClick={() => setDeleteTaskModalIsOpen(true)} border='0' borderRadius='0.313rem'  ml='1rem' width='3rem' height='3rem' display='flex' alignItems='center' justifyContent='center' backgroundColor='#E1E3E5' color='#FCFDFF' _hover={{backgroundColor: '#F0F2F5'}}>
                        <Image src={ TrashImg } width='1.5rem' height='1.5rem'/>
                    </Box>
                )}
            </Box>
            <Modal
                isOpen={deleteTaskModalIsOpen}
                className="modal"
                onRequestClose={() => setDeleteTaskModalIsOpen(false)}
                shouldCloseOnOverlayClick={true}
            >
                <div className="modalWrapper">
                    <div className="modal">
                        <h3>Apagar tarefa</h3>
                        <p>
                            Quer mesmo encerrar apagar essa tarefa? <br/>
                            Ela será apagada para sempre.  
                        </p>
                        <footer>
                            <Button width isOutlined={true} onClick={() => setDeleteTaskModalIsOpen(false)}>Cancelar</Button>
                            <Button width onClick={() => handleDeleteTask(taskId)}>Apagar tarefa</Button>
                        </footer>
                    </div>
                </div>
            </Modal>
        </Box>
    )
}