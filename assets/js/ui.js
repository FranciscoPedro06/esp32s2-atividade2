export function showMessage(msg) {
    const modal = document.getElementById('modal');
    document.getElementById('modal-msg').textContent = msg;
    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.add('hidden'), 2000);
}

export function sanitizeCodeInput(input) {
    input.value = input.value.replace(/\D/g, '').slice(0, 4);
}
