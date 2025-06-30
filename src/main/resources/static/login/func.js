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
    // Pega os dados do formulário. 
    const formData = new FormData(form);

    // Esconde a mensagem de erro antes de tentar o login novamente
    document.getElementById('invalidLogin').classList.add('d-none');

    try {
        const response = await fetch(form.action, {
            method: 'POST',
            body: new URLSearchParams(formData)
        });

        if (response.redirected) {
            window.location.href = response.url;
        } else {
            document.getElementById('invalidLogin').classList.remove('d-none');
        }
    } catch (error) {
        console.error('Erro ao tentar fazer login:', error);
        document.getElementById('invalidLogin').textContent = 'Erro de conexão. Tente novamente.';
        document.getElementById('invalidLogin').classList.remove('d-none');
    }
}