import { auth } from "./firebase.js";
import { signInAnonymously } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

export async function authenticate() {
    try {
        await signInAnonymously(auth);
        return auth.currentUser.uid;
    } catch (error) {
        console.error("Erro de autenticação:", error);
        throw error;
    }
}
