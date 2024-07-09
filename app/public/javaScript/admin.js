import { Profile } from "../javaScript/components/header.js";
import { Switcher, Filter, Content} from './components/admin/games/components.js';
import { Modal } from '../javaScript/components/modal.js';
import {createContentGames} from '../javaScript/adminHandler/gameHandler/switchGames.js';
import {createContentChapter} from '../javaScript/adminHandler/gameHandler/switchChapter.js';
import createOrdersContent from './adminHandler/orderHandler/orders.js';
import createUsersContent from './adminHandler/userHandler/users.js';
import createFinancesContent from './adminHandler/financesHandler/finances.js';
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

    const mainPanelElement = document.querySelectorAll('.main-panel-radio label');
    createOrdersContent();
    //const mainHeaderContentElement = document.getElementById('')
    mainPanelElement.forEach(label => {
      label.addEventListener('click', async(event) => {
        const input = document.querySelector(`#${label.getAttribute('for')}`);
        if (input) {
          input.checked = true;
          const value = input.value;
          if (value === 'games') {
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
                      localStorage.setItem('admin-order-page', 1);
/*                    
                      mainFilterElement.innerHTML = '';
                      mainFilterElementGames.innerHTML = ''; */
                      createContentGames(value, responseGetGame[0]);
                      createButtonCreateGame();
                    }
                    if(value === 'chapters') {
                      localStorage.setItem('admin-order-page', 1);
/*                    
                      mainFilterElement.innerHTML = '';
                      mainFilterElementGames.innerHTML = ''; */
                      createContentChapter(value, responseGetGame[0], responseGetGame[1]);
                      createButtonCreateGame();
                    }
                  }
                })
              })
            }
            createContentGames(value, responseGetGame[0]);
            createButtonCreateGame();

          } else if (value === `orders`) {
            localStorage.setItem('admin-order-page', 1);
            const contentContainer  = document.querySelector('.content');
            contentContainer.innerHTML = '';
            createOrdersContent();
          } else if (value === `profiles`) {
            localStorage.setItem('admin-order-page', 1);
            const contentContainer  = document.querySelector('.content');
            contentContainer.innerHTML = '';
             
          } else if (value === `finances`) {
            localStorage.setItem('admin-order-page', 1);

            const contentContainer  = document.querySelector('.content');
            contentContainer.innerHTML = '';
            createFinancesContent();
             
          } else if (value === `notifications`) {
            localStorage.setItem('admin-order-page', 1);
            const contentContainer  = document.querySelector('.content');
            contentContainer.innerHTML = '';

          } else if (value === `users`) {
            localStorage.setItem('admin-order-page', 1);
            const contentContainer  = document.querySelector('.content');
            contentContainer.innerHTML = '';
            createUsersContent();
/*             mainContentElement.innerHTML = '';
            mainFilterElement.innerHTML = '';
            mainFilterElementGames.innerHTML = ''; */
          } 
           else {
            mainContentElement.innerHTML = '';
            mainFilterElement.innerHTML = '';
            mainFilterElementGames.innerHTML = '';
          }
        }
      });
    });
  } catch(error) {
    console.log(error)
  }
})();