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
      const contentRows = async(data) => {
        for(let user of data.reverse()) {
          const array = [ 
            ['Nick', user.login],
            ['Discord', user.discord], 
            ['Trlegram', user.telegram], 
            ['Balance', user.balance],
          ]
          const contentRow = document.createElement('div');
          contentRow.classList.add('user-content-row');
          contentRow.dataset.id = user.id;
    
          array.forEach(element => {
            const contentCell = document.createElement('div');
            contentCell.classList.add('user-content-cell');
    
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
      //pagination
      let numberPage = (this.data.length / 10) < 1 ? 0 : Math.ceil(this.data.length / 10);
      if(numberPage > 0) {

        const data0Page = this.data.reverse().slice(0, 9).reverse();
        contentRows(data0Page);
      } else {
        contentRows(this.data.reverse());
      }

      /*       while(numberPage >= 1) {
        const containerPage = document.createElement('span');
        containerPage.classList.add('pagination-page');
        containerPage.textContent = numberPage;
        paginationContainer.insertBefore(containerPage, paginationContainer.firstChild)
        numberPage = numberPage - 1;
      } */
      const containerPageContainer = document.createElement('div');
      containerPageContainer.classList.add('pagination-page-container');
      /*       const containerPage = document.createElement('input');
      containerPage.classList.add('pagination-page');
      const containerPageSpan = document.createElement('span');
      containerPageSpan.textContent = `из ${numberPage}`;
      containerPageContainer.append(containerPage, containerPageSpan); */
      const containerPage = document.createElement('input');
      containerPage.classList.add('pagination-page');
      containerPage.value = 0;
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
          /* const data0Page = this.data.reverse().slice(0, 9); */
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

      const row = contentContainer.querySelectorAll('.product-content-row');
/*       row.forEach(element => {
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
      }) */
      return contentContainer;
    } catch(error){
      console.log(error.message);
      return error.message;
    }
  }
}