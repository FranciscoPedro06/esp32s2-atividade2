import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyALBW4yknpXtIUKunWrtmAcf7N-57Ij20o",
    authDomain: "fechadura-eletronica-d63a4.firebaseapp.com",
    databaseURL: "https://fechadura-eletronica-d63a4-default-rtdb.firebaseio.com/",
    projectId: "fechadura-eletronica-d63a4"
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
export const auth = getAuth(app);
