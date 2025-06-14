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
	const totalResults = document.getElementById('total-results');

	const productCards = document.querySelectorAll('.product-card');
	const estadosInput = document.querySelectorAll('.filtro-estado');
	const localizacaoInput = document.getElementById('filtro-localizacao');
	const precoMinInput = document.getElementById('preco-min');
	const precoMaxInput = document.getElementById('preco-max');
	const anoMinInput = document.getElementById('ano-min');
	const anoMaxInput = document.getElementById('ano-max');
	const filtroMarcas = document.querySelectorAll('.filtro-marca');

	//Mostrar quantidade de resultados sem filtro
	if(productCards.length == 0){
		totalResults.innerHTML = `Nenhum resultado encontrado`;
	} else if (productCards.length == 1){
		totalResults.innerHTML = `${productCards.length} resultado`;
	} else{
		totalResults.innerHTML = `${productCards.length} resultados`;
	}

	function aplicarFiltros() {
		let totalViewCards = 0;

		// Obter valores
		const estadosSelecionados = Array.from(estadosInput)
			.filter(checkbox => checkbox.checked)
			.map(checkbox => checkbox.value);
		console.log(estadosSelecionados)
		const localizacaoSelecionada = localizacaoInput.value;
		const precoMin = parseFloat(precoMinInput.value) || 0;
		const precoMax = parseFloat(precoMaxInput.value) || Infinity;
		const anoMin = parseInt(anoMinInput.value) || 0;
		const anoMax = parseInt(anoMaxInput.value) || Infinity;
		const marcasSelecionadas = Array.from(filtroMarcas)
			.filter(checkbox => checkbox.checked)
			.map(checkbox => checkbox.value);

		// Percorrer cada card
		productCards.forEach(card => {
			const cardEstado = card.dataset.estado;
			const cardLocalizacao = card.dataset.localizacao;
			const cardPreco = parseFloat(card.dataset.preco);
			const cardAno = parseInt(card.dataset.ano);
			const cardMarca = card.dataset.marca;
			
			let letDisplay = true;

			// Aplicar as regras de filtro
			// Regra de estado: se houver estado selecionado, o card deve pertencer à ele
			if (estadosSelecionados.length > 0 && !estadosSelecionados.includes(cardEstado)) {
				letDisplay = false;
			}

			// Regra de Localização: se tiver localização não for "Todos", o card deve pertencer a essa localização
			if(localizacaoSelecionada != 'Todos' && (cardLocalizacao != localizacaoSelecionada)){
				letDisplay = false;
			}

			// Regra de Preço
			if (cardPreco < precoMin || cardPreco > precoMax) {
				letDisplay = false;
			}

			// Regra de Ano
			if (cardAno < anoMin || cardAno > anoMax) {
				letDisplay = false;
			}

			// Regra da Marca: se houver marcas selecionadas, o card deve pertencer a uma delas
			if (marcasSelecionadas.length > 0 && !marcasSelecionadas.includes(cardMarca)) {
				letDisplay = false;
			}


			// Mostrar ou esconder o card
			const hrElement = card.nextElementSibling;
			if (letDisplay) {
				totalViewCards++;
				card.style.display = 'flex';
				if (hrElement && hrElement.tagName === 'HR') {
					hrElement.style.display = 'block';
				}
			} else {
				card.style.display = 'none';
				if (hrElement && hrElement.tagName === 'HR') {
					hrElement.style.display = 'none';
				}
			}
		});

		//Mostrar quantidade de resultados após filtro
		if(totalViewCards == 0){
			totalResults.innerHTML = `Nenhum resultado encontrado`;
		} else if (totalViewCards == 1){
			totalResults.innerHTML = `${totalViewCards} resultado`;
		} else{
			totalResults.innerHTML = `${totalViewCards} resultados`;
		}
	}

	document.querySelectorAll('.filter-sidebar select').forEach(Selection => {
		Selection.addEventListener('change', aplicarFiltros);
	});

	document.querySelectorAll('.filter-sidebar input').forEach(input => {
		input.addEventListener('change', aplicarFiltros);
		input.addEventListener('keyup', aplicarFiltros);
	});
});