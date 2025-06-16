document.addEventListener('DOMContentLoaded', function () {

    const vehicleModal = new bootstrap.Modal(document.getElementById('vehicleModal'));
    const deleteConfirmModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
    
    const vehicleForm = document.getElementById('vehicleForm');
    const vehicleModalLabel = document.getElementById('vehicleModalLabel');
    const vehicleTableBody = document.getElementById('vehicle-table-body');
    let rowToDelete = null;

    // Função para abrir modal de ADIÇÃO
    document.getElementById('btn-add-vehicle').addEventListener('click', function () {
        vehicleForm.reset();
        document.getElementById('vehicleId').value = '';
        vehicleModalLabel.textContent = 'Adicionar Novo Veículo';
        vehicleModal.show();
    });

    // Delegação de evento para botões de EDITAR e EXCLUIR
    vehicleTableBody.addEventListener('click', function(event) {
        const target = event.target.closest('button');
        if (!target) return;

        const row = target.closest('tr');
        const vehicleId = row.getAttribute('data-id');
        
        // Ação de EDITAR
        if (target.classList.contains('btn-edit')) {
            vehicleModalLabel.textContent = 'Editar Veículo';

            // Pega os dados da linha da tabela para preencher o formulário
            const title = row.querySelector('.vehicle-title').textContent;
            const price = row.querySelector('.vehicle-price').textContent;
            const km = row.querySelector('.vehicle-km').textContent;
            const location = row.querySelector('.vehicle-location').textContent;
            const imageSrc = row.querySelector('.table-img-thumbnail').src;

            // Preenche o formulário no modal
            document.getElementById('vehicleId').value = vehicleId;
            document.getElementById('formVehicleTitle').value = title;
            document.getElementById('formVehiclePrice').value = price;
            document.getElementById('formVehicleKm').value = km;
            document.getElementById('formVehicleLocation').value = location;
            document.getElementById('formVehicleImage').value = imageSrc;
            // (Em um app real, você buscaria a descrição e condição do DB)
            document.getElementById('formVehicleDescription').value = `Descrição para ${title}.`;
            
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
            rowToDelete.remove(); // Remove a linha da tabela
            rowToDelete = null;
        }
        deleteConfirmModal.hide();
        // Aqui você faria a chamada AJAX para deletar no servidor
    });


    // Lógica para SALVAR (Adicionar ou Editar)
    vehicleForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const id = document.getElementById('vehicleId').value;
        const title = document.getElementById('formVehicleTitle').value;
        const price = document.getElementById('formVehiclePrice').value;
        const km = document.getElementById('formVehicleKm').value;
        const location = document.getElementById('formVehicleLocation').value;
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
        // Aqui você faria a chamada AJAX para salvar no servidor
    });
    
    // Header sidebar functions
    window.showSidebar = function() {
        const sidebar = document.querySelector('.sidebar');
        sidebar.style.display = 'flex';
    }
    
    window.hideSidebar = function() {
        const sidebar = document.querySelector('.sidebar');
        sidebar.style.display = 'none';
    }

});