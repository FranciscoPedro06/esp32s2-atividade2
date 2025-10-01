import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyALBW4yknpXtIUKunWrtmAcf7N-57Ij20o",
    authDomain: "fechadura-eletronica-d63a4.firebaseapp.com",
    databaseURL: "https://fechadura-eletronica-d63a4-default-rtdb.firebaseio.com",
    projectId: "fechadura-eletronica-d63a4",
    storageBucket: "fechadura-eletronica-d63a4.firebasestorage.app",
    messagingSenderId: "159008937715",
    appId: "1:159008937715:web:e9c9221eadbc2e53cf8986",
    measurementId: "G-WK2HH5DE1K"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
