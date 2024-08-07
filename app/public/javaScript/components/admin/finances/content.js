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
  
      // Функция для отрисовки строк
      const contentRows = (data) => {
        contentContainer.innerHTML = ''; // Очистка контейнера перед добавлением новых элементов
        data.forEach(order => {
          const array = [
            ['Номер заказа', order.id],
            ['Пользователь', order.user],
            ['Сумма', order.value],
            ['Метод', order.method],
            ['Ревизиты', order.requisites],
            ['Статус', order.status === 'inwork' ? 'В работе' : order.status === 'canceled' ? 'Отменен' : 'Выполнен'],
            ['Дата заказа', order.dateOrder],
          ];
  
          const contentRow = document.createElement('div');
          contentRow.classList.add('order-content-row');
          contentRow.dataset.id = order.id;
  
          // Присвоение цвета фона в зависимости от статуса
          const statusColors = {
            'canceled': 'rgba(247, 10, 10, 0.4)', // Цвет для статуса 'canceled'
            'done': 'rgba(20, 252, 0, 0.4)', // Цвет для статуса 'done'
            'inwork': 'rgba(255, 165, 0, 0.4)', // Цвет для статуса 'inwork', заменен на более подходящий
            'default': 'transparent' // По умолчанию
          };
          contentRow.style.background = statusColors[order.status] || statusColors['default'];
  
          // Добавление данных в строки
          array.forEach(([label, value]) => {
            const contentCell = document.createElement('div');
            contentCell.classList.add('order-content-cell');
  
            const contentCellDiv1 = document.createElement('div');
            const contentCellDiv2 = document.createElement('div');
  
            contentCellDiv1.textContent = label;
            contentCellDiv1.style.color = '#B0B0B0';
            contentCellDiv2.textContent = value;
  
            contentCell.append(contentCellDiv1, contentCellDiv2);
            contentRow.appendChild(contentCell);
          });
  
          // Добавление обработчика клика
          contentRow.addEventListener('click', () => {
            const dataElement = this.data.find(el => el.id == contentRow.dataset.id);
            const modal = new Modal(dataElement);
            const createModal = modal.render('Статус', 'change-status-order-payment');
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
  
      // Определение номера страниц и текущей страницы
      const itemsPerPage = 10;
      const sortedData = [...this.data].reverse(); // Создание копии и реверс массива данных
      const numberPage = Math.ceil(sortedData.length / itemsPerPage);
      const currentPage = parseInt(localStorage.getItem('seller-order-page')) || 1;
  
      // Отображение данных для текущей страницы
      const data0Page = paginate(sortedData, currentPage, itemsPerPage);
      contentRows(data0Page);
  
      // Создание пагинации
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
      console.error('Error in render:', error.message);
      return error.message;
    }
  }
}