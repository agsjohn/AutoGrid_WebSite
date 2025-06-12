let slideIndex = 1;
showSlides(slideIndex);

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
    if (n >= slides.length ) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length - 1}
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
    let more = document.getElementById("moreTest");
    let up = document.getElementById("upTest");
    let down = document.getElementById("downTest");
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

function Confirmar() {
    let text = "Precione 'OK' para confirmar ou Cancelar";
    if (confirm(text) == true) {
        let text = "Salvo!!";
    } else {
        let text = "Cancelado!!";
    }
    document.getElementById("resposta").innerHTML = text;
}