import { ModalElement } from './handlerModal/modalElement.js';

export class FilterOrders {
  constructor(data) {
    this.data = data;
  }

  render() {
    const gameNames = [...new Set(this.data.map(item => item.game[0]))];

    const containerFilter = document.createElement('section');
    containerFilter.classList.add('order-filter-container');

    const filterContainer = document.createElement('div');
    filterContainer.classList.add('order-filter-container-filter');
    const inputSearch = document.createElement('input');
    inputSearch.id = 'order-filter-container-search';
    inputSearch.classList.add('order-filter-container-search');
    inputSearch.placeholder = 'Номер заказа';
    const salectGame = document.createElement('select');
    salectGame.classList.add('order-filter-container-select-game');
    gameNames.forEach(name => {
      const option = document.createElement('option');
      if(salectGame.length < 1) {
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = '';
        salectGame.appendChild(emptyOption);
      } 
      option.value = name;
      option.textContent = name;
      salectGame.appendChild(option);
    })
    filterContainer.append(inputSearch, salectGame)

    const statusContainer = document.createElement('div');
    statusContainer.classList.add('order-filter-status-container');
    const salectStatus = document.createElement('select');
    salectStatus.classList.add('order-filter-status-select')
    statusContainer.append(salectStatus);
    ['new', 'inwork', 'canceled', 'check', 'done'].forEach(name => {
      if(salectStatus.length < 1) {
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = '';
        salectStatus.appendChild(emptyOption);
      }
      const option = document.createElement('option');
      option.value = name;
      option.textContent = name;
      salectStatus.appendChild(option);
    })

    containerFilter.append(filterContainer, statusContainer)
    return containerFilter;
  }
}