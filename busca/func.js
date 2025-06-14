let slideIndex = 1;
// As funções de slide não serão usadas aqui, mas não causam problema.
// showSlides(slideIndex); 

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    if (!slides.length) return; // Não executa se os elementos não existirem
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
}

function VerMais() {
    let more = document.getElementById("morePort");
    if(!more) return; // Não executa se o elemento não existir
    let up = document.getElementById("upPort");
    let down = document.getElementById("downPort");
    let btnSeeMore = document.getElementById("btnVerMais");

    if (more.style.display === "" || more.style.display === "none") {
        more.style.display = "inline";
        btnSeeMore.innerHTML = "VER MENOS";
        up.style.display = "inline";
        down.style.display = "none";
    } else {
        more.style.display = "none";
        btnSeeMore.innerHTML = "VER MAIS";
        up.style.display = "none";
        down.style.display = "inline";
    }
}

function VerMaisTestemunhos() {
    let more = document.getElementById("another-car-brands");
    if(!more) return; // Não executa se o elemento não existir
    let up = document.getElementById("upTest");
    let down = document.getElementById("downTest");
    let btnSeeMore = document.getElementById("btnVerMaisTestemunho");

    if (more.style.display === "" || more.style.display === "none") {
        more.style.display = "inline";
        btnSeeMore.innerHTML = "VER MENOS";
        up.style.display = "inline";
        down.style.display = "none";
    } else {
        more.style.display = "none";
        btnSeeMore.innerHTML = "VER MAIS";
        up.style.display = "none";
        down.style.display = "inline";
    }
}

function Confirmar() {
    let text = "Precione 'OK' para confirmar ou Cancelar";
    if (confirm(text) == true) {
        text = "Salvo!!";
    } else {
        text = "Cancelado!!";
    }
    let resposta = document.getElementById("resposta");
    if(resposta) {
      resposta.innerHTML = text;
    }
}

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