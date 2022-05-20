import firebase from "firebase/app";

import "firebase/auth"
import "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyBIsKNVHTpUhwkwQRvLLDXLwcmIVVAK6Lk",
  authDomain: "lucas-taskflow.firebaseapp.com",
  databaseURL: "https://lucas-taskflow-default-rtdb.firebaseio.com",
  projectId: "lucas-taskflow",
  storageBucket: "lucas-taskflow.appspot.com",
  messagingSenderId: "265302834370",
  appId: "1:265302834370:web:ced0469938e0a55fd58f5b",
  measurementId: "G-NX838FY43C"
};

firebase.initializeApp(firebaseConfig)

const auth = firebase.auth()
const database = firebase.database()

export { firebase, auth, database }