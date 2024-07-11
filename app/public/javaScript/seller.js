import { Profile } from "./components/header.js";
import { Filter } from "./components/seller/products/filter.js";
import { Content } from "./components/seller/products/content.js";
import { ContentProfiles } from "./components/seller/profiles/contentProfiles.js";
import {Panel} from "./components/seller/finances/panel.js";
import {ContentFinance} from "./components/seller/finances/content.js";
import {ContentNotifications} from "./components/seller/notification/content.js";
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
      const escapingBallG = document.getElementById('escapingBallG');
      const ovarlay = document.querySelector('.modal-overlay');
      let flagSwitcher;
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
          if(flagSwitcher !== 'orders') {
            flagSwitcher = 'orders';
            localStorage.setItem('seller-order-page', 1);
            const mainContent = document.getElementById('main-content');
            mainContent.innerHTML = '';
            ovarlay.style.display = 'block';
            escapingBallG.style.display = 'flex';
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
            escapingBallG.style.display = 'none';
            ovarlay.style.display = 'none';
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
        }
        
        if (input.value === 'products') {
          
          if(flagSwitcher !== 'products') {
            flagSwitcher = 'products';
            content.innerHTML = ''; 
            ovarlay.style.display = 'block';
            escapingBallG.style.display = 'flex';
            localStorage.setItem('seller-order-page', 1);
            const requestOrders = await fetch('/seller/getorders');
            const responseOrders = await requestOrders.json();

            const createFilter = new Filter('Добавить товар', dataChapters.chapters);
            const filter = createFilter.renderGold();
            content.appendChild(filter);
            console.log(dataChapters.chapters)
            const createContent = new Content(responseOrders, dataChapters.chapters);
            const contentOrders = createContent.render();
            content.appendChild(contentOrders);
            escapingBallG.style.display = 'none';
            ovarlay.style.display = 'none';
          }
        }
    
        if (input.value === 'profiles') {
          if(flagSwitcher !== 'profiles') { 
            flagSwitcher = 'profiles';
            localStorage.setItem('seller-order-page', 1);
            /* const mainContent = document.getElementById('main-content'); */
            content.innerHTML = '';
            escapingBallG.style.display = 'flex';
            ovarlay.style.display = 'block';
            const reqUserInfo = await fetch('/seller/userinfo');
            const resUserInfo = await reqUserInfo.json();
            const createContent = new ContentProfiles(resUserInfo.user);
            const mainContent = createContent.render();
            content.append(mainContent);
            escapingBallG.style.display = 'none';
            ovarlay.style.display = 'none';
          }
        }
    
        if (input.value === 'finances') {
          if(flagSwitcher !== 'finances') {
            flagSwitcher = 'finances';
            localStorage.setItem('seller-order-page', 1);
            const mainContent = document.getElementById('main-content');
            mainContent.innerHTML = '';
            escapingBallG.style.display = 'flex';
            ovarlay.style.display = 'block';
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
            escapingBallG.style.display = 'none';
            ovarlay.style.display = 'none';
          }
        }
        if (input.value === 'notifications') {
          if(flagSwitcher !== 'notifications') {
            flagSwitcher = 'notifications';
            localStorage.setItem('seller-order-page', 1);
            const mainContent = document.getElementById('main-content');
            mainContent.innerHTML = '';
            escapingBallG.style.display = 'flex';
            ovarlay.style.display = 'block';
            const notificationContainer = document.createElement('div');
            notificationContainer.classList.add('notifications-container');
;
            const createContent = new ContentNotifications();
            const content = createContent.render();
            notificationContainer.append(content);
            mainContent.append(notificationContainer);
            escapingBallG.style.display = 'none';
            ovarlay.style.display = 'none';
          }
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
