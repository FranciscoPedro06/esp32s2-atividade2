import { db } from "./firebase.js";
import { collection, query, onSnapshot, addDoc, deleteDoc, doc, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export function setupRealtimeListener(path, onUpdate, onError) {
    const q = query(collection(db, path));
    return onSnapshot(q, onUpdate, onError);
}

export async function addUser(path, name, code) {
    const existing = await getDocs(query(collection(db, path), where("code","==",code)));
    if(!existing.empty) throw new Error("Código já em uso");
    await addDoc(collection(db, path), { name, code, createdAt: new Date() });
}

export async function deleteUser(path, id) {
    await deleteDoc(doc(db, path, id));
}
