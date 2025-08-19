document.addEventListener('DOMContentLoaded', () => {
    const mainImage = document.getElementById('main-product-image');
    const thumbnails = document.querySelectorAll('.thumbnail-images .thumbnail');

    if (mainImage && thumbnails.length > 0) {
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                // Remove a classe 'active' de todas as miniaturas
                thumbnails.forEach(t => t.classList.remove('active'));
                
                // Adiciona a classe 'active' à miniatura clicada
                this.classList.add('active');
                
                // Altera a imagem principal usando o atributo 'data-large-src'
                const newSrc = this.dataset.largeSrc; // Lê o atributo data-large-src
                if (newSrc) {
                   mainImage.src = newSrc;
                   mainImage.alt = this.alt.replace(/Thumbnail \d+/g, '').trim(); // Limpa o alt text
                }
            });
        });
    }
});