import {Modal} from './modal.js'
export class Content {
  constructor(data, chapters) {
    this.data = data;
    this.chapters = chapters;
  }
  render() {
    try {
      console.log(this.data);
  
      const contentContainer = document.createElement('div');
      contentContainer.classList.add('product-content-container');
      const paginationContainer = document.createElement('div');
      paginationContainer.classList.add('pagination-container');
  
      const itemsPerPage = 10;
  
      const contentRows = (data) => {
        console.log(data);
        contentContainer.innerHTML = ''; // Очистка контейнера перед добавлением новых элементов
  
        if (data.length < 1 || !data) {
          const div = document.createElement('div');
          div.style.textAlign = 'center';
          div.textContent = 'Нажмите "Добавить товар", чтобы выставить товар на продажу';
          contentContainer.append(div);
          return;
        }
  
        let elementCount = 0;
        data.reverse().forEach(product => {
          elementCount++;
          const productState = document.createElement('input');
          const productStateLabel = document.createElement('label');
          const span1 = document.createElement('span');
          span1.classList.add('slider');
          const span2 = document.createElement('span');
          span2.classList.add('text', 'off');
          span2.textContent = 'Выкл';
          const span3 = document.createElement('span');
          span3.classList.add('text', 'on');
          span3.textContent = 'Вкл';
          productStateLabel.append(span1, span2, span3);
          productStateLabel.htmlFor = `switch-${elementCount}`;
          productState.id = `switch-${elementCount}`;
          productState.classList.add('enable-disable-chapter');
          productState.type = 'checkbox';
          productState.checked = product.state;
          productState.style.width = '70px';
          productState.style.height = '20px';
  
          let chapter = this.chapters.find(ch => 
            ch.name === product.name[0] && ch.region === product.region[0] && ch.options && ch.options.length > 0
          );
  
          let price = 'Не обновлён';
          if (chapter && chapter.options) {
            let optionPrice = chapter.options.find(option => option[0][0] === product.server[0]);
            if (optionPrice && optionPrice[2]) {
              price = `${optionPrice[2][0]} ${optionPrice[2][1]}`;
            }
          }
  
          const array = [
            ['ID', product.id],
            ['Примерный курс', price],
            ['Игра', product.name[0]], 
            ['Тип', product.type], 
            ['Регион', product.region[0]],
            ['Сервер', product.server[0]],
            ['Количество', product.available],
          ];
  
          const contentRow = document.createElement('div');
          contentRow.classList.add('product-content-row');
          contentRow.dataset.id = product.id;
  
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
  
          const containerState = document.createElement('div');
          containerState.classList.add('product-content-cell');
          const containerStateDiv2 = document.createElement('div');
          containerStateDiv2.append(productState, productStateLabel);
          containerState.append(containerStateDiv2);
          contentRow.append(containerState);
  
          const containerButton = document.createElement('div');
          containerButton.classList.add('product-content-cell');
          const containerButtonDiv1 = document.createElement('div');
          const buttonDelete = document.createElement('button');
          buttonDelete.textContent = 'Удалить';
          containerButtonDiv1.append(buttonDelete);
          const containerButtonDiv2 = document.createElement('div');
          const buttonEdit = document.createElement('button');
          buttonEdit.textContent = 'Редактировать';
          containerButtonDiv2.append(buttonEdit);
          containerButton.append(containerButtonDiv1, containerButtonDiv2);
          contentRow.append(containerButton);
  
          this.deleteRow(buttonDelete, contentContainer);
          this.editRow(buttonEdit, contentContainer);
          this.stateRow(productState, contentContainer);
  
          contentContainer.append(contentRow);
        });
      };
  
      const paginate = (array, pageNumber, itemsPerPage) => {
        const startIndex = (pageNumber - 1) * itemsPerPage;
        const endIndex = pageNumber * itemsPerPage;
        return array.slice(startIndex, endIndex);
      };
  
      const updatePagination = (currentPage, numberPage) => {
        paginationContainer.innerHTML = ''; // Очистка предыдущих элементов пагинации
  
        const containerPageContainer = document.createElement('div');
        containerPageContainer.classList.add('pagination-page-container');
  
        const containerPage = document.createElement('input');
        containerPage.classList.add('pagination-page');
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
  
            const data0Page = paginate(this.data, newPage, itemsPerPage);
            contentRows(data0Page);
            updatePagination(newPage, numberPage); // Обновление пагинации
          }
        });
      };
  
      const numberPage = Math.ceil(this.data.length / itemsPerPage);
      const currentPage = parseInt(localStorage.getItem('seller-order-page') || '1', 10);
  
      const data0Page = paginate(this.data, currentPage, itemsPerPage);
      contentRows(data0Page);
      updatePagination(currentPage, numberPage);
  
      // Обработчик изменения фильтра
      const selectGame = document.querySelector('.product-filter-container-select-game');
      selectGame.addEventListener('change', async event => {
        const gameData = this.data.filter(el => el.name[0] === selectGame.value);
        contentContainer.innerHTML = ''; 
        contentRows(gameData);
        updatePagination(1, Math.ceil(gameData.length / itemsPerPage)); // Сброс на первую страницу после фильтрации
      });
  
      return contentContainer;
    } catch (error) {
      console.error('Error in render:', error.message);
      return error.message;
    }
  }
  deleteRow(button, contentContainer) {
    button.addEventListener('click', async(event) => {

      const overlay = document.createElement('div');
      overlay.classList.add('.modal-overlay')
      overlay.style.display = 'flex';
      const rowElement = event.target.parentElement.parentElement.parentElement;

      const createModal = new Modal();
      const modal = createModal.renderNotificationModal('Вы действительно хотите удалить данный товар?', 'modal-button-delete-row');
      contentContainer.append(modal)
      const buttonDelete = document.getElementById('modal-button-delete-row');
      buttonDelete.addEventListener('click', async event => {

      const id = rowElement.dataset.id;

      const requestDeleteRow = await fetch(`/seller/deleteuserproduct?id=${id}`);
      const responseDeleteRow = await requestDeleteRow.json();

      if (responseDeleteRow.message === 'success') {
        rowElement.remove();
        modal.remove();
        overlay.remove();
      }
      })
    })
  }
  editRow(button, contentContainer) {
    button.addEventListener('click', async(event) => {

      const overlay = document.querySelector('.modal-overlay');
      overlay.style.display = 'flex';
      const rowElement = event.target.parentElement.parentElement.parentElement;
      const id = rowElement.dataset.id;

      const reqInfoProduct = await fetch(`/seller/getorderone?id=${id}`);
      const resInfoProduct = await reqInfoProduct.json();
      if(resInfoProduct) {
        const createModal = new Modal();
        const modal = createModal.renderEditProduct(resInfoProduct, 'modal-button-edit-row');
        contentContainer.append(modal);
        const buttonEditSave = document.getElementById('modal-button-edit-row');
        buttonEditSave.addEventListener('click', async event => {
          const escapingBallG = document.getElementById('escapingBallG');
          escapingBallG.style.display = 'flex';
          const availableElement = document.getElementById('modal-available');
          const available = availableElement.value;
          const dataEdit = resInfoProduct;
          
          const optionsEdit = {
            method: 'POST',
            body: JSON.stringify({dataEdit,available}),
            headers: {
              'Content-Type': 'application/json',
            }
          }
          const requestEditProduct = await fetch('/seller/edituserproduct', optionsEdit);
          const responseEditProduct = await requestEditProduct.json();
          if(responseEditProduct.message === 'success') {
            escapingBallG.style.width = '200px';
            escapingBallG.innerHTML = 'Данные обновлены';
          }
        })
      } else {
        
      }
    })
  }
  stateRow(button, contentContainer) {
    button.addEventListener('click', async(event) => {
      /* const escapingBallG = document.getElementById('escapingBallG'); */
      /* escapingBallG.style.display = 'flex'; */
      const rowElement = event.target.parentElement.parentElement.parentElement;
      const id = rowElement.dataset.id;

      const requestEditProduct = await fetch(`/seller/stateproduct?id=${id}&state=${button.checked}`);
      const responseEditProduct = await requestEditProduct.json();

      if(responseEditProduct.message === 'success') {
/*         escapingBallG.style.width = '200px';
        escapingBallG.style.color = 'green'; */
        /* escapingBallG.innerHTML = 'Сохранено'; */
        await new Promise(resolve => setTimeout(resolve, 300));
        /* escapingBallG.style.display = 'none'; */
      }
    })
  }
}