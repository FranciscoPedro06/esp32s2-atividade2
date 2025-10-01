import { authenticate } from "./auth.js";
import { startRealtimeListener, addUser, deleteUser } from "./rtdb.js";
import { showMessage, sanitizeCodeInput } from "./ui.js";

document.addEventListener('DOMContentLoaded', async () => {

    const codeInput = document.getElementById('code');
    codeInput.addEventListener('input', () => sanitizeCodeInput(codeInput));

    try {
        const userId = await authenticate();
        document.getElementById('user-id').textContent = userId;
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');

        startRealtimeListener(users => {
            const list = document.getElementById('list');
            list.innerHTML = '';
            const keys = Object.keys(users);
            document.getElementById('count').textContent = keys.length;

            keys.forEach(key => {
                const u = users[key];
                const li = document.createElement('li');
                li.className = "flex justify-between p-2 bg-white mb-1 rounded shadow";
                li.innerHTML = `<span>${u.name} - <b>${u.password}</b></span>
                                <button class="bg-red-500 text-white px-2 rounded">Excluir</button>`;
                li.querySelector('button').onclick = async () => {
                    await deleteUser(key);
                    showMessage("Código excluído!");
                };
                list.appendChild(li);
            });
        });

    } catch (e) {
        showMessage("Erro: " + e.message);
    }

    document.getElementById('form').addEventListener('submit', async e => {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const code = document.getElementById('code').value.trim();
        if (!name || code.length !== 4) {
            showMessage("Preencha nome e código de 4 dígitos");
            return;
        }

        const key = "A" + Math.floor(Math.random() * 1000);
        try {
            await addUser(key, name, code);
            document.getElementById('name').value = '';
            document.getElementById('code').value = '';
            showMessage("Código cadastrado!");
        } catch (e) {
            showMessage(e.message);
        }
    });

});
