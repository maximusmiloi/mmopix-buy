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
    containerFilter.append(buttonCreate)
    return containerFilter;
  }
}