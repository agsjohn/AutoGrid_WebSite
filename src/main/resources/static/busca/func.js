document.addEventListener('DOMContentLoaded', () => {
    // --- Seleção de Elementos ---
    const totalResults = document.getElementById('total-results');
    const resultsList = document.querySelector('.results-list');
    const paginationNav = document.getElementById('pagination-nav');
    const paginationContainer = paginationNav.querySelector('.pagination');

    // Filtros (elementos principais)
    const searchInput = document.getElementById('filtro-pesquisa');
    const estadosInput = document.querySelectorAll('.filtro-estado');
    const localizacaoSelect = document.getElementById('filtro-localizacao');
    const marcasContainer = document.getElementById('filtro-marcas-container');
    const precoMinInput = document.getElementById('preco-min');
    const precoMaxInput = document.getElementById('preco-max');
    const anoMinInput = document.getElementById('ano-min');
    const anoMaxInput = document.getElementById('ano-max');

    // Ordenação e Paginação
    const sortSelect = document.getElementById('sort');
    const showSelect = document.getElementById('show');

    let currentPage = 1;
    let itemsPerPage = parseInt(showSelect.value);
    let choicesLocalizacao; // Variável para guardar a instância do Choices.js

    // Inicializa Choices.js para os selects estáticos

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

    /**
     * Popula os filtros de Localização e Marca buscando dados da API.
     */
    async function popularFiltros() {
        try {
            // --- Popular Localizações ---
            const locResponse = await fetch('/api/localizacoes');
            if (!locResponse.ok) throw new Error('Falha ao buscar localizações');
            const localizacoes = await locResponse.json();

            // Limpa opções antigas (exceto a primeira "Todos")
            while (localizacaoSelect.options.length > 1) {
                localizacaoSelect.remove(1);
            }
            localizacoes.forEach(loc => {
                const option = new Option(loc, loc);
                localizacaoSelect.add(option);
            });

            // Inicializa o Choices.js para o select de localização DEPOIS de populá-lo
            if (choicesLocalizacao) choicesLocalizacao.destroy();
            choicesLocalizacao = new Choices(localizacaoSelect, {
                itemSelectText: '',
                searchPlaceholderValue: 'Pesquise a localização...',
                searchEnabled: true,
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

            // --- Popular Marcas ---
            const marcaResponse = await fetch('/api/marcas');
            if (!marcaResponse.ok) throw new Error('Falha ao buscar marcas');
            const marcas = await marcaResponse.json();

            marcasContainer.innerHTML = ''; // Limpa o container
            marcas.forEach(marca => {
                const div = document.createElement('div');
                div.className = 'form-check';
                const id = `marca-${marca.toLowerCase().replace(/\s+/g, '-')}`;
                // Capitaliza a primeira letra para o label
                const label = marca.charAt(0).toUpperCase() + marca.slice(1);
                div.innerHTML = `
                    <input class="form-check-input filtro-marca" type="checkbox" value="${marca.toLowerCase()}" id="${id}">
                    <label class="form-check-label" for="${id}">${label}</label>
                `;
                marcasContainer.appendChild(div);
            });

        } catch (error) {
            console.error("Erro ao popular filtros:", error);
            marcasContainer.innerHTML = "<p class='text-danger'>Erro ao carregar filtros.</p>";
        }
    }

    /**
     * Renderiza os cards dos carros na lista de resultados.
     */
    function renderCards(carros) {
        // (Sua função renderCards existente vai aqui - sem alterações)
        resultsList.innerHTML = ''; 
        if (carros.length === 0) {
            resultsList.innerHTML = '<p>Nenhum resultado encontrado para os filtros selecionados.</p>';
            return;
        }
        carros.forEach((carro, index) => {
            const cardHTML = `
                <div class="product-card">
                    <a href="/produtos/${carro.id}" class="product-link">
                        <img src="${carro.imageUrl}" alt="${carro.titulo}">
                        <div class="product-card-body">
                            <h5 class="product-title">${carro.titulo}</h5>
                            <p class="product-price">R$ ${carro.preco.toLocaleString('pt-BR')}</p>
                            <p class="product-details">${carro.ano} | ${carro.quilometragem.toLocaleString('pt-BR')} km</p>
                            <p class="product-location">${carro.localizacao}</p>
                        </div>
                    </a>
                </div>
            `;
            resultsList.insertAdjacentHTML('beforeend', cardHTML);
            if (index < carros.length - 1) {
                resultsList.insertAdjacentHTML('beforeend', '<hr>');
            }
        });
    }

    /**
     * Configura e renderiza os controles de paginação.
     */
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


    /**
     * Função principal para buscar dados da API, filtrar, ordenar e renderizar.
     */
    async function updateResults() {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Obter valores dos filtros
        const searchTerm = searchInput.value.trim().toLowerCase();
        const estadosSelecionados = Array.from(estadosInput).filter(cb => cb.checked).map(cb => cb.value);
        const localizacaoSelecionada = localizacaoSelect.value;
        const precoMin = parseFloat(precoMinInput.value) || null;
        const precoMax = parseFloat(precoMaxInput.value) || null;
        const anoMin = parseInt(anoMinInput.value) || null;
        const anoMax = parseInt(anoMaxInput.value) || null;
        // Pega as marcas dos checkboxes que foram criados dinamicamente
        const marcasSelecionadas = Array.from(document.querySelectorAll('.filtro-marca:checked')).map(cb => cb.value);

        // Construir a URL da API
        const params = new URLSearchParams();
        if (searchTerm) params.append('titulo', searchTerm);
        if (estadosSelecionados.length > 0) estadosSelecionados.forEach(estado => params.append('tipo', estado));
        if (localizacaoSelecionada && localizacaoSelecionada !== 'Todos') params.append('localizacao', localizacaoSelecionada);
        if (precoMin) params.append('precoMin', precoMin);
        if (precoMax && isFinite(precoMax)) params.append('precoMax', precoMax);
        if (anoMin) params.append('anoMin', anoMin);
        if (anoMax) params.append('anoMax', anoMax);
        if (marcasSelecionadas.length > 0) marcasSelecionadas.forEach(m => params.append('marca', m));

        const apiUrl = `/api/buscar?${params.toString()}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('A resposta da rede não foi bem-sucedida.');
            let filteredCars = await response.json();

            // Ordenar no frontend
            const sortValue = sortSelect.value;
            filteredCars.sort((a, b) => {
                switch (sortValue) {
                    case 'Menor preço': return a.preco - b.preco;
                    case 'Maior preço': return b.preco - a.preco;
                    case 'Mais recentes': return b.ano - a.ano;
                    default: return 0;
                }
            });

            // Atualizar contagem
            totalResults.textContent = `${filteredCars.length} resultado(s)`;
            
            // Paginar
            itemsPerPage = parseInt(showSelect.value);
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const paginatedCars = filteredCars.slice(startIndex, endIndex);

            // Renderizar
            renderCards(paginatedCars);
            setupPagination(filteredCars.length, itemsPerPage, currentPage);

        } catch (error) {
            console.error('Erro ao buscar carros:', error);
            resultsList.innerHTML = '<p>Ocorreu um erro ao carregar os resultados. Tente novamente mais tarde.</p>';
        }
    }

    /**
     * Handler para qualquer mudança nos filtros. Reseta a página e atualiza.
     */
    function handleFilterChange() {
        currentPage = 1;
        updateResults();
    }

    /**
     * Adiciona todos os event listeners aos elementos da página.
     */
    function addEventListeners() {
        // Listeners para filtros estáticos
        sortSelect.addEventListener('change', handleFilterChange);
        showSelect.addEventListener('change', handleFilterChange);
        estadosInput.forEach(el => el.addEventListener('change', handleFilterChange));
        [searchInput, precoMinInput, precoMaxInput, anoMinInput, anoMaxInput].forEach(input => {
            input.addEventListener('keyup', handleFilterChange);
        });
        
        // Listeners para filtros dinâmicos (usando delegação de eventos)
        localizacaoSelect.addEventListener('change', handleFilterChange);
        marcasContainer.addEventListener('change', (e) => {
            if (e.target.classList.contains('filtro-marca')) {
                handleFilterChange();
            }
        });

        // Listener para paginação
        paginationContainer.addEventListener('click', (e) => {
            e.preventDefault();
            const link = e.target.closest('a.page-link');
            if (!link || link.parentElement.classList.contains('disabled') || link.parentElement.classList.contains('active')) return;
            currentPage = parseInt(link.dataset.page);
            updateResults();
        });
    }

    /**
     * Função de inicialização
     */
    async function init() {
        addEventListeners();
        await popularFiltros(); // Popula os filtros dinâmicos
        updateResults();      // Busca os resultados iniciais
    }

    // Inicia tudo!
    init();
});