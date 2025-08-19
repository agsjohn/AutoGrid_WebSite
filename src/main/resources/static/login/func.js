document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('invalidLogin');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        errorMessage.classList.add('d-none');

        const formData = new FormData(loginForm);

        try {
            const response = await fetch(loginForm.action, {
                method: 'POST',
                body: new URLSearchParams(formData)
            });

            if (response.ok) {
                window.location.href = '/painel';
            } else {
                errorMessage.classList.remove('d-none');
            }
        } catch (error) {
            console.error('Erro ao tentar fazer login:', error);
            errorMessage.textContent = 'Ocorreu um erro de conexão. Tente novamente.';
            errorMessage.classList.remove('d-none');
        }
    });
});
