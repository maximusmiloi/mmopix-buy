import { Modal } from './elements/modal.js';
export class Content {
  constructor(data) {
    this.data = data;
  }
  render() {
    try {
      const contentContainer = document.createElement('div');
      contentContainer.classList.add('product-content-container');
      const paginationContainer = document.createElement('div');
      paginationContainer.classList.add('pagination-container');
  
      // Функция для создания строк с данными
      const contentRows = (data) => {
        data.forEach(product => {
          if (product.state && product.state === true) {
            const array = [
              ['id', product.id],
              ['seller', product.login],
              ['Игра', product.name[0]],
              ['Тип', product.type],
              ['Регион', product.region[0]],
              ['Сервер', product.server[0]],
              ['Количество', product.available],
            ];
            const contentRow = document.createElement('div');
            contentRow.classList.add('product-content-row');
            contentRow.dataset.id = product.id;
  
            array.forEach(element => {
              const contentCell = document.createElement('div');
              contentCell.classList.add('product-content-cell');
  
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
              const createModal = modal.renderProductModal();
              contentContainer.appendChild(createModal);
            });
  
            contentContainer.appendChild(contentRow);
          }
        });
      };
  
      // Функция для пагинации
      const paginate = (array, pageNumber, itemsPerPage) => {
        const startIndex = (pageNumber - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedArray = array.slice(startIndex, endIndex);
        return paginatedArray;
      };

      const sortedData = this.data.slice().sort((a, b) => b.id - a.id);
      const filteredData = sortedData.filter(product => product.state === true);
  
      const numberPage = Math.ceil(filteredData.length / 10);
  
      const currentPage = parseInt(localStorage.getItem('seller-order-page')) || 1;
      const data0Page = paginate(filteredData, currentPage, 10);
  
      contentRows(data0Page);
  
      const containerPageContainer = document.createElement('div');
      containerPageContainer.classList.add('pagination-page-container');
  
      const containerPage = document.createElement('input');
      containerPage.classList.add('pagination-page');
      containerPage.value = currentPage;
      containerPage.min = 1;
      containerPage.max = numberPage;
  
      const containerPageSpan = document.createElement('span');
      containerPageSpan.textContent = ` из ${numberPage}`;
      containerPageContainer.append(containerPage, containerPageSpan);
      paginationContainer.insertBefore(containerPageContainer, paginationContainer.firstChild);
  
      contentContainer.appendChild(paginationContainer);
  
      containerPage.addEventListener('change', (event) => {
        const newPage = parseInt(event.target.value, 10);
        if (newPage >= 1 && newPage <= numberPage) {
          localStorage.setItem('seller-order-page', newPage);
  
          contentContainer.innerHTML = ''; // Очистка контейнера
          const data0Page = paginate(filteredData, newPage, 10);
          console.log(`Data for new page ${newPage}:`, data0Page);
          contentRows(data0Page);
          contentContainer.appendChild(paginationContainer);
        }
      });
  
      return contentContainer;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }
  renderOrders() {
    try {
      const contentContainer = document.createElement('div');
      contentContainer.classList.add('product-content-container');
      const paginationContainer = document.createElement('div');
      paginationContainer.classList.add('pagination-container');
  
      // Функция для отрисовки строк
      const contentRows = (data) => {
        contentContainer.innerHTML = ''; // Очистка контейнера перед добавлением новых элементов
        data.forEach(order => {
          const array = [
            ['Номер заказа', order.id],
            ['seller', order.seller],
            ['Игра', order.game[0]],
            ['Тип', order.type],
            ['Регион', order.region[0]],
            ['Сервер', order.server[0]],
            ['Количество', order.available],
            ['Статус', order.status],
            ['Цена', `${order.price} $`],
          ];
  
          const contentRow = document.createElement('div');
          contentRow.classList.add('product-content-row');
          contentRow.dataset.id = order.id;
          array.forEach(([label, value]) => {
            const contentCell = document.createElement('div');
            contentCell.classList.add('product-content-cell');
  
            const contentCellDiv1 = document.createElement('div');
            const contentCellDiv2 = document.createElement('div');
  
            contentCellDiv1.textContent = label;
            contentCellDiv1.style.color = '#B0B0B0';
            contentCellDiv2.textContent = value;
  
            contentCell.append(contentCellDiv1, contentCellDiv2);
            contentRow.appendChild(contentCell);
          });
  
          // Установка цвета фона на основе статуса
          const statusColors = {
            'new': 'rgba(34,158,218,0.4)',
            'inwork': 'rgba(227,166,75,0.4)',
            'canceled': 'rgba(252,5,5,0.4)',
            'check': 'rgba(171,255,179,0.4)',
            'done': 'rgba(10,254,35,0.4)'
          };
          contentRow.style.background = statusColors[order.status] || 'transparent';
  
          contentRow.addEventListener('click', () => {
            const dataElement = this.data.find(el => el.id == contentRow.dataset.id);
            const modal = new Modal(dataElement);
            const createModal = modal.renderOrderModal();
            contentContainer.appendChild(createModal);
          });
  
          contentContainer.append(contentRow);
        });
      };
  
      // Функция для пагинации
      const paginate = (array, pageNumber, itemsPerPage) => {
        const startIndex = (pageNumber - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return array.slice(startIndex, endIndex);
      };
  
      const itemsPerPage = 10;
      const sortedData = this.data.sort((a, b) => b.id - a.id);
  
      const numberPage = Math.ceil(sortedData.length / itemsPerPage);
      const currentPage = parseInt(localStorage.getItem('seller-order-page')) || 1;
      const data0Page = paginate(sortedData, currentPage, itemsPerPage);
  
      // Отображение данных для текущей страницы
      contentRows(data0Page);
  
      // Создание и отображение пагинации
      const containerPageContainer = document.createElement('div');
      containerPageContainer.classList.add('pagination-page-container');
  
      const containerPage = document.createElement('input');
      containerPage.classList.add('pagination-page');
      containerPage.value = currentPage;
      containerPage.min = 1;
      containerPage.max = numberPage;
  
      const containerPageSpan = document.createElement('span');
      containerPageSpan.textContent = ` из ${numberPage}`;
      containerPageContainer.append(containerPage, containerPageSpan);
      paginationContainer.appendChild(containerPageContainer);
  
      contentContainer.appendChild(paginationContainer);
  
      // Обработчик изменения страницы
      containerPage.addEventListener('change', (event) => {
        const newPage = parseInt(event.target.value, 10);
        if (newPage >= 1 && newPage <= numberPage) {
          localStorage.setItem('seller-order-page', newPage);
  
          const data0Page = paginate(sortedData, newPage, itemsPerPage);
          contentRows(data0Page);
          contentContainer.appendChild(paginationContainer); // Переместить пагинацию в конец контейнера
        }
      });
  
      return contentContainer;
    } catch (error) {
      console.error('Error in renderOrders:', error.message);
      return error.message;
    }
  }
}