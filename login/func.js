document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            login();
        });
    }
});

function login(){
    var login = document.getElementById('loginUser').value;
    var password = document.getElementById('loginPassword').value;

    if(login == 'admin' && password == 'admin'){
        window.location.href = '../crud/crud.html';
    } else{
        document.getElementById('invalidLogin').classList.remove('d-none');
    }
}