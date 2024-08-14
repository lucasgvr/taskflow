// EmployeeDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../services/firebase'; // Firebase configuration file
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

import { useDepartments } from '../../hooks/useDepartments';
import { Header } from '../../components/Header';

import './styles.scss';
import { Button } from '../../components/Button';

import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

import { Loader } from '../../components/Loader';

export function EmployeePage() {
  const { employeeId } = useParams();

  const navigate = useNavigate();
  
  const [employee, setEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const [role, setRole] = useState('')

  const { departments } = useDepartments();

  useEffect(() => {
    fetchEmployee();
    // eslint-disable-next-line
  }, [])

  const fetchEmployee = async () => {
    try {
      const docRef = doc(db, 'employees', employeeId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setEmployee(data);
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setEmail(data.email);
        setCpf(data.cpf);
        setPhone(data.phone);
        setDepartment(data.department.id); 
        setRole(data.role); 


        if (data.department) {
            const departmentDocRef = data.department;
            const departmentDocSnap = await getDoc(departmentDocRef);
  
            if (departmentDocSnap.exists()) {
              setDepartmentName(departmentDocSnap.data().name);
            }
          }
      } else {
        toast.error('Erro ao carregar funcionário');
        setTimeout(() => {
            navigate('/employees');
        }, 5000)
      }
    } catch (error) {
        toast.error('Erro ao carregar funcionário');
        console.error('Erro ao carregar funcionário: ', error);
        setTimeout(() => {
            navigate('/employees');
        }, 5000)
    }
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !cpf || !phone || !department || !role) {
        toast.error('Todos os campos são obrigatórios');
        return;
    }

    const isPhoneValid = /^\d+$/.test(phone);
    const isCpfValid = /^\d+$/.test(cpf);
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!isEmailValid.test(email)) {
        toast.error('Email inválido');
        return;
    }

    if (!isPhoneValid) {
        toast.error('Telefone deve conter apenas números');
        return;
    }

    if (!isCpfValid) {
        toast.error('CPF deve conter apenas números');
        return;
    }

    try {
        const employeeDocRef = doc(db, 'employees', employeeId);

        const employeeSnap = await getDoc(employeeDocRef);
        const currentEmployeeData = employeeSnap.data();

        const oldDepartmentRef = currentEmployeeData.department;

        const newDepartmentRef = doc(db, 'departments', department);

        await updateDoc(employeeDocRef, {
            firstName,
            lastName,
            email,
            cpf,
            phone,
            department: newDepartmentRef,
            role
        });

        await updateDoc(newDepartmentRef, {
            employees: arrayUnion(employeeDocRef)
        });

        if (oldDepartmentRef) {
            await updateDoc(oldDepartmentRef, {
                employees: arrayRemove(employeeDocRef)
            });
        }

        setIsEditing(false);
        toast.success('Funcionário atualizado com sucesso!');
        fetchEmployee();
    } catch (error) {
        toast.error('Erro ao atualizar funcionário');
        console.error('Erro ao atualizar funcionário: ', error);
    }
  };

  if (!employee) {
    return <Loader />
  }

  return (
    <>
      <Header />
      <div className="employee-details">
        <h1>Detalhes do Funcionário</h1>
        {isEditing ? (
          <form className="employee-form" onSubmit={handleUpdateEmployee}>
            <label>
                Nome
                <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </label>
            <label>
                Sobrenome
                <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </label>
            <label>
                Email
                <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <label>
                CPF
                <input type="text" placeholder="CPF" value={cpf} onChange={(e) => setCpf(e.target.value)} required />
            </label>
            <label>
                Telefone
                <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </label>
            <select value={department} onChange={(e) => setDepartment(e.target.value)} required>
              <option value="" disabled>Selecionar Departmento</option>
              {departments.map(dep => (
                <option key={dep.id} value={dep.id}>{dep.name}</option>
              ))}
            </select>
            <select value={role} onChange={(e) => setRole(e.target.value)} required>
                <option value="" disabled>Selecionar Função</option>
                <option key='supervisor' value='supervisor'>Supervisor</option>
                <option key='employee' value='employee'>Funcionário</option>
            </select>
            <div className='buttons'>
                <Button isOutlined onClick={() => setIsEditing(false)}>Cancelar</Button>
                <Button onClick={handleUpdateEmployee}>Atualizar Funcionário</Button>
            </div>
          </form>
        ) : (
          <div className="employee-info">
            <p><strong>Nome:</strong> {employee.firstName}</p>
            <p><strong>Sobrenome:</strong> {employee.lastName}</p>
            <p><strong>Email:</strong> {employee.email}</p>
            <p><strong>CPF:</strong> {employee.cpf}</p>
            <p><strong>Telefone:</strong> {employee.phone}</p>
            <p><strong>Departamento:</strong> {departmentName}</p>
            <p><strong>Função:</strong> {employee.role === 'supervisor' ? 'Supervisor' : 'Funcionário'}</p>
            <Button onClick={() => setIsEditing(true)}>Editar</Button>
          </div>
        )}
      </div>

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
  );
}