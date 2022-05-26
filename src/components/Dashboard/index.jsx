import { HeaderDetails } from "../HeaderDetails";
import { CardJob } from "../CardJob";

import { useTasks } from "../../hooks/useTasks"

import { Container, Background } from './styles'

export function Dashboard() {
    const { tasks } = useTasks()

    return (
        <Container>
            <HeaderDetails />
            {tasks.map(task => (
                <CardJob key={task.id} task={task} />
            ))}
            <Background />
        </Container>
    )
}