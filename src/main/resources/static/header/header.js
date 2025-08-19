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