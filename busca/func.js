document.addEventListener('DOMContentLoaded', () => {
    // --- Seleção de Elementos ---
    const totalResults = document.getElementById('total-results');
    const productCards = document.querySelectorAll('.product-card');
    const resultsList = document.querySelector('.results-list');
    const paginationNav = document.getElementById('pagination-nav');
    const paginationContainer = paginationNav.querySelector('.pagination');

    // Filtros
    const searchInput = document.getElementById('filtro-pesquisa'); 
    const estadosInput = document.querySelectorAll('.filtro-estado');
    const localizacaoInput = document.getElementById('filtro-localizacao');
    const precoMinInput = document.getElementById('preco-min');
    const precoMaxInput = document.getElementById('preco-max');
    const anoMinInput = document.getElementById('ano-min');
    const anoMaxInput = document.getElementById('ano-max');
    const filtroMarcas = document.querySelectorAll('.filtro-marca');

    // Ordenação e Paginação
    const sortSelect = document.getElementById('sort');
    const showSelect = document.getElementById('show');

	let currentPage = 1;
    let itemsPerPage = parseInt(showSelect.value);

    // Choices for Select customize
    new Choices(document.getElementById('show'), {
        itemSelectText: '',
        searchEnabled: false,
        classNames: {
            containerOuter: ['choices', 'choices-show'],
            containerInner: ['choices__inner', 'bg-dark', 'form-select'], 
            input: ['choices__input', 'text-white'],
            list: 'choices__list',
            listItems: 'choices__list--multiple',
            listSingle: 'choices__list--single',
            listDropdown: ['choices__list--dropdown', 'bg-dark'],
            item: ['choices__item', 'text-white'],
            itemChoice: 'choices__item--choice',
            itemSelectable: 'choices__item--selectable',
        },
    });
    new Choices(document.getElementById('sort'), {
        itemSelectText: '',
        searchEnabled: false,
        shouldSort: false,
        classNames: {
            containerOuter: ['choices', 'choices-sort'],
            containerInner: ['choices__inner', 'bg-dark', 'form-select'], 
            input: ['choices__input', 'text-white'],
            list: 'choices__list',
            listItems: 'choices__list--multiple',
            listSingle: 'choices__list--single',
            listDropdown: ['choices__list--dropdown', 'bg-dark'],
            item: ['choices__item', 'text-white'],
            itemChoice: 'choices__item--choice',
            itemSelectable: 'choices__item--selectable',
        },
    });
    new Choices(document.getElementById('filtro-localizacao'), {
        itemSelectText: '',
        searchEnabled: false,
        shouldSort: false,
        classNames: {
            containerOuter: ['choices'],
            containerInner: ['choices__inner', 'bg-dark', 'form-select'], 
            input: ['choices__input', 'text-white'],
            list: 'choices__list',
            listItems: 'choices__list--multiple',
            listSingle: 'choices__list--single',
            listDropdown: ['choices__list--dropdown', 'bg-dark'],
            item: ['choices__item', 'text-white'],
            itemChoice: 'choices__item--choice',
            itemSelectable: 'choices__item--selectable',
        },
    });

    // --- Função para Renderizar a Paginação ---
    function setupPagination(totalItems, itemsPerPage, currentPage) {
        paginationContainer.innerHTML = ''; 
        paginationNav.style.display = 'flex';

        const totalPages = Math.ceil(totalItems / itemsPerPage);

        // Se tiver 1 página ou menos, não mostra a paginação
        if (totalPages <= 1) {
            paginationNav.style.display = 'none';
            return;
        }

        // Botão "Anterior"
        let prevLi = `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                        <a class="page-link" href="#" data-page="${currentPage - 1}">Anterior</a>
                      </li>`;
        paginationContainer.insertAdjacentHTML('beforeend', prevLi);

        // Botões de Página
        for (let i = 1; i <= totalPages; i++) {
            let pageLi = `<li class="page-item ${i === currentPage ? 'active' : ''}">
                            <a class="page-link" href="#" data-page="${i}">${i}</a>
                          </li>`;
            paginationContainer.insertAdjacentHTML('beforeend', pageLi);
        }

        // Botão "Próximo"
        let nextLi = `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                        <a class="page-link" href="#" data-page="${currentPage + 1}">Próximo</a>
                      </li>`;
        paginationContainer.insertAdjacentHTML('beforeend', nextLi);
    }

    // --- Função Principal para Atualizar os Resultados (Filtrar, Ordenar e Paginar) ---
    function updateResults() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
		
        // Obter valores dos filtros
        const searchTerm = searchInput.value.trim().toLowerCase();
        const estadosSelecionados = Array.from(estadosInput).filter(cb => cb.checked).map(cb => cb.value);
        const localizacaoSelecionada = localizacaoInput.value;
        const precoMin = parseFloat(precoMinInput.value) || 0;
        const precoMax = parseFloat(precoMaxInput.value) || Infinity;
        const anoMin = parseInt(anoMinInput.value) || 0;
        const anoMax = parseInt(anoMaxInput.value) || Infinity;
        const marcasSelecionadas = Array.from(filtroMarcas).filter(cb => cb.checked).map(cb => cb.value);
        
        let cardsArray = Array.from(productCards);

        // FILTRAR
        const filteredCards = cardsArray.filter(card => {
            const cardTitle = card.querySelector('.product-title').textContent.trim().toLowerCase();
            const cardEstado = card.dataset.estado;
            const cardLocalizacao = card.dataset.localizacao;
            const cardPreco = parseFloat(card.dataset.preco);
            const cardAno = parseInt(card.dataset.ano);
            const cardMarca = card.dataset.marca;

            const searchMatch = searchTerm === '' || cardTitle.includes(searchTerm); 
            const estadoMatch = estadosSelecionados.length === 0 || estadosSelecionados.includes(cardEstado);
            const localizacaoMatch = localizacaoSelecionada === 'Todos' || cardLocalizacao === localizacaoSelecionada;
            const precoMatch = cardPreco >= precoMin && cardPreco <= precoMax;
            const anoMatch = cardAno >= anoMin && cardAno <= anoMax;
            const marcaMatch = marcasSelecionadas.length === 0 || marcasSelecionadas.includes(cardMarca);

            return searchMatch && estadoMatch && localizacaoMatch && precoMatch && anoMatch && marcaMatch;
        });

        // ORDENAR
        const sortValue = sortSelect.value;
        filteredCards.sort((a, b) => {
            const precoA = parseFloat(a.dataset.preco);
            const precoB = parseFloat(b.dataset.preco);
            const anoA = parseInt(a.dataset.ano);
            const anoB = parseInt(b.dataset.ano);

            switch (sortValue) {
                case 'Menor preço': return precoA - precoB;
                case 'Maior preço': return precoB - precoA;
                case 'Mais recentes': return anoB - anoA;
                default: return 0;
            }
        });

        // Atualiza a contagem de resultados
        const totalVisibleCards = filteredCards.length;
        if (totalVisibleCards === 0) {
            totalResults.innerHTML = `Nenhum resultado encontrado`;
        } else if (totalVisibleCards === 1) {
            totalResults.innerHTML = `${totalVisibleCards} resultado`;
        } else {
            totalResults.innerHTML = `${totalVisibleCards} resultados`;
        }

        // PAGINAR
        itemsPerPage = parseInt(showSelect.value);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedCards = filteredCards.slice(startIndex, endIndex);
        
        // RENDERIZAR
        resultsList.innerHTML = '';
        paginatedCards.forEach((card, index) => {
            resultsList.appendChild(card.cloneNode(true));

            // Adiciona <hr> entre os cards
            if (index < paginatedCards.length - 1) {
                const hr = document.createElement('hr');
                resultsList.appendChild(hr);
            }
        });

        // RENDERIZAR CONTROLES DA PAGINAÇÃO
        setupPagination(totalVisibleCards, itemsPerPage, currentPage);
    }
	

    // --- Adicionando os Event Listeners ---
    function handleFilterChange() {
        currentPage = 1;
        updateResults();
    }
    
    sortSelect.addEventListener('change', handleFilterChange);
    showSelect.addEventListener('change', handleFilterChange);

    document.querySelectorAll('.filter-sidebar select, .filter-sidebar input[type="checkbox"]').forEach(element => {
        element.addEventListener('change', handleFilterChange);
    });

    document.querySelectorAll('.filter-sidebar input[type="text"]').forEach(input => {
        input.addEventListener('keyup', handleFilterChange);
    });


    // Event Listener para os cliques na paginação
    paginationContainer.addEventListener('click', (e) => {
        e.preventDefault();
        const link = e.target.closest('a.page-link');
        if (!link) return;

        const li = link.parentElement;
        if (li.classList.contains('disabled') || li.classList.contains('active')) {
            return;
        }
        
        currentPage = parseInt(link.dataset.page);
        updateResults();
    });
    
    // Chamada inicial para carregar os resultados
    updateResults();
});