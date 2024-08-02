// EmployeeDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../services/firebase'; // Firebase configuration file
import { doc, getDoc, updateDoc } from 'firebase/firestore';

import { useDepartments } from '../../hooks/useDepartments';

export function EmployeePage() {
  const { employeeId } = useParams();
  
  const [employee, setEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [departmentName, setDepartmentName] = useState('');

  const { departments } = useDepartments();

  useEffect(() => {
    fetchEmployee();
  } )

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
        setDepartment(data.department.id); // Assuming department is a reference

        if (data.department) {
            const departmentDocRef = data.department;
            const departmentDocSnap = await getDoc(departmentDocRef);
  
            if (departmentDocSnap.exists()) {
              setDepartmentName(departmentDocSnap.data().name);
            }
          }
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching employee: ', error);
    }
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();

    try {
      const employeeDocRef = doc(db, 'employees', employeeId);
      await updateDoc(employeeDocRef, {
        firstName,
        lastName,
        email,
        cpf,
        phone,
        department: doc(db, 'departments', department),
      });
      setIsEditing(false);
      fetchEmployee(); // Refresh the data
    } catch (error) {
      console.error('Error updating employee: ', error);
    }
  };

  if (!employee) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Employee Details</h1>
      {isEditing ? (
        <form onSubmit={handleUpdateEmployee}>
          <input type="text" placeholder="Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="text" placeholder="CPF" value={cpf} onChange={(e) => setCpf(e.target.value)} required />
          <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          <select value={department} onChange={(e) => setDepartment(e.target.value)} required>
            <option value="" disabled>Select Department</option>
            {departments.map(dep => (
              <option key={dep.id} value={dep.id}>{dep.name}</option>
            ))} 
          </select>
          <button type="submit">Update Employee</button>
        </form>
      ) : (
        <div>
          <p>Name: {employee.firstName}</p>
          <p>Last Name: {employee.lastName}</p>
          <p>Email: {employee.email}</p>
          <p>CPF: {employee.cpf}</p>
          <p>Phone: {employee.phone}</p>
          <p>Department: {departmentName}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </div>
      )}
    </div>
  );
}