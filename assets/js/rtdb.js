import { db } from "./firebase.js";
import { ref, set, onValue, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const usersRef = ref(db, "Users");

export function startRealtimeListener(renderList) {
    onValue(usersRef, (snapshot) => {
        const data = snapshot.val() || {};
        renderList(data);
    });
}

export function addUser(key, name, password) {
    return set(ref(db, "Users/" + key), { name, password });
}

export function deleteUser(key) {
    return remove(ref(db, "Users/" + key));
}
