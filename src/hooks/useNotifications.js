import { db } from "../services/firebase"

export async function useNotifications() {
    async function createNotification(task, assignedUserId) {
        const notification = {
            userId: assignedUserId,
            taskId: task.id,
            message: `Nova tarefa atribuída: ${task.title}`,
            read: false,
            createdAt: new Date(),
        }
        
        await db.collection("notifications").add(notification)
    }


    return { createNotification }
}