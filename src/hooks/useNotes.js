import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore'
import { db } from '../services/firebase'

export async function addNote(taskId, currentUser, newNote) {
	const docRef = doc(db, 'tasks', taskId)

	const createdAt = new Date().toISOString()

	await updateDoc(docRef, {
		notes: arrayUnion({
			description: newNote,
			createdBy: `${currentUser.firstName} ${currentUser.lastName}`,
			createdById: currentUser.id,
			createdAt: createdAt,
		}),
	})
}

export async function deleteNote(taskId, noteToDelete) {
	const docRef = doc(db, 'tasks', taskId)

	await updateDoc(docRef, {
		notes: arrayRemove(noteToDelete),
	})
}
