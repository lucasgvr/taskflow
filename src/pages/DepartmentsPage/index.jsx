import { useEmployees } from "../../hooks/useEmployees"
import { useDepartments } from "../../hooks/useDepartments"

import { Link } from "react-router-dom";

import { Box, Text } from '@chakra-ui/react'

import React, { useEffect, useState } from 'react'

import { db } from "../../services/firebase"
import { collection, getDocs, getDoc, doc } from "firebase/firestore"
import { Header } from "../../components/Header"
import { Button } from "../../components/Button"


export function DepartmentsPage() {
    const { departments } = useDepartments()

    return (
        <>
            <Header />
            <div>
                <Link to='/departments/new'>
                    <Button>
                        <Box display='flex' justifyContent='center' alignItems='center'>
                            <Text>Adicionar departamento</Text>
                        </Box>
                    </Button>
                </Link>

                <div>
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
                                    <td>
                                        <button>Edit</button> 
                                        <button>Delete</button> 
                                        <button>Employees</button> 
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