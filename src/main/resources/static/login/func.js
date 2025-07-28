document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault(); 
            
            executarLogin(loginForm); 
        });
    }
});

async function executarLogin(form) {
    const formData = new FormData(form);

    document.getElementById('invalidLogin').classList.add('d-none');

    try {
        const response = await fetch(form.action, {
            method: 'POST',
            body: new URLSearchParams(formData)
        });

        if (response.ok) {
            window.location.href = '/painel';
        } else {
            document.getElementById('invalidLogin').classList.remove('d-none');
        }
    } catch (error) {
        console.error('Erro ao tentar fazer login:', error);
        const invalidLoginEl = document.getElementById('invalidLogin');
        invalidLoginEl.textContent = 'Erro de conexão. Tente novamente.';
        invalidLoginEl.classList.remove('d-none');
    }
}