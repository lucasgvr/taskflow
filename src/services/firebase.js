import { initializeApp } from "firebase/app"
import { getFirestore } from "@firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyBqXMKuC7ng3Qcao_u63iLL2KV1DBT0Bpo",
    authDomain: "lucas-taskflow2.firebaseapp.com",
    projectId: "lucas-taskflow2",
    storageBucket: "lucas-taskflow2.appspot.com",
    messagingSenderId: "697271071295",
    appId: "1:697271071295:web:84ce3ee44962f8f29bbe8a"
}

const firebaseConfigBackup = {
    apiKey: "AIzaSyBBL8LcXmay794nrwNiPHK1e7TjZZUyrFk",
    authDomain: "taskflow-da2ee.firebaseapp.com",
    projectId: "taskflow-da2ee",
    storageBucket: "taskflow-da2ee.appspot.com",
    messagingSenderId: "56611545188",
    appId: "1:56611545188:web:70523398d6b612739a7f71",
}

const firebaseConfigBackup2 = {
    apiKey: "AIzaSyAPxsODMvXc3g3phqleu66Xh5U_NfCi870",
    authDomain: "taskflow-2.firebaseapp.com",
    projectId: "taskflow-2",
    storageBucket: "taskflow-2.appspot.com",
    messagingSenderId: "167972829836",
    appId: "1:167972829836:web:bf33696df325cf30d619a9",
  };
  
  

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)    