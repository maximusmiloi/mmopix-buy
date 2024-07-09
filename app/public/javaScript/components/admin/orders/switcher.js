export class Switcher {
  constructor() {
    
  }
  createRadioContainer(id, value, labelText, checked) {
    const container = document.createElement('div');
    container.classList.add('orders-header-radio');

    const radio = document.createElement('input');
    [radio.id, radio.type, radio.name, radio.value] = [id, 'radio', 'select-header', value];
    radio.checked = checked;
    const label = document.createElement('label');
    label.htmlFor = id;
    label.textContent = labelText;

    container.appendChild(radio);
    container.appendChild(label);

    return container;
  }

  render() {
/*     const orderHeader = document.getElementById('content-orders_header');
    orderHeader.innerHTML = '';
 */
    const filterContainer = document.createElement('div');
    const containerGames = this.createRadioContainer('select-header-orders-1', 'orders', 'Все заказы', true);
    const containerChapters = this.createRadioContainer('select-header-orders-2', 'products', 'Все товары');
    filterContainer.appendChild(containerGames);
    filterContainer.appendChild(containerChapters);

    return filterContainer;
  }
}