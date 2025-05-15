// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA_E47N-z7CF9JkxL4Ew35Ia0q4fk7NO24",
  authDomain: "qlct-99300.firebaseapp.com",
  databaseURL: "https://qlct-99300-default-rtdb.firebaseio.com",
  projectId: "qlct-99300",
  storageBucket: "qlct-99300.firebasestorage.app",
  messagingSenderId: "985355269832",
  appId: "1:985355269832:web:7bdfded6927dfb540597fd",
  measurementId: "G-7D5JVTL3KR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;