/* import { Profile } from "../../components/admin/admin.js"; */
import { Switcher, Filter, Content} from '../../components/admin/games/components.js';
import { Modal } from '../../components/modal.js';



export const createContentGames = async(value, responseData) =>{
  const contentContainer = document.getElementById('content');
  contentContainer.innerHTML = '';

  const mainContentElement = document.createElement('section');
  mainContentElement.id = 'main-panel2';
  mainContentElement.classList.add('main-panel2');

  const mainFilterElement = document.createElement('section');
  mainFilterElement.id = 'main-filter';
  mainFilterElement.classList.add('main-filter');

  const mainFilterElementGames = document.createElement('main-content');
  mainFilterElementGames.id = 'main-content';
  mainFilterElementGames.classList.add('main-content');
  contentContainer.append(mainContentElement, mainFilterElement, mainFilterElementGames);

  const indicatorLoad = document.getElementById('escapingBallG');

  const header = new Switcher(value);
  const createHeader = header.render();
  mainContentElement.appendChild(createHeader);

  const filter = new Filter(value);
  const createfilter = filter.render();
  mainFilterElement.append(createfilter[0], createfilter[1]);

  const content = new Content(responseData);
  const createContent = content.render();
  mainFilterElementGames.appendChild(createContent);
  
  if (value === 'games') {
    const buttonCreateGame = document.querySelector(`.main-filter-button`);
    const buttonEditGame = document.querySelectorAll('.main-content-container-button-edit');
    const buttonEditDelete = document.querySelectorAll('.main-content-container-button-delete');
    const changeStateGame = document.querySelectorAll('.enable-disable-game');
    const buttonUpdatePrice = document.querySelector('.main-filter-button-prices_update');

    buttonCreateGame.addEventListener('click', async(event) => {
      if(buttonCreateGame.value === 'create-new-game') {
        document.querySelector('.modal-overlay').style.display = 'block';
        const mainModal = document.getElementById('modal');
        const mainModalContent = new Modal(value, ['Game', 'Region', /* 'Version', */ /* 'Type' */], [['modal-button-close', 'Закрыть'], ['modal-button-create-newgame', 'Создать']]);
        const mainModalContentElement = mainModalContent.render();
        mainModal.appendChild(mainModalContentElement)
        mainModal.style.display = 'flex';
  
        const buttonCreateGame = document.querySelector('.modal-button-create-newgame');
        const buttonCreateClose = document.querySelector('.modal-button-close');
        buttonCreateClose.addEventListener('click', async(event) => {
          document.querySelector('.modal-overlay').style.display = 'none';
          mainModal.style.display = 'none';
        })
        buttonCreateGame.addEventListener('click', async(event) => {
          
          indicatorLoad.style.display = 'block';
  
          const inputs = event.target.parentElement.parentElement.querySelectorAll('input');
          
          const values = [];
          const regionArray = [];
          inputs.forEach((input, index) => {
            if(index === 0) {
              values.push([input.value]);
            } else {
              regionArray.push(input.value);
            }
          })
          values.push(regionArray);
/*           const values = Array.from(inputs).map(input => {
            return input.value.split(',').map(item => item.trim());
          }); */
          const optionsCreateGame = {
            method: 'POST',
            body: JSON.stringify({values}),
            headers: {
              'Content-Type': 'application/json',
            }
          }
          const requestCreateGame = await fetch(`/admin/createnewgame`, optionsCreateGame);
          const responseCreateGame = await requestCreateGame.json();
          indicatorLoad.style.display = 'none';
          
        })
      }
    })
    buttonEditDelete.forEach(button => {
      button.addEventListener('click', async(event) => { 
        const ModalDelete = new Modal();
        const idGame = event.target.dataset.id;
        const createModalDelete = await ModalDelete.renderNotification('Игра и все связанные с ней разделы и товары продавцов будут удалены', idGame);
        contentContainer.append(createModalDelete)
      } )
    })
    buttonEditGame.forEach(button => {
      button.addEventListener('click',(event) => {
        document.querySelector('.modal-overlay').style.display = 'block';
        let gameData;
        const idGame = event.target.dataset.id;
        const containerInfo = document.querySelectorAll('.main-content-container-element');
        let nameGame;
        let regionGame;
        let typeGame;
        containerInfo.forEach(container => {
          if(container.dataset.index === idGame) {
            const containerDiv = container.querySelectorAll('.main-content-container-element-div');
            containerDiv.forEach(divElement => {
              const divElementValues = divElement.querySelectorAll('div');
              if(divElementValues[0].textContent === 'name') {
                nameGame = divElementValues[1].textContent;
              }
              if(divElementValues[0].textContent === 'region') {
                regionGame = divElementValues[1].textContent;
              }
              if(divElementValues[0].textContent === 'type') {
                typeGame = divElementValues[1].textContent;
              }
            })

          }
        })
        responseData.forEach(element => {
          if(element._id === idGame) {
            gameData = element;
          }
        })
        const mainModal = document.getElementById('modal');
        const mainModalContent = new Modal(value, ['name', 'region', /* 'version', */ /* 'type' */], [['modal-button-close', 'Закрыть'], ['modal-button-create-savegame', 'Сохранить  ']], gameData);
        const mainModalContentElement = mainModalContent.render();
        mainModal.appendChild(mainModalContentElement)
        mainModal.style.display = 'flex';
        const buttonsaveGame = document.querySelector('.modal-button-create-savegame');
        const buttonCreateClose = document.querySelector('.modal-button-close');
        buttonCreateClose.addEventListener('click', async(event) => {
          document.querySelector('.modal-overlay').style.display = 'none';
          mainModal.style.display = 'none';
        })
        
        buttonsaveGame.addEventListener('click', async(event) => {
          indicatorLoad.style.display = 'block';
  
          const inputs = event.target.parentElement.parentElement.querySelectorAll('input');
          const values = Array.from(inputs).map(input => {
            return input.value.split(',').map(item => item.trim());
          });
          const optionsCreateGame = {
            method: 'POST',
            body: JSON.stringify({values, idGame}),
            headers: {
              'Content-Type': 'application/json',
            }
          }
          const requestCreateGame = await fetch(`/admin/editgame`, optionsCreateGame);
          const responseCreateGame = await requestCreateGame.json();
          indicatorLoad.style.display = 'none';
          
        })
      })
    })
    changeStateGame.forEach(element => {
      element.addEventListener('click', async(event) => {
        const idElement = element.parentElement.parentElement.parentElement.dataset.index;
        if(event.target.checked) {
          event.target.checked = true;
          const requestStateGame = await fetch(`/admin/stateGame?state=${event.target.checked}&id=${idElement}`)
          const responseStateGame = await requestStateGame.json();
        } else {
          event.target.checked = false;
          const requestStateGame = await fetch(`/admin/stateGame?state=${event.target.checked}&id=${idElement}`);
          const responseStateGame = await requestStateGame.json();
        }
      })
    })
    buttonUpdatePrice.addEventListener('click', async(event) => {
      indicatorLoad.style.display = 'flex';
      const requestUpdatePrice = await fetch('/admin/updateprices');
      const responseUpdatePrice = await requestUpdatePrice.json();
      
      if(responseUpdatePrice.message === 'success') {
        indicatorLoad.innerHTML = 'ЦЕНЫ ОБНОВЛЕНЫ';
        indicatorLoad.style.justifyContent = 'center';
        indicatorLoad.style.alignItems = 'center';
        indicatorLoad.style.textAlign = 'center';
        indicatorLoad.style.color = 'green';
        indicatorLoad.style.width = '300px';
        indicatorLoad.style.height = '300px';
        indicatorLoad.style.background = '#FF7A00'
        indicatorLoad.style.fontSize = '24px';
        indicatorLoad.style.fontWeight = '900';
      } else {
        indicatorLoad.innerHTML = `Что-то пошло не так. Обратись к максиму: ${responseUpdatePrice.message}`;
        indicatorLoad.style.justifyContent = 'center';
        indicatorLoad.style.alignItems = 'center';
        indicatorLoad.style.textAlign = 'center';
        indicatorLoad.style.color = 'red';
        indicatorLoad.style.fontSize = '24px';
        indicatorLoad.style.fontWeight = '900';
        indicatorLoad.style.color = 'green';
        indicatorLoad.style.width = '300px';
        indicatorLoad.style.height = '300px';
        indicatorLoad.style.background = '#FF7A00'
        indicatorLoad.style.fontSize = '24px';
        indicatorLoad.style.fontWeight = '900';
      }
    })
  }
}