import { Profile } from "../javaScript/components/header.js";
import { Switcher, Filter, Content} from './components/admin/games/components.js';
import { Modal } from '../javaScript/components/modal.js';
import {createContentGames} from '../javaScript/adminHandler/gameHandler/switchGames.js';
import {createContentChapter} from '../javaScript/adminHandler/gameHandler/switchChapter.js';
import createOrdersContent from './adminHandler/orderHandler/orders.js';
import createUsersContent from './adminHandler/userHandler/users.js';
import createFinancesContent from './adminHandler/financesHandler/finances.js';
import createNotificationsContent from './adminHandler/notificationsHandler/notifications.js';
(async() => {
  try {
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
    if(role === 'admin') {
      const profile = new Profile(role, balance);
      const element = profile.render();
      userInfo.appendChild(element);
    }
  } catch(error) {
    console.log(error)
  }
})();

(async () => {
  try {
    document.addEventListener("DOMContentLoaded", async() => {
      let flagSwitcher;
      const escapingBallG = document.getElementById('escapingBallG');
      const ovarlay = document.querySelector('.modal-overlay');
      const mainPanelElement = document.querySelectorAll('.main-panel-radio label');

      const showLoading = () => {
        ovarlay.style.display = 'block';
        escapingBallG.style.display = 'flex';
      };

      const hideLoading = () => {
        ovarlay.style.display = 'none';
        escapingBallG.style.display = 'none';
      };

      const saveSelectedRadio = (value) => {
        localStorage.setItem('selectedRadio', value);
      };

      const getSelectedRadio = () => localStorage.getItem('selectedRadio');

      const handleRadioClick = async (input) => {
        if (!input) return;

        input.checked = true;
        const value = input.value;

        if (value === 'games') {
          if (flagSwitcher !== 'games') {
            flagSwitcher = 'games';
            showLoading();
            localStorage.setItem('admin-order-page', 1);

            try {
              const response = await fetch('/admin/getgames');
              if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
              const data = await response.json();

              createContentGames(value, data[0]);
              createButtonCreateGame(data);
            } catch (error) {
              console.error(`Failed to fetch games data: ${error.message}`);
            } finally {
              hideLoading();
            }
          }
        } else if (value === 'orders') {
          if (flagSwitcher !== 'orders') {
            flagSwitcher = 'orders';
            showLoading();
            localStorage.setItem('admin-order-page', 1);
            const contentContainer = document.querySelector('.content');
            contentContainer.innerHTML = '';
            createOrdersContent();
            hideLoading();
          }
        } else if (value === 'profiles') {
          if (flagSwitcher !== 'profiles') {
            flagSwitcher = 'profiles';
            showLoading();
            localStorage.setItem('admin-order-page', 1);
            const contentContainer = document.querySelector('.content');
            contentContainer.innerHTML = '';
            const div = document.createElement('div');
            div.style.textAlign = 'center';
            div.textContent = 'Этот раздел ещё не создан, пёс. Ты не имеешь имени. Ты не имеешь личности. Ты никто.';
            contentContainer.append(div);
            hideLoading();
          }
        } else if (value === 'finances') {
          if (flagSwitcher !== 'finances') {
            flagSwitcher = 'finances';
            showLoading();
            localStorage.setItem('admin-order-page', 1);
            const contentContainer = document.querySelector('.content');
            contentContainer.innerHTML = '';
            createFinancesContent();
            hideLoading();
          }
        } else if (value === 'notifications') {
          if (flagSwitcher !== 'notifications') {
            flagSwitcher = 'notifications';
            showLoading();
            localStorage.setItem('admin-order-page', 1);
            const contentContainer = document.querySelector('.content');
            contentContainer.innerHTML = '';
            createNotificationsContent();
            hideLoading();
          }
        } else if (value === 'users') {
          if (flagSwitcher !== 'users') {
            flagSwitcher = 'users';
            showLoading();
            localStorage.setItem('admin-order-page', 1);
            const contentContainer = document.querySelector('.content');
            contentContainer.innerHTML = '';
            createUsersContent();
            hideLoading();
          }
        } else {
          const mainContentElement = document.querySelector('.main-content');
          const mainFilterElement = document.querySelector('.main-filter');
          const mainFilterElementGames = document.querySelector('.main-filter-games');
          if (mainContentElement && mainFilterElement && mainFilterElementGames) {
            mainContentElement.innerHTML = '';
            mainFilterElement.innerHTML = '';
            mainFilterElementGames.innerHTML = '';
          }
        }
      };

      const createButtonCreateGame = async (responseGetGame) => {
        const labelsHeader = document.querySelectorAll('.main-panel2-radio label');
        labelsHeader.forEach(label => {
          label.addEventListener('click', async (event) => {
            const input = document.querySelector(`#${label.getAttribute('for')}`);
            await handleRadioClick(input);
            saveSelectedRadio(input.value);
          });
        });
      };

      const savedValue = getSelectedRadio();
      if (savedValue) {
        const savedInput = document.querySelector(`input[value="${savedValue}"]`);
        if (savedInput) {
          savedInput.checked = true;
          await handleRadioClick(savedInput);
        }
      }

      mainPanelElement.forEach(label => {
        const input = document.querySelector(`#${label.getAttribute('for')}`);
        if (input) {
          label.addEventListener('click', async (event) => {
            await handleRadioClick(input);
            saveSelectedRadio(input.value);
          });
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
})();