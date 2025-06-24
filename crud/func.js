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

    new Choices(document.getElementById('formVehicleCondition'), {
        itemSelectText: '',
        searchEnabled: false,
        classNames: {
            containerInner: ['choices__inner', 'bg-dark', 'form-select'], 
            input: ['choices__input', 'text-white'],
            list: 'choices__list',
            listItems: 'choices__list--multiple',
            listSingle: 'choices__list--single',
            listDropdown: ['choices__list--dropdown', 'bg-dark'],
            item: ['choices__item', 'text-white'],
            itemChoice: 'choices__item--choice',
            itemSelectable: 'choices__item--selectable',
            labelId: 'formCitySelect',
        },
    });

    // 1. INICIALIZAR CHOICES.JS PARA O SELETOR DE ESTADOS
    const stateChoices = new Choices(stateSelect, {
        searchPlaceholderValue: 'Pesquise um estado...',
        noResultsText: 'Nenhum resultado encontrado',
        itemSelectText: '',
        placeholder: true,
        placeholderValue: 'Selecione um estado...',
        classNames: {
            containerInner: ['choices__inner', 'bg-dark', 'form-select'],
            input: ['choices__input', 'text-white'],
            listDropdown: ['choices__list--dropdown', 'bg-dark'],
            item: ['choices__item', 'text-white'],
            itemChoice: 'choices__item--choice',
            itemSelectable: 'choices__item--selectable',
        },
    });

    // 2. INICIALIZAR CHOICES.JS PARA O SELETOR DE CIDADES
    const cityChoices = new Choices(citySelect, {
        searchPlaceholderValue: 'Pesquise uma cidade...',
        noResultsText: 'Nenhum resultado encontrado',
        itemSelectText: '',
        placeholder: true,
        placeholderValue: 'Selecione uma cidade...',
        classNames: {
            containerInner: ['choices__inner', 'bg-dark', 'form-select'], 
            input: ['choices__input', 'text-white'],
            list: 'choices__list',
            listItems: 'choices__list--multiple',
            listSingle: 'choices__list--single',
            listDropdown: ['choices__list--dropdown', 'bg-dark'],
            item: ['choices__item', 'text-white'],
            itemChoice: 'choices__item--choice',
            itemSelectable: 'choices__item--selectable',
            labelId: 'formCitySelect',
        },
    });

    cityChoices.disable();
    stateChoices.disable();

    // 3. BUSCAR E POPULAR OS ESTADOS USANDO A API DO CHOICES.JS
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
        .then(res => res.json())
        .then(states => {
            const stateOptions = states.map(state => ({
                value: state.sigla,
                label: state.nome
            }));
            stateChoices.enable();
            stateChoices.setChoices(stateOptions, 'value', 'label', false);
            
            stateChoices.clearInput();
        }).catch(error => {
            console.error("Erro ao buscar estados:", error);
            stateChoices.setChoices([{ value: '', label: 'Erro ao carregar', disabled: true }], 'value', 'label', true);
        });
    
    // Função para buscar cidades
    async function fetchAndSetCities(stateAbbreviation) {
        cityChoices.clearStore();
        if (!stateAbbreviation) {
            cityChoices.disable();
            cityChoices.setChoices([{ value: '', label: 'Aguardando estado...', selected: true, disabled: true }], 'value', 'label', true);
            return;
        }
        try {
            cityChoices.enable();
            const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateAbbreviation}/municipios`);
            const cities = await response.json();
            const cityOptions = cities.map(city => ({
                value: city.nome,
                label: city.nome
            }));
            cityChoices.setChoices(cityOptions, 'value', 'label', false);
            cityChoices.clearInput();
        } catch (error) {
            console.error("Erro ao buscar cidades:", error);
            cityChoices.setChoices([{ value: '', label: 'Erro ao carregar', disabled: true }], 'value', 'label', true);
        }
    }

    // 4. OUVIR A MUDANÇA NO SELETOR DE ESTADOS
    stateSelect.addEventListener('change', (event) => {
        const selectedStateAbbr = event.detail.value;
        fetchAndSetCities(selectedStateAbbr);
    });


    // --- Lógica do CRUD ---
    // Abrir modal de ADIÇÃO
    document.getElementById('btn-add-vehicle').addEventListener('click', function () {
        vehicleForm.reset();
        document.getElementById('vehicleId').value = '';
        vehicleModalLabel.textContent = 'Adicionar Novo Veículo';

        stateChoices.clearInput();
        cityChoices.clearInput();
        cityChoices.disable();
        
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
                stateChoices.setChoiceByValue(stateAbbr);
                
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

        let isFormValid = true;

        // --- Validação do Estado ---
        // 1. A partir do <select>, sobe até o ancestral <div class="col-md-4">
        const stateContainer = stateSelect.closest('.col-md-4');
        // 2. A partir deste container, encontra o elemento .choices
        const stateElement = stateContainer ? stateContainer.querySelector('.choices') : null;
        
        const stateValue = stateChoices.getValue(true);

        if (!stateValue) {
            isFormValid = false;
            if (stateElement) {
                stateElement.classList.add('is-invalid');
            } else {
                console.error("Não foi possível encontrar o elemento .choices para o seletor de ESTADO.");
            }
        } else {
            if (stateElement) {
                stateElement.classList.remove('is-invalid');
            }
        }

        // --- Validação da Cidade  ---
        const cityContainer = citySelect.closest('.col-md-4');
        const cityElement = cityContainer ? cityContainer.querySelector('.choices') : null;

        const cityValue = cityChoices.getValue(true);

        if (!cityValue) {
            isFormValid = false;
            if (cityElement) {
                cityElement.classList.add('is-invalid');
            } else {
                console.error("Não foi possível encontrar o elemento .choices para o seletor de CIDADE.");
            }
        } else {
            if (cityElement) {
                cityElement.classList.remove('is-invalid');
            }
        }

        // Outras validações
        function validateInput(input){
            if (input.value.trim() === '') {
                isFormValid = false;
                input.classList.add('is-invalid');
            } else {
                input.classList.remove('is-invalid');
            }
        }
        
        const priceInput = document.getElementById('formVehiclePrice');
        if (priceInput.value.trim() === '' || priceInput.value.trim() === '0,00') {
            isFormValid = false;
            priceInput.classList.add('is-invalid');
        } else {
            priceInput.classList.remove('is-invalid');
        }

        validateInput(document.getElementById('formVehicleTitle'));
        validateInput(document.getElementById('formVehicleKm'));
        validateInput(document.getElementById('formVehicleYear'));
        validateInput(document.getElementById('formVehicleBrand'));
        validateInput(document.getElementById('formVehicleImage'));
        validateInput(document.getElementById('formVehicleShortDescription'));
        validateInput(document.getElementById('formVehicleLongDescription'));

        if (!isFormValid) {
            return;
        }
        
        const id = document.getElementById('vehicleId').value;
        const title = document.getElementById('formVehicleTitle').value;
        const price = `R$ ${document.getElementById('formVehiclePrice').value}`;
        const km = formatKM(document.getElementById('formVehicleKm').value);
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
                rowToUpdate.querySelector('.vehicle-year').textContent = year;
                rowToUpdate.querySelector('.vehicle-brand').textContent = brand;
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
                    <td class="vehicle-year">${year}</td>
                    <td class="vehicle-brand">${brand}</td>
                    <td class="vehicle-location">${location}</td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-primary btn-edit" title="Editar"><i class="bi bi-pencil-square"></i></button>
                        <button class="btn btn-sm btn-danger btn-delete" title="Excluir"><i class="bi bi-trash-fill"></i></button>
                    </td>
                </tr>
            `;
            vehicleTableBody.insertAdjacentHTML('beforeend', newRow);
        }

        vehicleModal.hide();
    });
});

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

document.getElementById('searchInput').addEventListener('keyup', function() {
    const searchTerm = this.value.toLowerCase();
    const tableRows = document.querySelectorAll('#vehicle-table-body tr');

    tableRows.forEach(row => {
        const rowData = row.textContent.toLowerCase();
        if (rowData.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
});

function formatKM(param) {
    const formatador = new Intl.NumberFormat('pt-BR'); 
    return formatador.format(param);
}

function removeInvalid(param) {
    param.addEventListener('change', (event) => {
        if(param.classList.contains('is-invalid')){
            param.classList.remove('is-invalid');
        }
    });
}

function removeInvalidChoices(param) {
    param.addEventListener('change', (event) => {
        const stateContainer = param.closest('.col-md-4');
        const stateElement = stateContainer ? stateContainer.querySelector('.choices') : null;
        if(stateElement.classList.contains('is-invalid')){
            stateElement.classList.remove('is-invalid');
        }
    });
}

function removeAllInvalid() {
    if(document.getElementById('formVehicleTitle').classList.contains('is-invalid')) document.getElementById('formVehicleTitle').classList.remove('is-invalid');
    if(document.getElementById('formVehiclePrice').classList.contains('is-invalid')) document.getElementById('formVehiclePrice').classList.remove('is-invalid');
    if(document.getElementById('formVehicleKm').classList.contains('is-invalid')) document.getElementById('formVehicleKm').classList.remove('is-invalid');
    var stateContainer = document.getElementById('formState').closest('.col-md-4');
    var stateElement = stateContainer ? stateContainer.querySelector('.choices') : null;
    if(stateElement.classList.contains('is-invalid')) stateElement.classList.remove('is-invalid');
    stateContainer = document.getElementById('formCity').closest('.col-md-4');
    stateElement = stateContainer ? stateContainer.querySelector('.choices') : null;
    if(stateElement.classList.contains('is-invalid')) stateElement.classList.remove('is-invalid');
    if(document.getElementById('formVehicleYear').classList.contains('is-invalid')) document.getElementById('formVehicleYear').classList.remove('is-invalid');
    if(document.getElementById('formVehicleBrand').classList.contains('is-invalid')) document.getElementById('formVehicleBrand').classList.remove('is-invalid');
    if(document.getElementById('formVehicleImage').classList.contains('is-invalid')) document.getElementById('formVehicleImage').classList.remove('is-invalid');
    if(document.getElementById('formVehicleShortDescription').classList.contains('is-invalid')) document.getElementById('formVehicleShortDescription').classList.remove('is-invalid');
    if(document.getElementById('formVehicleLongDescription').classList.contains('is-invalid')) document.getElementById('formVehicleLongDescription').classList.remove('is-invalid');
}

removeInvalid(document.getElementById('formVehicleTitle'));
removeInvalid(document.getElementById('formVehiclePrice'));
removeInvalid(document.getElementById('formVehicleKm'));
removeInvalidChoices(document.getElementById('formState'));
removeInvalidChoices(document.getElementById('formCity'));
removeInvalid(document.getElementById('formVehicleYear'));
removeInvalid(document.getElementById('formVehicleBrand'));
removeInvalid(document.getElementById('formVehicleImage'));
removeInvalid(document.getElementById('formVehicleShortDescription'));
removeInvalid(document.getElementById('formVehicleLongDescription'));