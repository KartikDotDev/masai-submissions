import { initializeApp } from "firebase/app";
import {getDatabase, push, ref, get, remove } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAIFDbxhGavSr84P4t03D2Fxp-EYByoo3s",
  authDomain: "april26-eval.firebaseapp.com",
  projectId: "april26-eval",
  storageBucket: "april26-eval.firebasestorage.app",
  messagingSenderId: "1017426668100",
  appId: "1:1017426668100:web:7bbbadcf20e44fbc7c6a11"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const db = getDatabase();
export {database, ref, push, get, remove, db };
