import { HeaderDetails } from "../HeaderDetails";
import { CardJob } from "../CardJob";

import { Container, Background } from './styles'

export function Dashboard() {
    const data = [
        {
          id: 1,
          title: 'Tarefa 1',
          deadline: '10 horas',
          status: "IN_PROGRESS"
        },
        {
          id: 2,
          title: 'Tarefa 2',
          deadline: '6 dias para entrega',
          status: "CLOSED"
        },
        {
          id: 3,
          title: 'Tarefa 3',
          deadline: '10 horas',
          status: "CLOSED"
        },
        {
          id: 4,
          title: 'Tarefa 4',
          deadline: '10 horas',
          status: "IN_PROGRESS"
        }
    ]

    return (
        <Container>
            <HeaderDetails />
            {data.map(item => (
                <CardJob key={item.id} data={item} />
            ))}
            <Background />
        </Container>
    )
}