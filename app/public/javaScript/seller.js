import { Profile } from "./components/header.js";
import { Filter } from "./components/seller/products/filter.js";
import { Content } from "./components/seller/products/content.js";
import { ContentProfiles } from "./components/seller/profiles/contentProfiles.js";
import {Panel} from "./components/seller/finances/panel.js";
import {ContentFinance} from "./components/seller/finances/content.js";
import {SwitcherOrders} from "./components/seller/orders/switcher.js";
import {FilterOrders} from "./components/seller/orders/filter.js";
import {ContentOrders} from "./components/seller/orders/content.js";

(async() => {
  const userInfo = document.querySelector('.profile-info');
  const request = await fetch('/info');
  const response = await request.json();

  let role; 
  let balance;
  !response.user ? role = undefined : role = response.user.role;
  !response.user ? balance = undefined : balance = response.user.balance;

  if(role === undefined) {
    const profile = new Profile(role, balance);
    const element = profile.render();

    userInfo.appendChild(element);
  }
  if(role === 'admin' || role === 'seller') {
    const profile = new Profile(role, balance);
    const element = profile.render();
    userInfo.appendChild(element);
  }
})();

(async() => {
  const  message = document.querySelector('.message-panel')
  try {
    document.addEventListener("DOMContentLoaded", () => {
      const mainPanelElement = document.querySelectorAll('.main-panel-radio label');
      const content = document.querySelector('.main-content');
    
      const saveSelectedRadio = (value) => {
        localStorage.setItem('selectedRadio', value);
      };
    
      const getSelectedRadio = () => {
        return localStorage.getItem('selectedRadio');
      };
    
      const handleRadioClick = async (input) => {
        const requestDataChapters = await fetch('/seller/getchapters');
        const dataChapters = await requestDataChapters.json();
    
        if (input.value === 'orders') {
          localStorage.setItem('seller-order-page', 1);
          const mainContent = document.getElementById('main-content');
          mainContent.innerHTML = '';
          const switcher = new SwitcherOrders();
          const createSwitcher = switcher.renderPanel1();
          mainContent.appendChild(createSwitcher);
          const createSwitcher2 = switcher.renderPanel2();
          mainContent.appendChild(createSwitcher2);

          const filter = new FilterOrders(dataChapters.ordersUser);
          const filterCreate = filter.render();
          mainContent.appendChild(filterCreate);
          const content = new ContentOrders(dataChapters.ordersUser);
          const contentCreate = content.renderOrders();
          mainContent.appendChild(contentCreate);


          const inputsSwitcher = createSwitcher.querySelectorAll('input');
          
          inputsSwitcher.forEach(input => {

            input.addEventListener('click', async event => {
              if(event.target.value === 'newOrders') {
                filterCreate.style.display = 'none';
                contentCreate.style.display = 'none';
              }
              if(event.target.value === 'myOrders') {
                filterCreate.style.display = 'flex';
                contentCreate.style.display = 'flex';
              }
            });
          });
          const inputsSwitcher2 = createSwitcher2.querySelectorAll('input');
          inputsSwitcher2.forEach(input => {

            input.addEventListener('click', async event => {

              if(event.target.value === 'Buy') {
                filterCreate.style.display = 'none';
                contentCreate.style.display = 'none';
              }
              if(event.target.value === 'Sell') {
                filterCreate.style.display = 'flex';
                contentCreate.style.display = 'flex';
              }
            });
          });
        }
    
        if (input.value === 'products') {
          localStorage.setItem('seller-order-page', 1);
          const requestOrders = await fetch('/seller/getorders');
          const responseOrders = await requestOrders.json();
    
          const createFilter = new Filter('Добавить товар', dataChapters.chapters);
          const filter = createFilter.renderGold();
          content.innerHTML = '';
          content.appendChild(filter);
    
          const createContent = new Content(responseOrders);
          const contentOrders = createContent.render();
          content.appendChild(contentOrders);
        }
    
        if (input.value === 'profiles') {
          localStorage.setItem('seller-order-page', 1);
          /* const mainContent = document.getElementById('main-content'); */
          content.innerHTML = '';
          const reqUserInfo = await fetch('/seller/userinfo');
          const resUserInfo = await reqUserInfo.json();
          const createContent = new ContentProfiles(resUserInfo.user);
          const mainContent = createContent.render();
          content.append(mainContent);
        }
    
        if (input.value === 'finances') {
          localStorage.setItem('seller-order-page', 1);
          const mainContent = document.getElementById('main-content');
          mainContent.innerHTML = '';
          const financeContainer = document.createElement('div');
          financeContainer.classList.add('finance-container');
          const reqUserInfo = await fetch('/seller/userinfo');
          const resUserInfo = await reqUserInfo.json();

          const createPanel = new Panel(resUserInfo);
          const panel = createPanel.render();
          const createContent = new ContentFinance(resUserInfo.paymentOrdersUser);
          const content = createContent.render();
          mainContent.append(financeContainer);
          financeContainer.append(panel, content);
        }
      };
    
      const savedValue = getSelectedRadio();
      if (savedValue) {
        const savedInput = document.querySelector(`input[value="${savedValue}"]`);
        if (savedInput) {
          savedInput.checked = true;
          handleRadioClick(savedInput); 
        }
      }
    
      mainPanelElement.forEach(elementPanel => {
        const input = document.querySelector(`#${elementPanel.getAttribute('for')}`);
        elementPanel.addEventListener('click', async(event) => {
          await handleRadioClick(input); 
          saveSelectedRadio(input.value); 
        });
      });
    });

  } catch(error) {
    console.log(error);
    message.style.display = 'flex';
    message.textContent = error.message;
    /* message. */
  }
})();
