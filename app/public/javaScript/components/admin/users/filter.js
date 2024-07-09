//import { Elements } from './elements/elements.js';
export class Filter {
  constructor(data) {
    this.data = data;
  }
  render() {
    const filterContainer = document.createElement('div');
    filterContainer.id = 'users-filter-container';
    filterContainer.classList.add('users-filter-container');
    const createElements = new Elements();

    const labelGame = createElements.renderLabel('orders-filter-game', 'Игра');
    const selectGame = createElements.renderSelect('orders-filter-game');
    filterContainer.append(labelGame, selectGame);

    
    const labelRegion = createElements.renderLabel('orders-filter-region', 'Регион');
    const selectRegion = createElements.renderSelect('orders-filter-region');
    filterContainer.append(labelRegion, selectRegion);

/* 
    function populateNameSelect(data) {
      const names = [...new Set(data.map(item => item.name))];
      clearSelect(selectGame);
      names.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        selectGame.appendChild(option);
      });
    }
    function populateRegionSelect(name, data) {
      const regions = [...new Set(data.filter(item => item.name === name).map(item => item.region))];
      clearSelect(selectRegion);
      clearSelect(spanMethod);
      regions.forEach(region => {
        const option = document.createElement('option');
        option.value = region;
        option.textContent = region;
        selectRegion.appendChild(option);
      });
    } */
    return filterContainer;
  }
}