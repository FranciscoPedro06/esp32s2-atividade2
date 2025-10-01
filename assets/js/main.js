import { authenticate } from "./auth.js";
import { setupRealtimeListener, addUser, deleteUser } from "./firestore.js";
import { showCustomMessage, sanitizeNumericInput } from "./ui.js";

const usersCollectionPath = `artifacts/default-app-id/public/data/users`;

document.addEventListener('DOMContentLoaded', async () => {
    const codeInput = document.getElementById('user-code');
    codeInput.addEventListener('input', ()=>sanitizeNumericInput(codeInput));

    try {
        const userId = await authenticate(window.__initial_auth_token);
        document.getElementById('user-id').textContent = userId;
        document.getElementById('loading-state').classList.add('hidden');
        document.getElementById('app-content').classList.remove('hidden');

        setupRealtimeListener(usersCollectionPath, snapshot => {
            const usersList = document.getElementById('users-list');
            const userCount = document.getElementById('user-count');
            usersList.innerHTML = '';
            userCount.textContent = snapshot.size;
            if(snapshot.empty){
                usersList.innerHTML = '<p class="text-gray-500 p-4 text-center italic">Nenhum código cadastrado.</p>';
            }
            snapshot.forEach(doc=>{
                const data = doc.data();
                const li = document.createElement('li');
                li.className = 'flex justify-between items-center p-4 bg-white border-b border-gray-100 last:border-b-0 hover:bg-indigo-50 transition duration-150';
                li.innerHTML = `<div>
                    <p class="font-semibold text-gray-800">${data.name}</p>
                    <p class="text-sm text-gray-500">Código: <span class="font-mono text-lg text-indigo-600 font-bold">${data.code}</span></p>
                </div>
                <button data-id="${doc.id}" class="delete-btn bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-md shadow text-sm">Excluir</button>`;
                usersList.appendChild(li);
            });
        }, error => console.error(error));

    } catch (error) {
        console.error(error);
        showCustomMessage("Erro", error.message, "error");
    }

    document.getElementById('user-form').addEventListener('submit', async e=>{
        e.preventDefault();
        const name = document.getElementById('user-name').value.trim();
        const code = document.getElementById('user-code').value.trim();
        if(!name || code.length!==4) {
            showCustomMessage("Erro","Nome e código de 4 dígitos são obrigatórios","error");
            return;
        }
        try {
            await addUser(usersCollectionPath,name,code);
            showCustomMessage("Sucesso",`Código ${code} cadastrado para ${name}`,"success");
            document.getElementById('user-name').value='';
            document.getElementById('user-code').value='';
        } catch(error){
            showCustomMessage("Erro",error.message,"error");
        }
    });

    document.getElementById('users-list').addEventListener('click', async e=>{
        if(!e.target.classList.contains('delete-btn')) return;
        const id = e.target.dataset.id;
        if(confirm('Deseja excluir este código?')){
            try{
                await deleteUser(usersCollectionPath,id);
                showCustomMessage("Excluído","Código removido","success");
            } catch(err){
                showCustomMessage("Erro",err.message,"error");
            }
        }
    });

    document.getElementById('modal-close').addEventListener('click', ()=>{
        document.getElementById('custom-modal').classList.add('hidden');
    });
});
