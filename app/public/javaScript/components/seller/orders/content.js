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

      let numberPage = (this.data.length / 10) < 1 ? 0 : Math.ceil(this.data.length / 10);

      const contentRows = async(data) => {

        for(let product of data.reverse()) {
          const array = [
            ['seller', product.login],
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

      page.forEach(element => {
        element.addEventListener('click', async(event) => {
          contentContainer.innerHTML = '';
          contentContainer.appendChild(paginationContainer);
          const data0Page = this.data.reverse().slice(0, 9);
          contentRows(data0Page);

        })
      });

      const row = contentContainer.querySelectorAll('.product-content-row');

      row.forEach(element => {
        element.addEventListener('click', async(event) => {
          const dataElement = this.data.find(el => {

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
            if(element[0] === 'Статус') { 
              contentCellDiv1
            } else {
              contentCellDiv1.textContent = element[0];
              contentCellDiv1.style.color = '#B0B0B0';
            }
            if(element[0] === 'Цена') { 
              contentCellDiv2.style.color = '#FF7A00';
              contentCellDiv2.style.fontSize = '16px';
              contentCellDiv2.style.fontWeight = '900';
            }
            if(element[0] === 'Номер') { 
              contentCellDiv2.style.color = '#B0B0B0';
              contentCellDiv2.style.fontSize = '16px';
              contentCellDiv2.style.fontWeight = '900';
            }
            if(element[0] === 'Дата создания') { 
              contentCellDiv2.style.color = '#B0B0B0';
              contentCellDiv2.style.fontSize = '16px';
              contentCellDiv2.style.fontWeight = '900';
            }
            if(element[0] === 'Статус') {
              if(element[1] === 'done') {
                contentCellDiv2.style.textAlign = 'center';
                contentCellDiv2.style.width = '80%';
                contentCellDiv2.style.height = '15px';
                contentCellDiv2.style.border = '1px solid #0AFE23';
                contentCellDiv2.style.borderRadius = '5px';
                contentCellDiv2.style.background = 'rgba(10, 254, 35, 0.1)';
                contentCellDiv2.style.color = '#0AFE23';
                contentCellDiv2.style.padding = '10px 2px';
                contentCellDiv2.textContent = 'Выполнен';
              }
              if(element[1] === 'canceled') {
                contentCellDiv2.style.textAlign = 'center';
                contentCellDiv2.style.width = '80%';
                contentCellDiv2.style.height = '15px';
                contentCellDiv2.style.border = '1px solid #FC0505';
                contentCellDiv2.style.borderRadius = '5px';
                contentCellDiv2.style.background = 'rgba(88, 16, 36, 0.1)';
                contentCellDiv2.style.color = '#FC0505';
                contentCellDiv2.style.padding = '10px 2px';
                contentCellDiv2.textContent = 'Отменен';
              }
              if(element[1] === 'new') {
                contentCellDiv2.style.textAlign = 'center';
                contentCellDiv2.style.width = '80%';
                contentCellDiv2.style.height = '15px';
                contentCellDiv2.style.border = '1px solid #229ED9';
                contentCellDiv2.style.borderRadius = '5px';
                contentCellDiv2.style.background = 'rgba(27, 59, 95, 0.1)';
                contentCellDiv2.style.color = '#229ED9';
                contentCellDiv2.style.padding = '10px 2px';
                contentCellDiv2.textContent = 'Новый';
              }
              if(element[1] === 'inwork') {
                contentCellDiv2.style.textAlign = 'center';
                contentCellDiv2.style.width = '80%';
                contentCellDiv2.style.height = '15px';
                contentCellDiv2.style.border = '1px solid #E3A64B';
                contentCellDiv2.style.borderRadius = '5px';
                contentCellDiv2.style.background = 'rgba(81, 61, 56, 0.1)';
                contentCellDiv2.style.color = '#E3A64B';
                contentCellDiv2.style.padding = '10px 2px';
                contentCellDiv2.textContent = 'В работе';
              }
              if(element[1] === 'check') {
                contentCellDiv2.style.textAlign = 'center';
                contentCellDiv2.style.width = '80%';
                contentCellDiv2.style.height = '15px';
                contentCellDiv2.style.border = '1px solid #ABFFB3';
                contentCellDiv2.style.borderRadius = '5px';
                contentCellDiv2.style.background = 'rgba(65, 86, 85, 0.1)';
                contentCellDiv2.style.color = '#ABFFB3';
                contentCellDiv2.style.padding = '10px 2px';
                contentCellDiv2.textContent = 'В работе';
              }
            } else {
              contentCellDiv2.textContent = element[1];
            }
            

            contentCell.append(contentCellDiv1, contentCellDiv2);
            contentRow.appendChild(contentCell);
          })
          if(order.status === 'new') {
            contentRow.style.border = '1px solid #229ED9';
            contentRow.style.background = 'rgba(34,158,218,0.4)';  
          }
          if(order.status === 'inwork') {
            contentRow.style.border = '1px solid #E3A64B';
            contentRow.style.background = 'rgba(227,166,75,0.4)';  
          }
          if(order.status === 'canceled') {
            contentRow.style.border = '1px solid #FC0505';
            contentRow.style.background = 'rgba(252,5,5,0.4)';  
          }
          if(order.status === 'check') {
            contentRow.style.border = '1px solid #ABFFB3';
            contentRow.style.background = 'rgba(171,255,179,0.4)';  
          }
          if(order.status === 'done') {
            contentRow.style.border = '1px solid #0AFE23';
            contentRow.style.background = 'rgba(10,254,35,0.4)';  
          }
          contentContainer.append(contentRow);
        }
      }

      const search = document.querySelector('.order-filter-container-search');
      search.addEventListener('change', async event => {

        let searchData = this.data.filter(el => el.id === +search.value);
        contentContainer.innerHTML = ''; 
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
      let numberPage = (this.data.length / 10) < 1 ? 0 : Math.ceil(this.data.length / 10);
      if(numberPage > 0) {

        const data0Page = this.data.reverse().slice(0, 9).reverse();
        contentRows(data0Page);
      } else {
        contentRows(this.data);
      }
      const containerPageContainer = document.createElement('div');
      containerPageContainer.classList.add('pagination-page-container');
      const containerPage = document.createElement('input');
      containerPage.classList.add('pagination-page');
      containerPage.value = 1;
      const containerPageSpan = document.createElement('span');
      containerPageSpan.textContent = `из ${numberPage}`;
      containerPageContainer.append(containerPage, containerPageSpan);
      paginationContainer.insertBefore(containerPageContainer, paginationContainer.firstChild);
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
        element.addEventListener('change', async(event) => {
          page.forEach(p => {
            p.style.color = 'white';
          });
          localStorage.setItem('seller-order-page', event.target.value);
 
          event.target.style.color = '#FF7A00';
          contentContainer.innerHTML = ''; 
          const data0Page = paginate(this.data, event.target.value, this.data.length);
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