// Lógica para formatar o campo de Preço
document.getElementById('formVehiclePrice').addEventListener('input', (event) => {
    let value = event.target.value.replace(/\D/g, '');
    if (value === '') {
        event.target.value = '';
        return;
    }
    const numberValue = parseInt(value, 10) / 100;
    const formattedValue = new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(numberValue);
    event.target.value = formattedValue;
});

// A lógica principal do seu CRUD e dos seletores
document.addEventListener('DOMContentLoaded', function () {
    // Seletores e Instâncias
    const stateSelect = document.getElementById('formState');
    const citySelect = document.getElementById('formCity');
    const vehicleModal = new bootstrap.Modal(document.getElementById('vehicleModal'));
    const deleteConfirmModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
    const vehicleForm = document.getElementById('vehicleForm');
    const vehicleModalLabel = document.getElementById('vehicleModalLabel');
    const vehicleTableBody = document.getElementById('vehicle-table-body');
    let rowToDelete = null;

    // Buscar e popular os Estados
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
        .then(res => res.json())
        .then(states => {
        states.forEach(state => {
            const option = document.createElement('option');
            option.value = state.sigla;
            option.textContent = state.nome;
            stateSelect.appendChild(option);
        });
    });

    // --- Lógica de busca de Estados e Cidades movida para cá ---
    // 1. Inicialização do Choices.js movida para o escopo principal
    const cityChoices = new Choices(citySelect, {
        searchPlaceholderValue: 'Pesquise uma cidade...',
        noResultsText: 'Nenhum resultado encontrado',
        itemSelectText: 'Pressione para selecionar',
        classNames: {
            // containerOuter: 'choices bg-dark', 
            containerOuter: 'choices', 
            // input: 'choices__input text-white',
            input: 'choices__input',
            list: 'choices__list',
            listItems: 'choices__list--multiple',
            listSingle: 'choices__list--single',
            // listDropdown: 'choices__list--dropdown bg-dark',
            listDropdown: 'choices__list--dropdown',
            // item: 'choices__item text-white',
            item: 'choices__item',
            itemChoice: 'choices__item--choice',
            itemSelectable: 'choices__item--selectable',
        },
    });

    // 2. Função para buscar cidades de um estado
    async function fetchAndSetCities(stateAbbreviation) {
        cityChoices.clearStore();
        citySelect.disabled = true;
        cityChoices.setChoices([{ value: '', label: 'Carregando cidades...', selected: true, disabled: true }], 'value', 'label', true);

        if (!stateAbbreviation) {
            cityChoices.setChoices([{ value: '', label: 'Aguardando estado...', selected: true, disabled: true }], 'value', 'label', true);
            return;
        }

        try {
            const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateAbbreviation}/municipios`);
            const cities = await response.json();
            const cityOptions = cities.map(city => ({
                value: city.nome,
                label: city.nome
            }));
            citySelect.disabled = false;
            cityChoices.setChoices(cityOptions, 'value', 'label', false);
        } catch (error) {
            console.error("Erro ao buscar cidades:", error);
            cityChoices.setChoices([{ value: '', label: 'Erro ao carregar', selected: true, disabled: true }], 'value', 'label', true);
        }
    }

    // 3. Ouvir a mudança no seletor de Estados
    stateSelect.addEventListener('change', () => {
        fetchAndSetCities(stateSelect.value);
    });


    // --- Lógica do CRUD ---
    // Abrir modal de ADIÇÃO
    document.getElementById('btn-add-vehicle').addEventListener('click', function () {
        vehicleForm.reset();
        document.getElementById('vehicleId').value = '';
        vehicleModalLabel.textContent = 'Adicionar Novo Veículo';
        stateSelect.value = "";
        citySelect.disabled = true;
        cityChoices.clearStore();
        cityChoices.setChoices([{ value: '', label: 'Aguardando estado...', selected: true, disabled: true }], 'value', 'label', true);
        
        vehicleModal.show();
    });

    // Delegação de evento para botões de EDITAR e EXCLUIR
    vehicleTableBody.addEventListener('click', async function(event) {
        const target = event.target.closest('button');
        if (!target) return;

        const row = target.closest('tr');
        const vehicleId = row.getAttribute('data-id');
        
        // Ação de EDITAR
        if (target.classList.contains('btn-edit')) {
            vehicleModalLabel.textContent = 'Editar Veículo';
            vehicleForm.reset();

            // Pega os dados da tabela
            const title = row.querySelector('.vehicle-title').textContent;
            const price = row.querySelector('.vehicle-price').textContent.replace('R$ ', ''); 
            const km = row.querySelector('.vehicle-km').textContent.replace('.', ''); 
            const location = row.querySelector('.vehicle-location').textContent;
            const imageSrc = row.querySelector('.table-img-thumbnail').src;
            const year = row.querySelector('.vehicle-year').textContent;
            const brand = row.querySelector('.vehicle-brand').textContent;
            
            // Preenche o formulário
            document.getElementById('vehicleId').value = vehicleId;
            document.getElementById('formVehicleTitle').value = title;
            document.getElementById('formVehiclePrice').value = price;
            document.getElementById('formVehicleKm').value = km;
            document.getElementById('formVehicleImage').value = imageSrc;
            document.getElementById('formVehicleYear').value = year;
            document.getElementById('formVehicleBrand').value = brand;

            // Preenche o estado e a cidade
            if (location.includes(',')) {
                const [cityName, stateAbbr] = location.split(',').map(item => item.trim());
                
                // Seleciona o estado
                stateSelect.value = stateAbbr;
                
                // Carrega as cidades e depois seleciona a cidade correta
                await fetchAndSetCities(stateAbbr);
                cityChoices.setChoiceByValue(cityName);
            }
            
            vehicleModal.show();
        }

        // Ação de EXCLUIR
        if (target.classList.contains('btn-delete')) {
            rowToDelete = row;
            const vehicleName = row.querySelector('.vehicle-title').textContent;
            document.getElementById('vehicle-to-delete-name').textContent = vehicleName;
            deleteConfirmModal.show();
        }
    });

    // Confirmação de exclusão
    document.getElementById('btn-confirm-delete').addEventListener('click', function() {
        if (rowToDelete) {
            rowToDelete.remove();
            rowToDelete = null;
        }
        deleteConfirmModal.hide();
    });

    // Lógica para SALVAR (Adicionar ou Editar)
    vehicleForm.addEventListener('submit', function (event) {
        event.preventDefault();
        
        const id = document.getElementById('vehicleId').value;
        const title = document.getElementById('formVehicleTitle').value;
        const price = `R$ ${document.getElementById('formVehiclePrice').value}`;
        const km = document.getElementById('formVehicleKm').value;
        const year = document.getElementById('formVehicleYear').value;
        const brand = document.getElementById('formVehicleBrand').value;
        const selectedState = stateSelect.value;
        const selectedCity = citySelect.value;
        const location = selectedCity && selectedState ? `${selectedCity}, ${selectedState}` : '';
        const imageUrl = document.getElementById('formVehicleImage').value;

        if (id) { // Se tem ID, está editando
            const rowToUpdate = vehicleTableBody.querySelector(`tr[data-id="${id}"]`);
            if (rowToUpdate) {
                rowToUpdate.querySelector('.table-img-thumbnail').src = imageUrl;
                rowToUpdate.querySelector('.vehicle-title').textContent = title;
                rowToUpdate.querySelector('.vehicle-price').textContent = price;
                rowToUpdate.querySelector('.vehicle-km').textContent = km;
                rowToUpdate.querySelector('.vehicle-location').textContent = location;
            }
        } else { // Senão, está adicionando um novo
            const newId = Date.now(); // ID simples para o exemplo
            const newRow = `
                <tr data-id="${newId}">
                    <td><img src="${imageUrl}" alt="${title}" class="table-img-thumbnail"></td>
                    <td class="vehicle-title">${title}</td>
                    <td class="vehicle-price">${price}</td>
                    <td class="vehicle-km">${km}</td>
                    <td class="vehicle-location">${location}</td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-warning btn-edit" title="Editar"><i class="bi bi-pencil-square"></i></button>
                        <button class="btn btn-sm btn-danger btn-delete" title="Excluir"><i class="bi bi-trash-fill"></i></button>
                    </td>
                </tr>
            `;
            vehicleTableBody.insertAdjacentHTML('beforeend', newRow);
        }

        vehicleModal.hide();
    });
});


// document.addEventListener('DOMContentLoaded', function () {
    
//     const stateSelect = document.getElementById('formState');
//     const citySelect = document.getElementById('formCity');

//     const vehicleModal = new bootstrap.Modal(document.getElementById('vehicleModal'));
//     const deleteConfirmModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
    
//     const vehicleForm = document.getElementById('vehicleForm');
//     const vehicleModalLabel = document.getElementById('vehicleModalLabel');
//     const vehicleTableBody = document.getElementById('vehicle-table-body');
//     let rowToDelete = null;

//     // Função para abrir modal de ADIÇÃO
//     document.getElementById('btn-add-vehicle').addEventListener('click', function () {
//         vehicleForm.reset();
//         document.getElementById('vehicleId').value = '';
//         vehicleModalLabel.textContent = 'Adicionar Novo Veículo';
//         vehicleModal.show();
//     });

//     // Delegação de evento para botões de EDITAR e EXCLUIR
//     vehicleTableBody.addEventListener('click', function(event) {
//         const target = event.target.closest('button');
//         if (!target) return;

//         const row = target.closest('tr');
//         const vehicleId = row.getAttribute('data-id');
        
//         // Ação de EDITAR
//         if (target.classList.contains('btn-edit')) {
//             vehicleModalLabel.textContent = 'Editar Veículo';

//             // Pega os dados da linha da tabela para preencher o formulário
//             const title = row.querySelector('.vehicle-title').textContent;
//             const price = row.querySelector('.vehicle-price').textContent;
//             const km = row.querySelector('.vehicle-km').textContent;
//             const location = row.querySelector('.vehicle-location').textContent;
//             const imageSrc = row.querySelector('.table-img-thumbnail').src;

//             // Preenche o formulário no modal
//             document.getElementById('vehicleId').value = vehicleId;
//             document.getElementById('formVehicleTitle').value = title;
//             document.getElementById('formVehiclePrice').value = price;
//             document.getElementById('formVehicleKm').value = km;
//             // document.getElementById('formVehicleLocation').value = location;
//             document.getElementById('formVehicleImage').value = imageSrc;
//             // (Em um app real, você buscaria a descrição e condição do DB)
//             document.getElementById('formVehicleShortDescription').value = `Descrição para ${title}.`;
//             document.getElementById('formVehicleLongDescription').value = `Descrição para ${title}.`;
            
//             vehicleModal.show();
//         }

//         // Ação de EXCLUIR
//         if (target.classList.contains('btn-delete')) {
//             rowToDelete = row;
//             const vehicleName = row.querySelector('.vehicle-title').textContent;
//             document.getElementById('vehicle-to-delete-name').textContent = vehicleName;
//             deleteConfirmModal.show();
//         }
//     });

//     // Confirmação de exclusão
//     document.getElementById('btn-confirm-delete').addEventListener('click', function() {
//         if (rowToDelete) {
//             rowToDelete.remove(); // Remove a linha da tabela
//             rowToDelete = null;
//         }
//         deleteConfirmModal.hide();
//         // Aqui você faria a chamada AJAX para deletar no servidor
//     });


//     // Lógica para SALVAR (Adicionar ou Editar)
//     vehicleForm.addEventListener('submit', function (event) {
//         event.preventDefault();

//         const id = document.getElementById('vehicleId').value;
//         const title = document.getElementById('formVehicleTitle').value;
//         const price = document.getElementById('formVehiclePrice').value;
//         const km = document.getElementById('formVehicleKm').value;
//         // const location = document.getElementById('formVehicleLocation').value;
//         const imageUrl = document.getElementById('formVehicleImage').value;

//         if (id) { // Se tem ID, está editando
//             const rowToUpdate = vehicleTableBody.querySelector(`tr[data-id="${id}"]`);
//             if (rowToUpdate) {
//                 rowToUpdate.querySelector('.table-img-thumbnail').src = imageUrl;
//                 rowToUpdate.querySelector('.vehicle-title').textContent = title;
//                 rowToUpdate.querySelector('.vehicle-price').textContent = price;
//                 rowToUpdate.querySelector('.vehicle-km').textContent = km;
//                 rowToUpdate.querySelector('.vehicle-location').textContent = location;
//             }
//         } else { // Senão, está adicionando um novo
//             const newId = Date.now(); // ID simples para o exemplo
//             const newRow = `
//                 <tr data-id="${newId}">
//                     <td><img src="${imageUrl}" alt="${title}" class="table-img-thumbnail"></td>
//                     <td class="vehicle-title">${title}</td>
//                     <td class="vehicle-price">${price}</td>
//                     <td class="vehicle-km">${km}</td>
//                     <td class="vehicle-location">${location}</td>
//                     <td class="text-center">
//                         <button class="btn btn-sm btn-warning btn-edit" title="Editar"><i class="bi bi-pencil-square"></i></button>
//                         <button class="btn btn-sm btn-danger btn-delete" title="Excluir"><i class="bi bi-trash-fill"></i></button>
//                     </td>
//                 </tr>
//             `;
//             vehicleTableBody.insertAdjacentHTML('beforeend', newRow);
//         }

//         vehicleModal.hide();
//     });
    
//     // Buscar e popular os Estados
//     fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
//         .then(res => res.json())
//         .then(states => {
//         states.forEach(state => {
//             const option = document.createElement('option');
//             option.value = state.sigla;
//             option.textContent = state.nome;
//             stateSelect.appendChild(option);
//         });
//     });

//     // Inicializa o Choices.js para o seletor de cidades
//     const cityChoices = new Choices(citySelect, {
//         searchPlaceholderValue: 'Pesquise uma cidade...',
//         noResultsText: 'Nenhum resultado encontrado',
//         itemSelectText: 'Pressione para selecionar',
//         classNames: {
//         containerOuter: 'choices bg-dark', // Adaptação para o tema escuro
//         input: 'choices__input text-white',
//         list: 'choices__list',
//         listItems: 'choices__list--multiple',
//         listSingle: 'choices__list--single',
//         listDropdown: 'choices__list--dropdown bg-dark',
//         item: 'choices__item text-white',
//         itemChoice: 'choices__item--choice',
//         itemSelectable: 'choices__item--selectable',
//         // Adicione mais classes conforme necessário para seu CSS
//         },
//     });

//     // Ouvir a mudança no seletor de Estados
//     stateSelect.addEventListener('change', () => {
//         const selectedState = stateSelect.value;

//         // Limpa o seletor de cidades e desabilita
//         cityChoices.clearStore();
//         citySelect.disabled = true;
//         cityChoices.setChoices([{ value: '', label: 'Carregando cidades...', selected: true, disabled: true }], 'value', 'label', true);

//         if (!selectedState) {
//             cityChoices.setChoices([{ value: '', label: 'Aguardando estado...', selected: true, disabled: true }], 'value', 'label', true);
//             return;
//         }

//         // Buscar e popular as Cidades do estado selecionado
//         fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedState}/municipios`)
//         .then(res => res.json())
//         .then(cities => {
//             const cityOptions = cities.map(city => ({
//             value: city.nome,
//             label: city.nome
//             }));
            
//             // Habilita e preenche o seletor de cidades
//             citySelect.disabled = false;
//             cityChoices.setChoices(cityOptions, 'value', 'label', false);
//         });
//     });
// });