import {Modal} from './elements/modal.js';
export class ContentFinance {
  constructor(data) {
    this.data = data;
  }
  render() {
    try {
      const contentContainer = document.createElement('div');
      contentContainer.classList.add('finance-content-container');
      const paginationContainer = document.createElement('div');
      paginationContainer.classList.add('pagination-container');
  
      const contentRows = (data) => {
        contentContainer.innerHTML = ''; // Очистка контейнера перед добавлением новых элементов
  
        if (data.length < 1 || !data) {
          const div = document.createElement('div');
          div.style.textAlign = 'center';
          div.textContent = 'История заявок пуста';
          contentContainer.append(div);
          return;
        }
  
        data.forEach(order => {
          const array = [
            ['Номер заказа', order.id],
            ['Сумма', order.value],
            ['Метод', order.method],
            ['Ревизиты', order.requisites],
            ['Статус', order.status === 'inwork' ? 'В работе' : order.status === 'canceled' ? 'Отменен' : 'Выполнен'],
            ['Дата заказа', order.dateOrder],
          ];
  
          const contentRow = document.createElement('div');
          contentRow.classList.add('order-content-row');
          contentRow.dataset.id = order.id;
  
          if (order.status === 'canceled') {
            contentRow.style.background = 'rgba(247, 10, 10, 0.4)';
          }
          if (order.status === 'done') {
            contentRow.style.background = 'rgba(20, 252, 0, 0.4)';
          }
  
          array.forEach(element => {
            const contentCell = document.createElement('div');
            contentCell.classList.add('order-content-cell');
  
            const contentCellDiv1 = document.createElement('div');
            const contentCellDiv2 = document.createElement('div');
  
            contentCellDiv1.textContent = element[0];
            contentCellDiv1.style.color = '#B0B0B0';
            contentCellDiv2.textContent = element[1];
  
            contentCell.append(contentCellDiv1, contentCellDiv2);
            contentRow.appendChild(contentCell);
          });
  
          contentRow.addEventListener('click', (event) => {
            const dataElement = this.data.find(el => el.id == contentRow.dataset.id);
            const modal = new Modal(dataElement);
            const createModal = modal.renderOrderModal();
            contentContainer.appendChild(createModal);
          });
  
          contentContainer.append(contentRow);
        });
      };
  
      const paginate = (array, pageNumber, itemsPerPage) => {
        const totalItems = array.length;
        const startIndex = totalItems - (pageNumber * itemsPerPage);
        const endIndex = startIndex + itemsPerPage;
        const paginatedItems = array.slice(Math.max(startIndex, 0), endIndex).reverse();
        return paginatedItems;
      };
  
      const updatePagination = (currentPage, numberPage) => {
        paginationContainer.innerHTML = ''; // Очистка предыдущих элементов пагинации
  
        const containerPageContainer = document.createElement('div');
        containerPageContainer.classList.add('pagination-page-container');
  
        const containerPage = document.createElement('input');
        containerPage.classList.add('pagination-page');
        containerPage.type = 'number';
        containerPage.min = 1;
        containerPage.max = numberPage;
        containerPage.value = currentPage;
  
        const containerPageSpan = document.createElement('span');
        containerPageSpan.textContent = ` из ${numberPage}`;
  
        containerPageContainer.append(containerPage, containerPageSpan);
        paginationContainer.appendChild(containerPageContainer);
        contentContainer.appendChild(paginationContainer);
  
        containerPage.addEventListener('change', (event) => {
          const newPage = parseInt(event.target.value, 10);
          if (newPage >= 1 && newPage <= numberPage) {
            localStorage.setItem('seller-order-page', newPage);
  
            const data0Page = paginate(this.data, newPage, 10);
            contentRows(data0Page);
            updatePagination(newPage, numberPage); // Обновление пагинации
          }
        });
      };
  
      const numberPage = Math.ceil(this.data.length / 10);
      const currentPage = parseInt(localStorage.getItem('seller-order-page') || '1', 10);
  
      const data0Page = paginate(this.data, currentPage, 10);
      contentRows(data0Page);
      updatePagination(currentPage, numberPage);
  
      return contentContainer;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }
}