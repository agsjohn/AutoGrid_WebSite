document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            // Prevent the default form submission behavior (page reload)
            event.preventDefault();

            const email = document.getElementById('loginEmail').value;

            // Basic validation check
            if (email) {
                // In a real application, you would send the data to a server here.
                // For demonstration, we'll just show an alert.
                alert('Login solicitado para: ' + email + '\n(Esta é uma simulação)');
                
                // Optionally, redirect to the main page after a successful login simulation
                // window.location.href = 'index.html'; 
            } else {
                alert('Por favor, preencha o campo de e-mail.');
            }
        });
    }
});

function showSidebar(){
    const sidebar = document.querySelector('.sidebar');
    const menubutton = document.querySelector('.menu-button svg');
    sidebar.style.display = 'flex';
    menubutton.style.fill = "none";
}

function hideSidebar(){
    const sidebar = document.querySelector('.sidebar');
    const menubutton = document.querySelector('.menu-button svg');
    sidebar.style.display = 'none';
    menubutton.style.fill = "white";
}

window.addEventListener('resize', function() {
    const currentWidth = window.innerWidth;
    if(currentWidth > 800){
        hideSidebar();
    }
});