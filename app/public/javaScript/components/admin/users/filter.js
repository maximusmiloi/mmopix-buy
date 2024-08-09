import { Elements } from './elements/elements.js';
export class Filter {
  constructor(data) {
    this.data = data;
  }
  render() {
    const filterContainer = document.createElement('div');
    filterContainer.id = 'users-filter-container';
    filterContainer.classList.add('users-filter-container');
    const createElements = new Elements();

    const labelLogin = createElements.renderLabel('user-filter-login', 'Логин пользователя: ');
    const inputLogin= createElements.renderInput('user-filter-login');
    filterContainer.append(labelLogin, inputLogin);

    
    const labelSortBalance = createElements.renderLabel('user-filter-sort-balance', 'Сортировка по балансу: ');
    const buttonSortBalance = createElements.renderButton('user-filter-sort-balance', 'Сортировать: ');
    filterContainer.append(labelSortBalance, buttonSortBalance);

    const labelBalance = createElements.renderLabel('user-filter-balance', 'Общий баланс: ');
    const spanBalance = createElements.renderSpan('user-filter-balance');

    let allBalance = 0;
    this.data.forEach(el => {
      allBalance = allBalance + el.balance;
    })
    spanBalance.textContent = `${allBalance} $`;
    filterContainer.append(labelBalance, spanBalance);
    return filterContainer;
    /* userContainer.append(labelGame, selectGame); */
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
  }
}