import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDdWGqzDnm7VEufy2ihfdXwb-LLiZ9Fx2s",
    authDomain: "dispositum-8de9c.firebaseapp.com",
    projectId: "dispositum-8de9c",
    storageBucket: "dispositum-8de9c.appspot.com",
    messagingSenderId: "1085414473168",
    appId: "1:1085414473168:web:adfef3324e737ef00d4dd5",
    databaseURL:
        "https://dispositum-8de9c-default-rtdb.europe-west1.firebasedatabase.app",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initilize authorization
export const auth = getAuth(app);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);
