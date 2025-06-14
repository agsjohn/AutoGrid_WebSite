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


document.addEventListener('DOMContentLoaded', () => {
    // --- Seleção de Elementos ---
    const totalResults = document.getElementById('total-results');
    const productCards = document.querySelectorAll('.product-card');
    const resultsList = document.querySelector('.results-list'); 

    // Filtros
    const estadosInput = document.querySelectorAll('.filtro-estado');
    const localizacaoInput = document.getElementById('filtro-localizacao');
    const precoMinInput = document.getElementById('preco-min');
    const precoMaxInput = document.getElementById('preco-max');
    const anoMinInput = document.getElementById('ano-min');
    const anoMaxInput = document.getElementById('ano-max');
    const filtroMarcas = document.querySelectorAll('.filtro-marca');

    // Ordenação
    const sortSelect = document.getElementById('sort');


    // --- Função Principal para Atualizar os Resultados (Filtrar e Ordenar) ---
    function updateResults() {
        // Obter valores dos filtros
        const estadosSelecionados = Array.from(estadosInput)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);
        const localizacaoSelecionada = localizacaoInput.value;
        const precoMin = parseFloat(precoMinInput.value) || 0;
        const precoMax = parseFloat(precoMaxInput.value) || Infinity;
        const anoMin = parseInt(anoMinInput.value) || 0;
        const anoMax = parseInt(anoMaxInput.value) || Infinity;
        const marcasSelecionadas = Array.from(filtroMarcas)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        // Converte NodeList para Array para poder usar o .sort()
        let cardsArray = Array.from(productCards);

        // --- LÓGICA DE ORDENAÇÃO ---
        const sortValue = sortSelect.value;
        cardsArray.sort((a, b) => {
            const precoA = parseFloat(a.dataset.preco);
            const precoB = parseFloat(b.dataset.preco);
            const anoA = parseInt(a.dataset.ano);
            const anoB = parseInt(b.dataset.ano);

            switch (sortValue) {
                case 'Menor preço':
                    return precoA - precoB; // Ordena do menor para o maior preço
                case 'Maior preço':
                    return precoB - precoA; // Ordena do maior para o menor preço
                case 'Mais recentes':
                    return anoB - anoA; // Ordena do maior para o menor ano (mais recente primeiro)
                default:
                    return 0; // 'Mais relevantes', mantém a ordem original
            }
        });
        
        // Limpa a lista de resultados para adicionar os itens em ordem
        resultsList.innerHTML = '';
        
        let visibleCardsCount = 0;

        // Filtra o array já ordenado
        cardsArray.forEach(card => {
            const cardEstado = card.dataset.estado;
            const cardLocalizacao = card.dataset.localizacao;
            const cardPreco = parseFloat(card.dataset.preco);
            const cardAno = parseInt(card.dataset.ano);
            const cardMarca = card.dataset.marca;
            
            let shouldDisplay = true;

            if (estadosSelecionados.length > 0 && !estadosSelecionados.includes(cardEstado)) {
                shouldDisplay = false;
            }
            if (localizacaoSelecionada !== 'Todos' && cardLocalizacao !== localizacaoSelecionada) {
                shouldDisplay = false;
            }
            if (cardPreco < precoMin || cardPreco > precoMax) {
                shouldDisplay = false;
            }
            if (cardAno < anoMin || cardAno > anoMax) {
                shouldDisplay = false;
            }
            if (marcasSelecionadas.length > 0 && !marcasSelecionadas.includes(cardMarca)) {
                shouldDisplay = false;
            }

            // Se o card passar por todos os filtros, ele é exibido
            if (shouldDisplay) {
                // Adiciona o card e o seu respectivo <hr> de volta na lista
                resultsList.appendChild(card);
                const hr = document.createElement('hr');
                resultsList.appendChild(hr);

                visibleCardsCount++;
            }
        });
        
        // Remove o último <hr> que foi adicionado desnecessariamente
        if (resultsList.lastChild && resultsList.lastChild.tagName === 'HR') {
            resultsList.removeChild(resultsList.lastChild);
        }

        // Atualiza a contagem de resultados
        if(visibleCardsCount === 0){
            totalResults.innerHTML = `Nenhum resultado encontrado`;
        } else if (visibleCardsCount === 1){
            totalResults.innerHTML = `${visibleCardsCount} resultado`;
        } else{
            totalResults.innerHTML = `${visibleCardsCount} resultados`;
        }
    }

    // --- Adicionando os Event Listeners ---
    
    sortSelect.addEventListener('change', updateResults);

    document.querySelectorAll('.filter-sidebar select, .filter-sidebar input[type="checkbox"]').forEach(element => {
        element.addEventListener('change', updateResults);
    });

    document.querySelectorAll('.filter-sidebar input[type="text"]').forEach(input => {
        input.addEventListener('keyup', updateResults);
    });
    
    updateResults(); 
});