import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBqXMKuC7ng3Qcao_u63iLL2KV1DBT0Bpo",
  authDomain: "lucas-taskflow2.firebaseapp.com",
  projectId: "lucas-taskflow2",
  storageBucket: "lucas-taskflow2.appspot.com",
  messagingSenderId: "697271071295",
  appId: "1:697271071295:web:84ce3ee44962f8f29bbe8a"
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)