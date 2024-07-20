import { Modal } from './handlerModal/modal.js';
export class ContentOrders {
  constructor(data) {
    this.data = data;
  }
  render() {
    try {
      const contentContainer = document.createElement('div');
      contentContainer.classList.add('product-content-container');
      const paginationContainer = document.createElement('div');
      paginationContainer.classList.add('pagination-container');
      console.log(this.data);
      let numberPage = (this.data.length / 10) < 1 ? 0 : Math.ceil(this.data.length / 10);
      console.log(numberPage)
      

      const contentRows = async(data) => {
        console.log(data)
        for(let product of data.reverse()) {
          const array = [
            ['seller', product.login],
            ['Игра', product.name[0]], 
            ['Тип', product.type], 
            ['Регион', product.region[0]],
            ['Сервер', product.server[0]],
            ['Количество', product.available],
          ]
          console.log(product);
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
  
          contentContainer.append(contentRow);
        }
      }
      if(numberPage > 0) {
        const data0Page = this.data.reverse().slice(0, 9);
        contentRows(data0Page);
      } else {
        contentRows(this.data);
      }

      while(numberPage >= 1) {
        const containerPage = document.createElement('span');
        containerPage.classList.add('pagination-page');
        containerPage.textContent = numberPage;
        paginationContainer.appendChild(containerPage);
        numberPage = numberPage - 1;
      }
      contentContainer.appendChild(paginationContainer);
      const page = paginationContainer.querySelectorAll('.pagination-page');
      console.log(page)
      page.forEach(element => {
        element.addEventListener('click', async(event) => {
          contentContainer.innerHTML = '';
          contentContainer.appendChild(paginationContainer);
          const data0Page = this.data.reverse().slice(0, 9);
          contentRows(data0Page);
          console.log(event.target.textContent)
        })
      });

      const row = contentContainer.querySelectorAll('.product-content-row');
      console.log(row)
      row.forEach(element => {
        element.addEventListener('click', async(event) => {
          const dataElement = this.data.find(el => {
            console.log(`${el.id} - ${element.dataset.id}`)
            if(el.id == element.dataset.id) {
              return el;
            }
          });
          const modal = new Modal(dataElement);
          const createModal = modal.renderProductModal();
          contentContainer.appendChild(createModal);
        })
      })
      return contentContainer;
    } catch(error){
      console.log(error.message);
      return error.message;
    }
  }
  renderOrders() {
    try {
      const contentContainer = document.createElement('div');
      contentContainer.classList.add('order-content-container');
      const paginationContainer = document.createElement('div');
      paginationContainer.classList.add('pagination-container');

      let numberPage = (this.data.length / 10) < 1 ? 0 : Math.floor(this.data.length / 10);

      const contentRows = async(data) => {
        if(data.length < 1 || !data) {
          const div = document.createElement('div');
          div.style.textAlign = 'center';
          div.textContent = 'Нет активных заказов';
          return contentContainer.append(div);
        }
        for(let order of data.reverse()) {
          const array = [
            ['Дата создания', order.date],
            ['Номер', order.id], 
            ['Игра', order.game[0]], 
            ['Тип', order.type],
            ['Регион', order.region[0]],
            ['Сервер', order.server[0]],
            ['Количество', order.available],
            ['Статус', order.status],
            ['Цена', `${order.price} $`],
          ]

          const contentRow = document.createElement('div');
          contentRow.classList.add('order-content-row');
          contentRow.dataset.id = order.id;
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
          })
          if(order.status === 'new') {
            contentRow.style.background = 'rgba(34,158,218,0.4)';  
          }
          if(order.status === 'inwork') {
            contentRow.style.background = 'rgba(227,166,75,0.4)';  
          }
          if(order.status === 'canceled') {
            contentRow.style.background = 'rgba(252,5,5,0.4)';  
          }
          if(order.status === 'check') {
            contentRow.style.background = 'rgba(171,255,179,0.4)';  
          }
          if(order.status === 'done') {
            contentRow.style.background = 'rgba(10,254,35,0.4)';  
          }
          contentContainer.append(contentRow);
        }
      }

      const search = document.querySelector('.order-filter-container-search');
      search.addEventListener('change', async event => {
        console.log(search.value);
        let searchData = this.data.filter(el => el.id === +search.value);
        contentContainer.innerHTML = ''; 
          /* const data0Page = this.data.reverse().slice(0, 9); */
          contentRows(searchData);
          contentContainer.appendChild(paginationContainer);
          const row = contentContainer.querySelectorAll('.order-content-row');

          row.forEach(element => {
            element.addEventListener('click', async(event) => {
              const dataElement = this.data.find(el => el.id == element.dataset.id);
    
              const modal = new Modal(dataElement);
              const createModal = modal.renderOrderModal();
              contentContainer.appendChild(createModal);
            })
          })
      })
      const selectGame = document.querySelector('.order-filter-container-select-game');
      selectGame.addEventListener('change', async event => {
        let selectData = this.data.filter(el => el.game[0] === selectGame.value);
        contentContainer.innerHTML = ''; 
        /* const data0Page = this.data.reverse().slice(0, 9); */
        contentRows(selectData);
        contentContainer.appendChild(paginationContainer);
        const row = contentContainer.querySelectorAll('.order-content-row');

        row.forEach(element => {
          element.addEventListener('click', async(event) => {
            const dataElement = this.data.find(el => el.id == element.dataset.id);
  
            const modal = new Modal(dataElement);
            const createModal = modal.renderOrderModal();
            contentContainer.appendChild(createModal);
          })
        })
      })

      const selectStatus = document.querySelector('.order-filter-status-select');
      selectStatus.addEventListener('change', async event => {
        let selectData = this.data.filter(el => el.status === selectStatus.value);
        contentContainer.innerHTML = ''; 
        /* const data0Page = this.data.reverse().slice(0, 9); */
        contentRows(selectData);
        contentContainer.appendChild(paginationContainer);
        const row = contentContainer.querySelectorAll('.order-content-row');

        row.forEach(element => {
          element.addEventListener('click', async(event) => {
            const dataElement = this.data.find(el => el.id == element.dataset.id);
  
            const modal = new Modal(dataElement);
            const createModal = modal.renderOrderModal();
            contentContainer.appendChild(createModal);
          })
        })
      })
      //pagination
      if(numberPage > 0) {
        console.log(numberPage)
        console.log(this.data.reverse())
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
          const row = contentContainer.querySelectorAll('.order-content-row');

          row.forEach(element => {
            element.addEventListener('click', async(event) => {
              const dataElement = this.data.find(el => el.id == element.dataset.id);
    
              const modal = new Modal(dataElement);
              const createModal = modal.renderOrderModal();
              contentContainer.appendChild(createModal);
            })
          })
        })
      });
      //pagination

      const row = contentContainer.querySelectorAll('.order-content-row');

      row.forEach(element => {
        element.addEventListener('click', async(event) => {
          const dataElement = this.data.find(el => el.id == element.dataset.id);

          const modal = new Modal(dataElement);
          const createModal = modal.renderOrderModal();
          contentContainer.appendChild(createModal);
        })
      })
      return contentContainer;
    } catch(error){
      console.log(error.message);
      return error.message;
    }
  }
}