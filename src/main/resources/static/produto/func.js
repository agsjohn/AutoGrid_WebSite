document.addEventListener('DOMContentLoaded', () => {
    // Verifica se os elementos da galeria existem na página atual
    const mainImage = document.getElementById('main-product-image');
    const thumbnails = document.querySelectorAll('.thumbnail-images .thumbnail');

    if (mainImage && thumbnails.length > 0) {
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                // Remove a classe 'active' de todas as miniaturas
                thumbnails.forEach(t => t.classList.remove('active'));
                
                // Adiciona a classe 'active' à miniatura clicada
                this.classList.add('active');
                
                // Altera a imagem principal para a imagem da miniatura clicada
                // Modifica o URL do placehold para pegar a imagem maior
                const newSrc = this.src.replace(/150x113/g, '800x600');
                mainImage.src = newSrc;
                mainImage.alt = this.alt.replace(/Thumbnail/g, 'Principal');
            });
        });
    }
});