import { useEmployees } from "../../hooks/useEmployees"

export function EmployeesPage() {
    const { employees } = useEmployees()

    return (
        <div>

        <h1>Funcionários</h1>
        {employees.map(employees => (
            <div key={employees.nome}>
                {employees.nome}
                {employees.sobrenome}
                {employees.email}
            </div>
        ))}
        </div>
    )
}         