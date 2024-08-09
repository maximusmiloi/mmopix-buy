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
    document.addEventListener("DOMContentLoaded", () => {
      let flagSwitcher;
      const escapingBallG = document.getElementById('escapingBallG');
      const ovarlay = document.querySelector('.modal-overlay');
      const mainPanelElement = document.querySelectorAll('.main-panel-radio label');
      
      const saveSelectedRadio = (value) => localStorage.setItem('selectedRadio', value);
      const getSelectedRadio = () => localStorage.getItem('selectedRadio');

      const showLoading = () => {
        ovarlay.style.display = 'block';
        escapingBallG.style.display = 'flex';
      };

      const hideLoading = () => {
        ovarlay.style.display = 'none';
        escapingBallG.style.display = 'none';
      };

      const fetchAndProcessGames = async () => {
        showLoading();
        localStorage.setItem('admin-order-page', 1);
        const requestGetGames = await fetch('/admin/getgames');
        const responseGetGame = await requestGetGames.json();
        return responseGetGame;
      };

      const createButtonCreateGame = (responseGetGame) => {
        const labelsHeader = document.querySelectorAll('.main-panel2-radio label');
        labelsHeader.forEach(label => {
          label.addEventListener('click', async (event) => {
            const input = document.querySelector(`#${label.getAttribute('for')}`);
            if (input) {
              input.checked = true;
              const value = input.value;
              showLoading();
              if (value === 'games') {
                createContentGames(value, responseGetGame[0]);
              } else if (value === 'chapters') {
                createContentChapter(value, responseGetGame[0], responseGetGame[1]);
              }
              createButtonCreateGame(responseGetGame);
              hideLoading();
            }
          });
        });
      };

      const handleRadioClick = async (input) => {
        if (input) {
          input.checked = true;
          const value = input.value;
          if (flagSwitcher !== value) {
            flagSwitcher = value;
            showLoading();
            const contentContainer = document.querySelector('.content');
            contentContainer.innerHTML = '';
            localStorage.setItem('admin-order-page', 1);

            switch (value) {
              case 'games':
                const responseGetGame = await fetchAndProcessGames();
                createContentGames(value, responseGetGame[0]);
                createButtonCreateGame(responseGetGame);
                break;
              case 'orders':
                createOrdersContent();
                break;
              case 'profiles':
                const div = document.createElement('div');
                div.style.textAlign = 'center';
                div.textContent = 'Этот раздел ещё не создан, пёс. Ты не имеешь имени. Ты не имеешь личности. Ты никто.';
                contentContainer.append(div);
                break;
              case 'finances':
                createFinancesContent();
                break;
              case 'notifications':
                createNotificationsContent();
                break;
              case 'users':
                createUsersContent();
                break;
              default:
                // Handle other cases or do nothing
                break;
            }
            hideLoading();
          }
        }
      };

      const savedValue = getSelectedRadio();
      console.log(savedValue)
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

      mainPanelElement.forEach(label => {
        const input = document.querySelector(`#${label.getAttribute('for')}`);
        label.addEventListener('click', async (event) => {
          await handleRadioClick(input);
          saveSelectedRadio(input.value);
        });
      });
    });
  } catch (error) {
    console.log(error);
  }
})();