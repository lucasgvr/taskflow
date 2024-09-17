import { useEffect, useState } from 'react';
import { db } from '../../services/firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

export function UserNotifications({ userId, departmentId }) {
    const [notifications, setNotifications] = useState([]);

    async function fetchNotifications(userId, departmentId) {
        const notificationsRef = collection(db, 'notifications');

        const departmentRef = doc(db, 'departments', departmentId);
        const employeeRef = doc(db, 'employees', userId);
        
        const q = query(
            notificationsRef,
            where('assignId', '==', employeeRef),
        );

        const q2 = query(
            notificationsRef,
            where('assignId', '==', departmentRef),
        );

        try {
            const querySnapshot2 = await getDocs(q2);
            const notifications2 = querySnapshot2.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));


            const querySnapshot = await getDocs(q);
            const notifications = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            return [...notifications, ...notifications2];
        } catch (error) {
            console.error('Erro ao buscar notificações:', error);
            return [];
        }
    }

    async function markNotificationAsRead(notificationId) {
        const notificationRef = doc(db, 'notifications', notificationId);
    
        try {
            // Update the notification document to set `read` to true
            await updateDoc(notificationRef, {
                read: true
            });

            setNotifications((prevNotifications) =>
                prevNotifications.map((notification) =>
                    notification.id === notificationId
                        ? { ...notification, read: true }
                        : notification
                )
            );
        } catch (error) {
            console.error('Error updating notification:', error);
        }
    }

    useEffect(() => {
        async function loadNotifications() {
          const fetchedNotifications = await fetchNotifications(userId, departmentId);
          console.log(fetchedNotifications)
          setNotifications(fetchedNotifications);
        }
    
        loadNotifications();
        // eslint-disable-next-line 
      }, [userId, departmentId]);

      return (
        <div className="flex flex-col gap-4">
            {notifications.length === 0 && (
                <p className="text-zinc-500">Nenhuma notificação</p>
            )}

            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className={`border-2 rounded-xl p-4 min-h-[100px] cursor-pointer hover:opacity-75 ${notification.read ? 'border-gray-400 bg-gray-200' : 'border-zinc-500'}`}
                    onClick={() => markNotificationAsRead(notification.id)}
                >
                    <h1 className={`text-l font-bold ${notification.read ? 'text-zinc-500' : 'text-zinc-900'}`}>
                        Tarefa criada
                    </h1>
                    <p className={`text-gray-500 line-clamp-2 ${notification.read ? 'text-zinc-400' : 'text-zinc-600'}`}>
                        {notification.message}
                    </p>
                </div>
            ))}
        </div>
      );
}