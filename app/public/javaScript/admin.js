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

(async() => {
  try {
    document.addEventListener("DOMContentLoaded", () => {
      let flagSwitcher;
      const escapingBallG = document.getElementById('escapingBallG');
      const ovarlay = document.querySelector('.modal-overlay');
      const mainPanelElement = document.querySelectorAll('.main-panel-radio label');
      const saveSelectedRadio = (value) => {
        localStorage.setItem('selectedRadio', value);
      };
    
      const getSelectedRadio = () => {
        return localStorage.getItem('selectedRadio');
      };


      /* createOrdersContent(); */
      //const mainHeaderContentElement = document.getElementById('')
      const handleRadioClick = async(input) => {
        if (input) {
          input.checked = true;
          const value = input.value;
          if (value === 'games') {
            if(flagSwitcher !== 'games') {
              flagSwitcher = 'games';
              ovarlay.style.display = 'block';
              escapingBallG.style.display = 'flex';
              localStorage.setItem('admin-order-page', 1);
              const requestGetGames = await fetch('/admin/getgames');
              const responseGetGame = await requestGetGames.json();

              const createButtonCreateGame = async() => {
                const labelsHeader = document.querySelectorAll('.main-panel2-radio label');
                labelsHeader.forEach(label => {
                  label.addEventListener('click', (event) => {
                    const input = document.querySelector(`#${label.getAttribute('for')}`);
                    if (input) {
                      input.checked = true;
                      const value = input.value;
                      if(value === 'games') {
                        ovarlay.style.display = 'block';
                        escapingBallG.style.display = 'flex';
                        localStorage.setItem('admin-order-page', 1);
  /*                    
                        mainFilterElement.innerHTML = '';
                        mainFilterElementGames.innerHTML = ''; */
                        createContentGames(value, responseGetGame[0]);
                        createButtonCreateGame();
                        ovarlay.style.display = 'none';
                        escapingBallG.style.display = 'none';
                      }
                      if(value === 'chapters') {
                        ovarlay.style.display = 'block';
                        escapingBallG.style.display = 'flex';
                        localStorage.setItem('admin-order-page', 1);
  /*                    
                        mainFilterElement.innerHTML = '';
                        mainFilterElementGames.innerHTML = ''; */
                        createContentChapter(value, responseGetGame[0], responseGetGame[1]);
                        createButtonCreateGame();
                        ovarlay.style.display = 'none';
                        escapingBallG.style.display = 'none';
                      }
                    }
                  })
                })
              }
              createContentGames(value, responseGetGame[0]);
              createButtonCreateGame();
              ovarlay.style.display = 'none';
              escapingBallG.style.display = 'none';
            }
          } else if (value === `orders`) {
            ovarlay.style.display = 'block';
            escapingBallG.style.display = 'flex';
            if(flagSwitcher !== 'orders') {
              flagSwitcher = 'orders';
              localStorage.setItem('admin-order-page', 1);
              const contentContainer  = document.querySelector('.content');
              contentContainer.innerHTML = '';
              createOrdersContent();
            }
            ovarlay.style.display = 'none';
            escapingBallG.style.display = 'none';
          } else if (value === `profiles`) {
            ovarlay.style.display = 'block';
            escapingBallG.style.display = 'flex';
            if(flagSwitcher !== 'profiles') {
              flagSwitcher = 'profiles';
              localStorage.setItem('admin-order-page', 1);
              const contentContainer  = document.querySelector('.content');
              contentContainer.innerHTML = '';
              const div = document.createElement('div');
              console.log(`prifles here`);
              div.style.textAlign = 'center';
              div.textContent = 'Этот раздел ещё не создан, пёс. Ты не имеешь имени. Ты не имеешь личности. Ты никто.';
              contentContainer.append(div);
              ovarlay.style.display = 'none';
              escapingBallG.style.display = 'none';
            }
          } else if (value === `finances`) {
            ovarlay.style.display = 'block';
            escapingBallG.style.display = 'flex';
            if(flagSwitcher !== 'finances') {
              flagSwitcher = 'finances';
              localStorage.setItem('admin-order-page', 1);

              const contentContainer  = document.querySelector('.content');
              contentContainer.innerHTML = '';
              createFinancesContent();
            }
            ovarlay.style.display = 'none';
            escapingBallG.style.display = 'none';
          } else if (value === `notifications`) {
            ovarlay.style.display = 'block';
            escapingBallG.style.display = 'flex';
            if(flagSwitcher !== 'notifications') {
              flagSwitcher = 'notifications';
              localStorage.setItem('admin-order-page', 1);
              const contentContainer  = document.querySelector('.content');
              contentContainer.innerHTML = '';
              createNotificationsContent();
            }
            ovarlay.style.display = 'none';
            escapingBallG.style.display = 'none';
          } else if (value === `users`) {
            ovarlay.style.display = 'block';
            escapingBallG.style.display = 'flex';
            if(flagSwitcher !== 'users') {
              flagSwitcher = 'users';
              localStorage.setItem('admin-order-page', 1);
              const contentContainer  = document.querySelector('.content');
              contentContainer.innerHTML = '';
              createUsersContent();
/*             mainContentElement.innerHTML = '';
            mainFilterElement.innerHTML = '';
            mainFilterElementGames.innerHTML = ''; */
            }
            ovarlay.style.display = 'none';
            escapingBallG.style.display = 'none';
          } 
          else {
            mainContentElement.innerHTML = '';
            mainFilterElement.innerHTML = '';
            mainFilterElementGames.innerHTML = '';
          }
        }
      }
      const savedValue = getSelectedRadio();
      if (savedValue) {
        const savedInput = document.querySelector(`input[value="${savedValue}"]`);
        if (savedInput) {
          savedInput.checked = true;
          handleRadioClick(savedInput); 
        }
      }
      mainPanelElement.forEach(label => {
        const input = document.querySelector(`#${label.getAttribute('for')}`);
        label.addEventListener('click', async(event) => {
          await handleRadioClick(input); 
          saveSelectedRadio(input.value); 
        });
      });
    })
  } catch(error) {
    console.log(error)
  }
})();