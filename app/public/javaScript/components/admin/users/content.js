import { Modal } from './elements/modal.js';
export class Content {
  constructor(data) {
    this.data = data;
  }
  render() {
    try {
      const contentContainer = document.createElement('div');
      contentContainer.classList.add('user-content-container');
      const paginationContainer = document.createElement('div');
      paginationContainer.classList.add('pagination-container');
  
      // Функция для отрисовки строк
      const contentRows = (data) => {
        contentContainer.innerHTML = ''; // Очистка контейнера перед добавлением новых элементов
        data.forEach(user => {
          const array = [ 
            ['Nick', user.login],
            ['Discord', user.discord], 
            ['Telegram', user.telegram], 
            ['Balance', user.balance],
          ];
  
          const contentRow = document.createElement('div');
          contentRow.classList.add('user-content-row');
          contentRow.dataset.id = user.id;
  
          array.forEach(([label, value]) => {
            const contentCell = document.createElement('div');
            contentCell.classList.add('user-content-cell');
  
            const contentCellDiv1 = document.createElement('div');
            const contentCellDiv2 = document.createElement('div');
  
            contentCellDiv1.textContent = label;
            contentCellDiv1.style.color = '#B0B0B0';
            contentCellDiv2.textContent = value;
  
            contentCell.append(contentCellDiv1, contentCellDiv2);
            contentRow.appendChild(contentCell);
          });
  
          contentContainer.append(contentRow);
        });
  
        // Обработчики кликов для строк
        contentContainer.querySelectorAll('.user-content-row').forEach(row => {
          row.addEventListener('click', () => {
            const dataElement = this.data.find(el => el.id == row.dataset.id);
            const modal = new Modal(dataElement);
            const createModal = modal.renderOrderModal();
            contentContainer.appendChild(createModal);
          });
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
      const currentPage = parseInt(localStorage.getItem('user-page') || '1', 10);
  
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
          localStorage.setItem('user-page', newPage);
  
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