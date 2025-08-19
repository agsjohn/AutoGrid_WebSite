document.addEventListener('DOMContentLoaded', function () {
    let allStatesData = [];

    const token = document.querySelector('meta[name="_csrf"]').getAttribute('content');
    const headerName = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');

    const stateSelect = document.getElementById('formState');
    const citySelect = document.getElementById('formCity');
    const vehicleModal = new bootstrap.Modal(document.getElementById('vehicleModal'));
    const deleteConfirmModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
    const vehicleForm = document.getElementById('vehicleForm');
    const vehicleModalLabel = document.getElementById('vehicleModalLabel');
    const vehicleTableBody = document.getElementById('vehicle-table-body');
    let rowToDelete = null;

    const conditionChoices = new Choices(document.getElementById('formVehicleCondition'), {
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

    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
        .then(res => res.json())
        .then(states => {
            const stateOptions = states.map(state => ({
                value: state.sigla,
                label: state.nome
            }));

            allStatesData = stateOptions;

            stateChoices.enable();
            stateChoices.setChoices(stateOptions, 'value', 'label', false);
            
            stateChoices.clearInput();
        }).catch(error => {
            console.error("Erro ao buscar estados:", error);
            stateChoices.setChoices([{ value: '', label: 'Erro ao carregar', disabled: true }], 'value', 'label', true);
        });
    
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

    stateSelect.addEventListener('change', (event) => {
        const selectedStateAbbr = event.detail.value;
        fetchAndSetCities(selectedStateAbbr);
    });


    // CRUD
    document.getElementById('btn-add-vehicle').addEventListener('click', function () {
        vehicleForm.reset();
        document.getElementById('vehicleId').value = '';
        vehicleModalLabel.textContent = 'Adicionar Novo Veículo';

        stateChoices.clearInput();
        cityChoices.clearInput();
        cityChoices.disable();
        
        vehicleModal.show();
    });

    vehicleTableBody.addEventListener('click', async function(event) {
        const target = event.target.closest('button');
        if (!target) return;

        const row = target.closest('tr');
        const vehicleId = row.getAttribute('data-id');

        // Ação de EDITAR
        if (target.classList.contains('btn-edit')) {
            vehicleModalLabel.textContent = 'Editar Veículo';
            vehicleForm.reset();
            
            vehicleModal.show();

            try {
                const response = await fetch(`/api/${vehicleId}`);
                if (!response.ok) {
                    throw new Error('Veículo não encontrado.');
                }
                const carro = await response.json();

                document.getElementById('vehicleId').value = carro.id;
                document.getElementById('formVehicleTitle').value = carro.titulo;
                const priceInput = document.getElementById('formVehiclePrice');
                priceInput.value = (carro.preco || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
                document.getElementById('formVehicleKm').value = carro.quilometragem;
                document.getElementById('formVehicleYear').value = carro.ano;
                document.getElementById('formVehicleBrand').value = carro.marca;
                document.getElementById('formVehicleImage').value = carro.imageUrl;
                document.getElementById('formVehicleImage2').value = carro.imageUrl1 || '';
                document.getElementById('formVehicleImage3').value = carro.imageUrl2 || '';
                document.getElementById('formVehicleImage4').value = carro.imageUrl3 || '';
                document.getElementById('formVehicleShortDescription').value = carro.descricaoCurta;
                document.getElementById('formVehicleLongDescription').value = carro.descricaoLonga;

                conditionChoices.setChoiceByValue(carro.tipo || 'Usados');

                if (carro.localizacao && carro.localizacao.includes(',')) {
                    const [cityName, stateNameOrAbbr] = carro.localizacao.split(',').map(item => item.trim());
                    
                    let stateAbbr = stateNameOrAbbr;

                    // Se a string do estado tiver mais de 2 caracteres é o nome completo
                    if (stateNameOrAbbr.length > 2) {
                        const stateData = allStatesData.find(state => state.label === stateNameOrAbbr);
                        
                        if (stateData) {
                            stateAbbr = stateData.value;
                        }
                    }
                    
                    stateChoices.setChoiceByValue(stateAbbr);
                    await fetchAndSetCities(stateAbbr);
                    cityChoices.setChoiceByValue(cityName);
                }

            } catch (error) {
                console.error("Erro ao buscar dados do veículo:", error);
                alert('Não foi possível carregar os dados do veículo. Tente novamente.');
                vehicleModal.hide();
            }
        }

        if (target.classList.contains('btn-delete')) {
            rowToDelete = row;
            const vehicleName = row.querySelector('.vehicle-title').textContent;
            document.getElementById('vehicle-to-delete-name').textContent = vehicleName;
            deleteConfirmModal.show();
        }
    });

    // Confirmação de exclusão
    document.getElementById('btn-confirm-delete').addEventListener('click', async function() {
        if (!rowToDelete) return;
        const vehicleId = rowToDelete.getAttribute('data-id');

        try {
            const response = await fetch(`/api/delete/${vehicleId}`, {
                method: 'DELETE',
                headers: {
                    [headerName]: token
                }
            });

            if (response.ok) {
                rowToDelete.remove();
                console.log(`Veículo com ID ${vehicleId} excluído com sucesso.`);
            } else {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Falha ao excluir o veículo. Status: ${response.status}`);
            }
        } catch (error) {
            console.error('Erro ao excluir veículo:', error);
            alert('Não foi possível excluir o veículo. Tente novamente.');
        } finally {
            rowToDelete = null;
            deleteConfirmModal.hide();
        }
    });

    // Lógica para SALVAR (Adicionar ou Editar)
    vehicleForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        const id = document.getElementById('vehicleId').value;
        const precoValue = document.getElementById('formVehiclePrice').value.replace(/\./g, '').replace(',', '.');
        const kmValue = document.getElementById('formVehicleKm').value.replace(/\./g, '');

        const carroData = {
            titulo: document.getElementById('formVehicleTitle').value,
            preco: parseFloat(precoValue),
            quilometragem: parseInt(kmValue, 10),
            ano: parseInt(document.getElementById('formVehicleYear').value, 10),
            marca: document.getElementById('formVehicleBrand').value,
            localizacao: `${cityChoices.getValue(true)}, ${stateChoices.getValue(true)}`,
            tipo: document.getElementById('formVehicleCondition').value,
            imageUrl: document.getElementById('formVehicleImage').value,
            imageUrl1: document.getElementById('formVehicleImage2').value || null,
            imageUrl2: document.getElementById('formVehicleImage3').value || null,
            imageUrl3: document.getElementById('formVehicleImage4').value || null,
            descricaoCurta: document.getElementById('formVehicleShortDescription').value,
            descricaoLonga: document.getElementById('formVehicleLongDescription').value,
        };

        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/update/${id}` : '/api/create';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    [headerName]: token
                },
                body: JSON.stringify(carroData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Falha ao salvar. Status: ${response.status}`);
            }

            const savedCarro = await response.json();

            upsertTableRow(savedCarro);

            vehicleModal.hide();

        } catch (error) {
            console.error('Erro ao salvar:', error);
            alert('Ocorreu um erro ao salvar: ' + error.message);
        }
    });

    function validateForm() {
        let isValid = true;
        const inputsToValidate = [
            'formVehicleTitle', 'formVehiclePrice', 'formVehicleKm', 'formVehicleYear', 
            'formVehicleBrand', 'formVehicleImage', 'formVehicleShortDescription', 
            'formVehicleLongDescription'
        ];

        inputsToValidate.forEach(id => {
            const input = document.getElementById(id);
            if (!input.value.trim() || (input.id === 'formVehiclePrice' && input.value.trim() === '0,00')) {
                input.classList.add('is-invalid');
                isValid = false;
            } else {
                input.classList.remove('is-invalid');
            }
        });

        [stateChoices, cityChoices, conditionChoices].forEach(choiceInstance => {
            const choicesElement = choiceInstance.containerOuter.element;

            if (!choiceInstance.getValue(true)) {
                if (choicesElement) {
                    choicesElement.classList.add('is-invalid');
                }
                isValid = false;
            } else {
                if (choicesElement) {
                    choicesElement.classList.remove('is-invalid');
                }
            }
        });

        return isValid;
    }


    function upsertTableRow(carro) {
        const precoFormatado = (carro.preco || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        const kmFormatado = (carro.quilometragem || 0).toLocaleString('pt-BR');

        let row = vehicleTableBody.querySelector(`tr[data-id="${carro.id}"]`);

        if (row) {
            row.querySelector('.table-img-thumbnail').src = carro.imageUrl;
            row.querySelector('.table-img-thumbnail').alt = carro.titulo;
            row.querySelector('.vehicle-title').textContent = carro.titulo;
            row.querySelector('.vehicle-price').textContent = precoFormatado;
            row.querySelector('.vehicle-km').textContent = kmFormatado;
            row.querySelector('.vehicle-year').textContent = carro.ano;
            row.querySelector('.vehicle-brand').textContent = carro.marca;
            row.querySelector('.vehicle-location').textContent = carro.localizacao;
        } else {
            const newRowHTML = `
                <tr data-id="${carro.id}">
                    <td><img src="${carro.imageUrl}" alt="${carro.titulo}" class="table-img-thumbnail"></td>
                    <td class="vehicle-title">${carro.titulo}</td>
                    <td class="vehicle-price">${precoFormatado}</td>
                    <td class="vehicle-km">${kmFormatado}</td>
                    <td class="vehicle-year">${carro.ano}</td>
                    <td class="vehicle-brand">${carro.marca}</td>
                    <td class="vehicle-location">${carro.localizacao}</td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-primary btn-edit" title="Editar"><i class="bi bi-pencil-square"></i></button>
                        <button class="btn btn-sm btn-danger btn-delete" title="Excluir"><i class="bi bi-trash-fill"></i></button>
                    </td>
                </tr>`;
            vehicleTableBody.insertAdjacentHTML('beforeend', newRowHTML);
        }
    }
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