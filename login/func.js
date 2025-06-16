document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const email = document.getElementById('loginEmail').value;

            if (email) {
                alert('Login solicitado para: ' + email + '\n(Esta é uma simulação)');
            } else {
                alert('Por favor, preencha o campo de e-mail.');
            }
        });
    }
});