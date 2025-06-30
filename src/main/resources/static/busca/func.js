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

    function renderCards(carros) {
        resultsList.innerHTML = ''; // Limpa a lista atual

        if (carros.length === 0) {
            resultsList.innerHTML = '<p>Nenhum resultado encontrado para os filtros selecionados.</p>';
            return;
        }

        carros.forEach((carro, index) => {
            // Construa o HTML do card dinamicamente
            // Certifique-se que os nomes das propriedades (carro.nome, carro.preco)
            // correspondem aos atributos da sua classe Carro em Java.
            const cardHTML = `
                <div class="product-card" 
                    data-marca="${carro.marca.toLowerCase()}" 
                    data-ano="${carro.ano}" 
                    data-preco="${carro.preco}" 
                    data-localizacao="${carro.localizacao}" 
                    data-estado="${carro.estado}">
                    <a href="/produto/${carro.id}" class="product-link">
                        <img src="${carro.imageUrl}" alt="${carro.nome}">
                        <div class="product-card-body">
                            <h5 class="product-title">${carro.titulo}</h5>
                            <p class="product-price">R$ ${carro.preco.toLocaleString('pt-BR')}</p>
                            <p class="product-details">${carro.ano} | ${carro.quilometragem} km</p>
                            <p class="product-location">${carro.localizacao}</p>
                        </div>
                    </a>
                </div>
            `;
            resultsList.insertAdjacentHTML('beforeend', cardHTML);

            // Adiciona <hr> entre os cards
            if (index < carros.length - 1) {
                resultsList.insertAdjacentHTML('beforeend', '<hr>');
            }
        });
    }

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
    async function updateResults() { // Transformada em uma função assíncrona
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // 1. Obter valores dos filtros (isso continua igual)
        const searchTerm = searchInput.value.trim().toLowerCase();
        const estadosSelecionados = Array.from(estadosInput).filter(cb => cb.checked).map(cb => cb.value);
        const localizacaoSelecionada = localizacaoInput.value;
        const precoMin = parseFloat(precoMinInput.value) || 0;
        const precoMax = parseFloat(precoMaxInput.value) || Infinity;
        const anoMin = parseInt(anoMinInput.value) || null;
        const anoMax = parseInt(anoMaxInput.value) || null;
        const marcasSelecionadas = Array.from(filtroMarcas).filter(cb => cb.checked).map(cb => cb.value);
        // ... pegue todos os outros filtros

        // 2. Construir a URL da API com os parâmetros de busca
        const params = new URLSearchParams();
        if (searchTerm) params.append('titulo', searchTerm);
        if (estadosSelecionados.length > 0) params.append('tipo', estadosSelecionados.join(',')); // Pode precisar de tratamento no backend se for mais de uma
        if (localizacaoSelecionada != 'Todos') params.append('localizacao', localizacaoSelecionada);
        if (precoMin) params.append('precoMin', precoMin);
        if (precoMax) params.append('precoMax', precoMax);
        if (anoMin) params.append('anoMin', anoMin);
        if (anoMax) params.append('anoMax', anoMax);
        if (marcasSelecionadas.length > 0) params.append('marca', marcasSelecionadas.join(',')); // Pode precisar de tratamento no backend se for mais de uma
        // ... adicione outros parâmetros

        const apiUrl = `/api/buscar?${params.toString()}`;

        try {
            // 3. Fazer a chamada AJAX com fetch
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('A resposta da rede não foi bem-sucedida.');
            }
            let filteredCars = await response.json(); // Os dados vêm filtrados do backend!

            // 4. ORDENAR (pode ser feito no frontend ou backend)
            // Por simplicidade, vamos manter a ordenação e paginação no frontend por enquanto.
            const sortValue = sortSelect.value;
            filteredCars.sort((a, b) => {
                switch (sortValue) {
                    case 'Menor preço': return a.preco - b.preco;
                    case 'Maior preço': return b.preco - a.preco;
                    case 'Mais recentes': return b.ano - a.ano;
                    default: return 0;
                }
            });

            // 5. Atualizar contagem de resultados
            totalResults.textContent = `${filteredCars.length} resultado(s)`;
            
            // 6. PAGINAR
            itemsPerPage = parseInt(showSelect.value);
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const paginatedCars = filteredCars.slice(startIndex, endIndex);

            // 7. RENDERIZAR
            renderCards(paginatedCars); // Usa a nova função para criar os cards
            setupPagination(filteredCars.length, itemsPerPage, currentPage);

        } catch (error) {
            console.error('Erro ao buscar carros:', error);
            resultsList.innerHTML = '<p>Ocorreu um erro ao carregar os resultados. Tente novamente mais tarde.</p>';
        }
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