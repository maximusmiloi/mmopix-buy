import {Modal} from './modal.js'
export class Content {
  constructor(data, chapters) {
    this.data = data;
    this.chapters = chapters;
  }
  render() {
    try {
      const contentContainer = document.createElement('div');
      contentContainer.classList.add('product-content-container');
      const paginationContainer = document.createElement('div');
      paginationContainer.classList.add('pagination-container');

      const contentRows = async(data) => {
        console.log(data)
        if(data.length < 1 || !data) {
          const div = document.createElement('div');
          div.style.textAlign = 'center';
          div.textContent = 'Нажмите "Добавить товар", чтобы выставить товар на продажу';
          return contentContainer.append(div);
        }
        for(let product of data.reverse()) {
          const productState = document.createElement('input');
          productState.id = 'enable-disable-chapter';
          productState.classList.add('enable-disable-chapter');
          productState.type = 'checkbox';
          productState.checked = product.state;
          productState.style.width = '50px';
          productState.style.height = '20px';
          
          let chapter;
          chapter = this.chapters.filter(ch => {
            if(ch.name ===  product.name[0] && ch.region === product.region[0]) {
              if(ch.options && ch.options.length > 0) {
                return ch/* .options.filter(option => {option[0] === product.server[0]}) */
              }
            }
          })
          let optionPrice;
          let price;
          if(chapter[0] && chapter[0].options &&  chapter[0].options.length > 0) {
            optionPrice = chapter[0].options.filter(option => option[0][0] === product.server[0]);
            if(optionPrice && optionPrice.length > 0) {
              console.log(optionPrice)
              price = `${optionPrice[0][2][0]} ${optionPrice[0][2][1]}`;
            }
          }
          const array = [
            /* ['ID', product.id], */
            ['Примерный курс', price ? price : 'Не обновлён'],
            ['Игра', product.name[0]], 
            ['Тип', product.type], 
            ['Регион', product.region[0]],
            ['Сервер', product.server[0]],
            ['Количество', product.available],
          ]

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
          })
    
          const containerState = document.createElement('div');
          const containerStateDiv1 = document.createElement('div');
          containerStateDiv1.textContent = 'Вкл/Выкл';
          const containerStateDiv2 = document.createElement('div');
          containerStateDiv2.append(productState);
          containerState.append(containerStateDiv1, containerStateDiv2);
          contentRow.append(containerState);
    
          const containerButton = document.createElement('div');
          const containerButtonDiv1 = document.createElement('div');
          const buttonDelete = document.createElement('button');
          buttonDelete.textContent = 'Удалить';
          containerButtonDiv1.append(buttonDelete)
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
        }
      }

      const selectGame = document.querySelector('.product-filter-container-select-game');
      selectGame.addEventListener('change', async event => {;

        const gameData = this.data.filter(el => el.name[0] === selectGame.value);
        contentContainer.innerHTML = ''; 
        contentRows(gameData);
        contentContainer.appendChild(paginationContainer);
      })
      let numberPage = (this.data.length / 10) < 1 ? 0 : Math.ceil(this.data.length / 10);
      //pagination
      if(numberPage > 0) {
        const data0Page = this.data.slice(0, 9).reverse();
        contentRows(data0Page);
      } else {
        contentRows(this.data);
      }

      while(numberPage >= 1) {
        const containerPage = document.createElement('span');
        containerPage.classList.add('pagination-page');
        containerPage.textContent = numberPage;
        paginationContainer.insertBefore(containerPage, paginationContainer.firstChild)
        numberPage = numberPage - 1;
      }
      contentContainer.appendChild(paginationContainer);
      const page = paginationContainer.querySelectorAll('.pagination-page');

      const currentPage = localStorage.getItem('seller-order-page');

      function paginate(array, pageNumber, itemsPerPage) {
        let startIndex = ((pageNumber * 10) -10);
        if(startIndex > 0) {
          startIndex - 1;
        }
        const endIndex = pageNumber * 10;
        return array.slice(startIndex, endIndex).reverse();
      }
      page.forEach(element => {
        if(+element.textContent === +currentPage) {
          element.style.color = '#FF7A00';
        }
        element.addEventListener('click', async(event) => {
          page.forEach(p => {
            p.style.color = 'white';
          });
          localStorage.setItem('seller-order-page', event.target.textContent);
          console.log(event.target.innerHTML)
          event.target.style.color = '#FF7A00';
          contentContainer.innerHTML = ''; 
          /* const data0Page = this.data.reverse().slice(0, 9); */
          const data0Page = paginate(this.data, event.target.innerHTML, this.data.length);
          contentRows(data0Page);
          contentContainer.appendChild(paginationContainer);
        })
      });
      //pagination
      return contentContainer;
    } catch(error){

      return error.message;
    }
  }
  deleteRow(button, contentContainer) {
    button.addEventListener('click', async(event) => {
      console.log(event.target)
      const overlay = document.createElement('div');
      overlay.classList.add('.modal-overlay')
      overlay.style.display = 'flex';
      const rowElement = event.target.parentElement.parentElement.parentElement;
      console.log(rowElement)
      const createModal = new Modal();
      const modal = createModal.renderNotificationModal('Вы действительно хотите удалить данный товар?', 'modal-button-delete-row');
      contentContainer.append(modal)
      const buttonDelete = document.getElementById('modal-button-delete-row');
      buttonDelete.addEventListener('click', async event => {

      const id = rowElement.dataset.id;
      console.log(id)
      const requestDeleteRow = await fetch(`/seller/deleteuserproduct?id=${id}`);
      const responseDeleteRow = await requestDeleteRow.json();
      console.log(responseDeleteRow)
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
      const escapingBallG = document.getElementById('escapingBallG');
      escapingBallG.style.display = 'flex';
      const rowElement = event.target.parentElement.parentElement.parentElement;
      const id = rowElement.dataset.id;

      const requestEditProduct = await fetch(`/seller/stateproduct?id=${id}&state=${button.checked}`);
      const responseEditProduct = await requestEditProduct.json();

      if(responseEditProduct.message === 'success') {
        escapingBallG.style.width = '200px';
        escapingBallG.style.color = 'green';
        escapingBallG.innerHTML = 'Сохранено';
        await new Promise(resolve => setTimeout(resolve, 3000));
        escapingBallG.style.display = 'none';
      }
    })
  }
}