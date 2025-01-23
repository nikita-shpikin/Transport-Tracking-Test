const cargoList = [
	{
		id: Math.floor(100000 + Math.random() * 900000),
		name: 'Строительные материалы',
		status: 'В пути',
		origin: 'Москва',
		destination: 'Казань',
		departureDate: '2024-11-24',
	},
	{
		id: Math.floor(100000 + Math.random() * 900000),
		name: 'Хрупкий груз',
		status: 'Ожидает отправки',
		origin: 'Санкт-Петербург',
		destination: 'Екатеринбург',
		departureDate: '2024-11-26',
	},
]
const addForm = document.querySelector('.btn-add')
const table = document.querySelector('table tbody')
const modal = document.querySelector('.modal')
const statusFilter = document.querySelector('#statusFilter')

// Выводим таблицу
function renderTable() {
	table.innerHTML = ''
	cargoList.forEach(obj => {
		const row = createTableRow(obj)
		table.appendChild(row)
	})
}

//Создания строки таблицы
function createTableRow(obj) {
	const tr = document.createElement('tr')

	for (const key in obj) {
		if (obj.hasOwnProperty(key)) {
			const cell = document.createElement('td')
			cell.textContent = obj[key]
			tr.appendChild(cell)

			if (obj[key] === obj.status) {
				if (obj[key] === 'Ожидает отправки') {
					cell.classList.add('bg-warning', 'text-white') // Желтый
				} else if (obj[key] === 'В пути') {
					cell.classList.add('bg-primary', 'text-white') // Синий
				} else if (obj[key] === 'Доставлен') {
					cell.classList.add('bg-success', 'text-white') // Зеленый
				}
			}
		}
	}

	createSelectCell(tr, obj)

	return tr
}

//Создаем последнюю ячейку select
function createSelectCell(tr, obj) {
	//Создаем последнюю ячейку
	const selectCell = document.createElement('td')
	const select = document.createElement('select')
	select.className = 'form-select'
	select.id = 'statusFilter'

	//Добавляем опции
	const options = ['Ожидает отправки', 'В пути', 'Доставлен']
	options.forEach(text => {
		const option = document.createElement('option')
		option.value = text
		option.textContent = text
		select.appendChild(option)

		if (text === obj.status) {
			option.setAttribute('selected', 'selected')
		}
	})

	// Обработчик изменения значения в select
	select.addEventListener('change', event => {
		const newStatus = event.target.value // Новое значение статуса
		obj.status = newStatus // Обновляем статус в массиве объектов

		const currentDate = new Date()

		const year = currentDate.getFullYear() // Год (например, 2024)
		const month = String(currentDate.getMonth() + 1).padStart(2, '0') // Месяц (добавляем 1 и форматируем до 2 цифр)
		const day = String(currentDate.getDate()).padStart(2, '0') // День (форматируем до 2 цифр)
		const formattedDate = `${year}-${month}-${day}`

		if (obj.status === 'Доставлен' && obj.departureDate > formattedDate) {
			alert(
				'Ошибка: Дата отправки не может быть в будущем для статуса "Доставлен".'
			)
		} else {
			renderTable()
		}
	})

	selectCell.appendChild(select)
	tr.appendChild(selectCell)
}

// Фильтруем таблицу
function filterStatus(filteredList) {
	table.innerHTML = ''
	filteredList.forEach(obj => {
		const row = createTableRow(obj)
		table.appendChild(row)
	})
}

//Добавляем в таблицу новый груз
addForm.addEventListener('click', () => {
	//Получаем данные из формы
	const newId = Math.floor(100000 + Math.random() * 900000)
	const name = document.querySelector('#cargoName').value.trim()
	const origin = document.querySelector('#origin').value
	const destination = document.querySelector('#destination').value
	const departureDate = document.querySelector('#departureDate').value

	if (name === '') {
		document.querySelector('#cargoName').classList.add('is-invalid')
	} else if (departureDate === '') {
		document.querySelector('#departureDate').classList.add('is-invalid')

		document.querySelector('#cargoName').classList.remove('is-invalid')
	} else {
		document.querySelector('#departureDate').classList.remove('is-invalid')
		document.querySelector('#cargoName').classList.remove('is-invalid')

		//Добавляем новый объект в массив
		cargoList.push({
			id: newId,
			name: name,
			status: 'Ожидает отправки',
			origin: origin,
			destination: destination,
			departureDate: departureDate,
		})

		renderTable()

		// Закрываем модальное окно
		const myModal = bootstrap.Modal.getInstance(
			document.querySelector('.modal')
		)
		myModal.hide()

		// Очищаем форму
		document.querySelector('#addCargoForm').reset()
	}
})

//Сортировка по статусу
statusFilter.addEventListener('change', event => {
	const selectedStatus = event.target.value

	let filteredList

	if (selectedStatus === 'Все') {
		filteredList = cargoList
	} else {
		filteredList = cargoList.filter(obj => obj.status === selectedStatus)
	}

	filterStatus(filteredList)
})

window.onload = function () {
	renderTable(cargoList)
}
