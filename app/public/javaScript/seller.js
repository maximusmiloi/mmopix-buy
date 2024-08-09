import { Profile } from "./components/header.js";
import { Filter } from "./components/seller/products/filter.js";
import { Content } from "./components/seller/products/content.js";
import { ContentProfiles } from "./components/seller/profiles/contentProfiles.js";
import {Panel} from "./components/seller/finances/panel.js";
import {ContentFinance} from "./components/seller/finances/content.js";
import {ContentNotifications} from "./components/seller/notification/content.js";
import {SwitcherOrders} from "./components/seller/orders/switcher.js";
import {SwitcherProducts} from "./components/seller/products/switcher.js";
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

(async () => {
  const message = document.querySelector('.message-panel');

  try {
    document.addEventListener('DOMContentLoaded', () => {
      const escapingBallG = document.getElementById('escapingBallG');
      const overlay = document.querySelector('.modal-overlay');
      const mainPanelElements = document.querySelectorAll('.main-panel-radio label');
      const content = document.querySelector('.main-content');
      let flagSwitcher;
      let debounceTimeout;
      let dataChaptersCache = null;
      let userInfoCache = null;
      let ordersCache = null;

      const saveSelectedRadio = (value) => {
        localStorage.setItem('selectedRadio', value);
      };

      const getSelectedRadio = () => {
        return localStorage.getItem('selectedRadio');
      };

      const fetchData = async (url) => {
        const response = await fetch(url);
        return await response.json();
      };

      const getDataChapters = async () => {
        if (!dataChaptersCache) {
          dataChaptersCache = await fetchData('/seller/getchapters');
        }
        return dataChaptersCache;
      };

      const getUserInfo = async () => {
        if (!userInfoCache) {
          userInfoCache = await fetchData('/seller/userinfo');
        }
        return userInfoCache;
      };

      const getOrders = async () => {
        if (!ordersCache) {
          ordersCache = await fetchData('/seller/getorders');
        }
        return ordersCache;
      };

      const handleRadioClick = async (input) => {
        if (debounceTimeout) clearTimeout(debounceTimeout);
        
        debounceTimeout = setTimeout(async () => {
          const dataChapters = await getDataChapters();
          
          const showLoading = () => {
            overlay.style.display = 'block';
            escapingBallG.style.display = 'flex';
          };

          const hideLoading = () => {
            escapingBallG.style.display = 'none';
            overlay.style.display = 'none';
          };

          const clearContent = () => {
            content.innerHTML = '';
          };

          showLoading();

          if (input.value === 'orders' && flagSwitcher !== 'orders') {
            flagSwitcher = 'orders';
            localStorage.setItem('seller-order-page', 1);
            clearContent();

            const switcher = new SwitcherOrders();
            content.appendChild(switcher.renderPanel1());
            content.appendChild(switcher.renderPanel2());

            const filter = new FilterOrders(dataChapters.ordersUser);
            const filterElement = filter.render();
            content.appendChild(filterElement);

            const contentOrders = new ContentOrders(dataChapters.ordersUser);
            const contentElement = contentOrders.renderOrders();
            content.appendChild(contentElement);

            const toggleDisplay = (display) => {
              filterElement.style.display = display;
              contentElement.style.display = display;
            };

            document.querySelectorAll('.switcher-orders input').forEach(input => {
              input.addEventListener('click', (event) => {
                toggleDisplay(event.target.value === 'newOrders' || event.target.value === 'Buy' ? 'none' : 'flex');
              });
            });
          }

          if (input.value === 'products' && flagSwitcher !== 'products') {
            flagSwitcher = 'products';
            clearContent();

            const responseOrders = await getOrders();

            content.appendChild(new SwitcherProducts().renderPanel1());
            content.appendChild(new Filter(dataChapters.chapters).renderGold('Добавить товар'));
            content.appendChild(new Content(responseOrders, dataChapters.chapters).render());
          }

          if (input.value === 'profiles' && flagSwitcher !== 'profiles') {
            flagSwitcher = 'profiles';
            clearContent();

            const resUserInfo = await getUserInfo();

            content.appendChild(new ContentProfiles(resUserInfo.user).render());
          }

          if (input.value === 'finances' && flagSwitcher !== 'finances') {
            flagSwitcher = 'finances';
            clearContent();

            const resUserInfo = await getUserInfo();

            const financeContainer = document.createElement('div');
            financeContainer.classList.add('finance-container');

            financeContainer.append(
              new Panel(resUserInfo, resUserInfo.courseRUB).render(),
              new ContentFinance(resUserInfo.paymentOrdersUser).render()
            );

            content.appendChild(financeContainer);
          }

          if (input.value === 'notifications' && flagSwitcher !== 'notifications') {
            const resUserInfo = await getUserInfo();
            flagSwitcher = 'notifications';
            clearContent();

            const notificationContainer = document.createElement('div');
            notificationContainer.classList.add('notifications-container');

            notificationContainer.append(new ContentNotifications(resUserInfo).render());
            content.appendChild(notificationContainer);
          }

          hideLoading();
        }, 300); // Debounce delay
      };
      if (!localStorage.getItem('selectedRadio')) {
        localStorage.setItem('selectedRadio', 'orders');
        handleRadioClick(document.querySelector('input[value="orders"]'));
      }
      const savedValue = getSelectedRadio();
      if (savedValue) {
        const savedInput = document.querySelector(`input[value="${savedValue}"]`);
        if (savedInput) {
          savedInput.checked = true;
          handleRadioClick(savedInput);
        }
      } else {
        const savedInput = document.querySelector(`input[value="orders"]`);
        if (savedInput) {
          savedInput.checked = true;
          handleRadioClick(savedInput);
        }
      }

      mainPanelElements.forEach(elementPanel => {
        const input = document.querySelector(`#${elementPanel.getAttribute('for')}`);
        elementPanel.addEventListener('click', async () => {
          await handleRadioClick(input);
          saveSelectedRadio(input.value);
        });
      });
    });
  } catch (error) {
    console.log(error);
    message.style.display = 'flex';
    message.textContent = error.message;
  }
})();