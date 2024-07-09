import { Switcher} from '../../components/admin/orders/switcher.js';
import { Filter } from '../../components/admin/orders/filter.js';
import { Content } from '../../components/admin/orders/content.js';
const createOrdersContent = async() => {
  const content = document.getElementById('content');

  const orderHeader = document.createElement('section');
  orderHeader.id = 'content-orders_header';
  orderHeader.classList.add('content-orders_header');
  const switcher = new Switcher();
  const createSwitcher = switcher.render();
  orderHeader.appendChild(createSwitcher);

  const orderFilter = document.createElement('section');
  orderFilter.id = 'content-orders_filter'
  orderHeader.classList.add('content-orders_filter');

  const orderContent = document.createElement('section');
  orderContent.id = 'content-orders_content';
  orderContent.classList.add('content-orders_content');
////
  const reqProducts = await fetch('/admin/getproducts');
  const resProducts = await reqProducts.json();
  const reqOrders = await fetch('/admin/getorders');
  const resOrders = await reqOrders.json();
  content.append(orderHeader, orderFilter, orderContent);
  orderFilter.innerHTML = '';
  orderContent.innerHTML = '';
  const filter = new Filter(resProducts);
  const createFilter = filter.render()
  orderFilter.appendChild(createFilter);
  const contentAllorders = new Content(resOrders.ordersData);
  const createContent = contentAllorders.renderOrders()
  orderContent.appendChild(createContent);
////
  const createButtonCreateGame = async() => {
    const labelsHeader = document.querySelectorAll('.orders-header-radio label');
    labelsHeader.forEach(label => {
      label.addEventListener('click', async(event) => {
        const reqProducts = await fetch('/admin/getproducts');
        const resProducts = await reqProducts.json();
        const reqOrders = await fetch('/admin/getorders');
        const resOrders = await reqOrders.json();
        const input = document.querySelector(`#${label.getAttribute('for')}`);
        if (input) {
          input.checked = true;
          const value = input.value;
          if(value === 'orders') {
            orderFilter.innerHTML = '';
            orderContent.innerHTML = '';
            const filter = new Filter(resProducts);
            const createFilter = filter.render()
            orderFilter.appendChild(createFilter);
            const content = new Content(resOrders.ordersData);
            const createContent = content.renderOrders()
            orderContent.appendChild(createContent);
          }
          if(value === 'products') {
            orderFilter.innerHTML = '';
            orderContent.innerHTML = '';

            const filter = new Filter(resProducts.products[0].data);
            const createFilter = filter.render()
            orderFilter.appendChild(createFilter);

            const content = new Content(resProducts.products[0].data);
            const createContent = content.render()
            orderContent.appendChild(createContent);
          }
        }
      })
    })
  }
  /* createContentGames(value, responseGetGame[0]); */
  createButtonCreateGame();

}
export default createOrdersContent;