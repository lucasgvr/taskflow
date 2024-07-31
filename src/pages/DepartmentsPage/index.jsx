import { useDepartments } from "../../hooks/useDepartments"

import { Link } from "react-router-dom";

import { Box, Text } from '@chakra-ui/react'

import { Header } from "../../components/Header"
import { Button } from "../../components/Button"

import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";

import './styles.scss'


export function DepartmentsPage() {
    const { departments } = useDepartments()

    return (
        <>
            <Header />
            <div className="departmentsPage">
                <Link to='/departments/new' className="addDepartment">
                    <Button>
                        <Box display='flex' justifyContent='center' alignItems='center'>
                            <Text>Adicionar departamento</Text>
                        </Box>
                    </Button>
                </Link>

                <div className="departmentListContainer">
                    <h1>Departamentos</h1>

                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Actions</th> 
                            </tr>
                        </thead>
                        <tbody>
                            {departments.map((department) => (
                                <tr key={department.id}>
                                    <td>{department.name}</td>
                                    <td className="actions"> 
                                        <MdModeEdit size={24}>Edit</MdModeEdit> 
                                        <MdDelete size={24}>Delete</MdDelete> 
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}         