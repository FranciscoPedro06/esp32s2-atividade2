export function showCustomMessage(title, message, type) {
    const modal = document.getElementById('custom-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modalIcon = document.getElementById('modal-icon');

    modalTitle.textContent = title;
    modalMessage.textContent = message;

    modalIcon.innerHTML = '';
    modalIcon.className = 'mx-auto flex items-center justify-center h-12 w-12 rounded-full';
    
    if (type==='success') modalIcon.innerHTML = `<div class="bg-green-100 h-12 w-12 flex items-center justify-center rounded-full"><svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg></div>`;
    else modalIcon.innerHTML = `<div class="bg-red-100 h-12 w-12 flex items-center justify-center rounded-full"><svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></div>`;

    modal.classList.remove('hidden');
    setTimeout(()=>modal.classList.add('hidden'),3000);
}

export function sanitizeNumericInput(input) {
    input.value = input.value.replace(/\D/g,'');
}
