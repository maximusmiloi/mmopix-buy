export class SwitcherOrders {
  constructor() {

  }
  createRadioContainer(id, value, labelText, name, checked) {
    const container = document.createElement('div');
    container.classList.add('orders-header-radio');

    const radio = document.createElement('input');
    [radio.id, radio.type, radio.name, radio.value] = [id, 'radio', name, value];
    radio.checked = checked;
    const label = document.createElement('label');
    label.htmlFor = id;
    label.textContent = labelText;

    container.appendChild(radio);
    container.appendChild(label);

    return container;
  }

  renderPanel1() {
/*     const orderHeader = document.getElementById('content-orders_header');
    orderHeader.innerHTML = '';
 */
    const switcherContainer = document.createElement('section');
    switcherContainer.classList.add('main-panel2');
    const filterContainer = document.createElement('div');
    filterContainer.classList.add('main-header')
    const containerGames = this.createRadioContainer('select-header-orders-seller-1', 'myOrders', 'Мои заказы', 'select-header-1', true);
    const containerChapters = this.createRadioContainer('select-header-orders-seller-2', 'newOrders', 'Новые заказы', 'select-header-1');
    filterContainer.appendChild(containerGames);
    filterContainer.appendChild(containerChapters);
    switcherContainer.appendChild(filterContainer);
    return filterContainer;
  }
  renderPanel2() {
    /*     const orderHeader = document.getElementById('content-orders_header');
        orderHeader.innerHTML = '';
     */
        const switcherContainer = document.createElement('section');
        switcherContainer.classList.add('main-panel2');
        const filterContainer = document.createElement('div');
        filterContainer.classList.add('main-header')
        const containerGames = this.createRadioContainer('select-header-orders-seller-1_panel2', 'Sell', 'Продажа', 'select-header-2', true);
        const containerChapters = this.createRadioContainer('select-header-orders-seller-2_panel2', 'Buy', 'Покупка', 'select-header-2');
        filterContainer.appendChild(containerGames);
        filterContainer.appendChild(containerChapters);
        switcherContainer.appendChild(filterContainer);
        return filterContainer;
      }
}