import { Modal } from './modal.js'
export class Filter {
  constructor(button, dataChapters) {
    this.button = button;
    this.data = dataChapters;
  }
  eventButtonCreateOrder(buttonCreate) {
    buttonCreate.addEventListener('click', async(event) => {
      const body = document.querySelector('body');
      const overlay = document.querySelector('.modal-overlay');
      overlay.style.display = 'block';

      const modal = new Modal(this.data);
      const createModal = modal.renderFilterModal();
      body.appendChild(createModal)
    })
  }
  renderGold() {
    const containerFilter = document.createElement('section');
    containerFilter.classList.add('product-filter-container');
    const buttonCreate = document.createElement('button');
    buttonCreate.id = 'product-button_create-gold';
    buttonCreate.classList.add('product-button_create-gold');
    buttonCreate.textContent = this.button;
    this.eventButtonCreateOrder(buttonCreate);

    console.log(this.data)
    const salectGame = document.createElement('select');
    salectGame.classList.add('product-filter-container-select-game');
    const gameNames = [...new Set(this.data.map(item => item.name))];
    gameNames.forEach(name => {
      const option = document.createElement('option');
      if(salectGame.length < 1) {
        const emptyOption = document.createElement('option');
        emptyOption.value = 'Выбрать игру';
        emptyOption.textContent = 'Выбрать игру';
        salectGame.appendChild(emptyOption);
      } 
      option.value = name;
      option.textContent = name;
      salectGame.appendChild(option);
    })
    containerFilter.append(buttonCreate, salectGame)
    return containerFilter;
  }
}