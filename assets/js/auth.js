import { auth } from "./firebase.js";
import { signInAnonymously, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

export async function authenticate(initialAuthToken) {
    if (initialAuthToken) {
        await signInWithCustomToken(auth, initialAuthToken);
    } else {
        await signInAnonymously(auth);
    }
    return auth.currentUser.uid || crypto.randomUUID();
}
