import { ModalElement} from './handlerModal/modalElement.js'
export class Modal { 
  constructor(data) {
    this.data = data;
  }
  renderFilterModal() {
    const modal = document.createElement('div');
    modal.id = 'seller-product-modal';
    modal.classList.add('seller-product-modal');
    modal.style.display = 'flex';
    const escapingBallG = document.getElementById('escapingBallG');

    const modalElement = new ModalElement(this.data);

    const labelGame = modalElement.renderLabel('modal-game', 'Игра');
    const selectGame = modalElement.renderSelect('modal-game');
    modal.append(labelGame, selectGame);

    const labelRegion = modalElement.renderLabel('modal-region', 'Регион');
    const selectRegion = modalElement.renderSelect('modal-region');
    modal.append(labelRegion, selectRegion);

    const labelMethod = modalElement.renderLabel('modal-method', 'Метод доставки');
    const divMethod = modalElement.renderDiv('modal-method');
    modal.append(labelMethod, divMethod);

    const labelServers = modalElement.renderLabel('modal-servers', 'Сервера');
    const selectServers = modalElement.renderSelect('modal-servers');
    modal.append(labelServers, selectServers);

    const labelPrice = modalElement.renderLabel('modal-price', 'Ориентировочная цена');
    const spanPrice = modalElement.renderP('modal-price');
    modal.append(labelPrice, spanPrice);

    const labelQuantity = modalElement.renderLabel('modal-quantity', 'Количество');
    const inputQuantity = modalElement.renderInput('modal-quantity');
    modal.append(labelQuantity, inputQuantity);

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('modal-button-container');
    const modalButtonClose = document.createElement('button');
    modalButtonClose.classList.add('modal-button');
    modalButtonClose.textContent = 'Закрыть';
    const modalButtonSave = document.createElement('button');
    modalButtonSave.classList.add('modal-button');
    modalButtonSave.textContent = 'Выставить';
    buttonContainer.append(modalButtonClose, modalButtonSave);

    //this.eventSelectGame(selectGame, labelGame, modal);
    function populateNameSelect(data) {
      const names = [...new Set(data.map(item => item.name))];
      clearSelect(selectGame);
      names.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        selectGame.appendChild(option);
      });
    }
    function populateRegionSelect(name, data) {
      const regions = [...new Set(data.filter(item => item.name === name).map(item => item.region))];
      clearSelect(selectRegion);
      clearSelect(divMethod);
      regions.forEach(region => {
        const option = document.createElement('option');
        option.value = region;
        option.textContent = region;
        selectRegion.appendChild(option);
      });
    }
    function populateMethods(name, region, data) {
      const methods = data.filter(item => item.name === name && item.region === region);
      clearSelect(divMethod);
      
      if(methods[0].methodDelivery && methods[0].methodDelivery.length > 0) {
        methods[0].methodDelivery.forEach(el => {
          const checkBoxMethod = modalElement.renderCheckBox('modal-method-checkbox', el);
          divMethod.appendChild(checkBoxMethod);
        })
      }
      /* spanMethod.textContent = methods[0].methodDelivery; */
    }
    function populateOptionsSelect(name, region, data) {

      const filteredItems = data.filter(item => item.name === name && item.region === region);
      filteredItems.sort((a, b) => a.localeCompare(b));

      clearSelect(selectServers);
      if (filteredItems.length > 0) {
        const optionSort = filteredItems[0].options.sort((a, b) => {
          // Сравниваем первые элементы вложенных массивов
          if (a[0] < b[0]) {
            return -1;
          } else if (a[0] > b[0]) {
            return 1;
          } else {
            return 0;
          }
        });;
        optionSort.forEach(optionArray => {
          const option = document.createElement('option');
          option.value = optionArray[0][0];
          option.textContent = optionArray[0][0];
          selectServers.appendChild(option);
        });
      }
    }
    function populatePrices(name, region, server, data) {

      if(server) {
        clearSelect(spanPrice);
        const prices = data.filter(item => item.name === name && item.region === region);

        const price = prices[0].options.filter(option => {

          if(option[0][0] == server){
            return option;
          }
        });
        if(prices[0] && prices[0].courseG2G && prices[0].courseG2G[0] && prices[0].courseG2G[1]) {
          spanPrice.textContent = (+price[0][2][0] * (+prices[0].courseG2G[2])) + ` $ за ${prices[0].courseG2G[0]} ${prices[0].courseG2G[1]}`;
        } else {
          spanPrice.textContent = price[0][2][0];
        }
      } else {
        const prices = data.filter(item => item.name === name && item.region === region);
        clearSelect(spanPrice);

        if(prices[0] && prices[0].options[0] && prices[0].options[0][2]) { 
          if(prices[0].courseG2G && prices[0].courseG2G[0] && prices[0].courseG2G[1] && prices[0].courseG2G[2]) {
            spanPrice.textContent = `${(+prices[0].options[0][2][0] * (+prices[0].courseG2G[2]))} $ за ${prices[0].courseG2G[0]} ${prices[0].courseG2G[1]}` ;
          } else {
            spanPrice.textContent = prices[0].options[0][2][0];
          }

        } else {
          spanPrice.textContent = '';
        }
        
      }
    }
    function clearSelect(select) {
      while (select.firstChild) {
        select.removeChild(select.firstChild);
      }
    }
    populateNameSelect(this.data);
    populateRegionSelect(this.data[0].name, this.data);
    populateMethods(this.data[0].name, this.data[0].region, this.data);
    populateOptionsSelect(this.data[0].name, this.data[0].region, this.data);
    populatePrices(this.data[0].name, this.data[0].region, '' , this.data);

    selectGame.addEventListener('change', () => {
      const selectedName = selectGame.value;
      populateRegionSelect(selectedName, this.data);
      const selectedRegion = selectRegion.value;
      populateOptionsSelect(selectedName, selectedRegion, this.data);
    });
    selectRegion.addEventListener('change', () => {
      const selectedName = selectGame.value;
      const selectedRegion = selectRegion.value;
      populateMethods(selectedName, selectedRegion, this.data)
      populateOptionsSelect(selectedName, selectedRegion, this.data);
    });
    selectServers.addEventListener('change', () => {
      const selectedName = selectGame.value;
      const selectedRegion = selectRegion.value;
      const selectedServers = selectServers.value;
      populatePrices(selectedName, selectedRegion, selectedServers,  this.data);
    });
    modalButtonClose.addEventListener('click', async(event) => {
      const overlay = document.querySelector('.modal-overlay');
      overlay.style.display = 'none';
      if(escapingBallG) {
        escapingBallG.style.display = 'none';
      }
      modal.remove();
    })
    modalButtonSave.addEventListener('click', async(event) => {
      escapingBallG.style.display = 'flex';


      const selects = event.target.parentElement.parentElement.querySelectorAll('select');

      const inputsMethod = event.target.parentElement.parentElement.querySelectorAll('input');
      const methodsArray = [];
      inputsMethod.forEach(el => {
        if(el.checked) {
          methodsArray.push(el.value);
        }
      })
      /* const inputValue = input.value; */
      const availableInput = document.querySelector('.modal-quantity');
      const available = availableInput.value;
      const values = Array.from(selects).map(select => {
        return select.value.split(',').map(item => item.trim());
      });
      const options = {
        method: 'POST',
        body: JSON.stringify({values, available, methodsArray}),
        headers: {
          'Content-Type': 'application/json',
        }
      }
      const requestProductSave = await fetch('/seller/saveproduct', options);
      const responseProductSave = await requestProductSave.json();
      if(responseProductSave.message === 'notContant') {
        escapingBallG.classList.add('notification');
        escapingBallG.style.width = '350px';
        escapingBallG.style.height = '90px';
        escapingBallG.innerHTML = 'ОШИБКА! Перейдите в раздел "Профиль" и заполните контактные данные: Telegram или Discord.';
        await new Promise(resolve => setTimeout(resolve, 5000));
        escapingBallG.style.display = 'none';
      }
      if(responseProductSave.message === 'emptyInput') {
        escapingBallG.classList.add('notification');
        escapingBallG.style.width = '350px';
        escapingBallG.style.height = '90px';
        escapingBallG.innerHTML = 'Строка "Количество" пуста.';
        await new Promise(resolve => setTimeout(resolve, 5000));
        escapingBallG.style.display = 'none';
      }
      if(responseProductSave.message === 'notNumber') {
        escapingBallG.classList.add('notification');
        escapingBallG.style.width = '350px';
        escapingBallG.style.height = '90px';
        escapingBallG.innerHTML = 'Строка "количество" не является числом.';
        await new Promise(resolve => setTimeout(resolve, 5000));
        escapingBallG.style.display = 'none';
      }
      if(responseProductSave.message === 'success') {
        escapingBallG.classList.add('notification');
        escapingBallG.style.width = '350px';
        escapingBallG.style.height = '90px';
        escapingBallG.style.color = '#0AFE23';
        escapingBallG.innerHTML = 'Товар успешно выставлен на продажу.';
        await new Promise(resolve => setTimeout(resolve, 5000));
        escapingBallG.style.display = 'none';
      }
      if(responseProductSave.message === 'hasOrder') {
        escapingBallG.classList.add('notification');
        escapingBallG.style.width = '350px';
        escapingBallG.style.height = '90px';
        escapingBallG.style.color = 'white';
        escapingBallG.innerHTML = 'Товар такого типа уже выставлен. Измените количество в уже выставленном товаре.';
        await new Promise(resolve => setTimeout(resolve, 10000));
        escapingBallG.style.display = 'none';
      }

    })
    modal.append(buttonContainer)
    return modal;
  }
  renderNotificationModal(text, id) {
    const modal = document.createElement('div');
    modal.id = 'seller-product-modal';
    modal.classList.add('seller-product-modal');
    modal.style.width = '300px';
    modal.style.height = '200px';
    modal.style.display = 'flex';
    const textElement = document.createElement('div');
    textElement.textContent = text;
    modal.append(text);

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('modal-button-container');
    const modalButtonClose = document.createElement('button');
    modalButtonClose.classList.add('modal-button');
    modalButtonClose.textContent = 'Отмена';
    const modalButtonDelete = document.createElement('button');
    modalButtonDelete.classList.add('modal-button');
    modalButtonDelete.id = id;
    modalButtonDelete.textContent = 'Удалить';
    buttonContainer.append(modalButtonClose, modalButtonDelete);

    modalButtonClose.addEventListener('click', event => {
      const overlay = document.querySelector('.modal-overlay');
      overlay.style.display = 'none';
      if(escapingBallG) {
        escapingBallG.style.display = 'none';
      }
      modal.remove();
    })
    modal.append(buttonContainer);
    return modal;
  }
  renderEditProduct(order, idButton) {
    const modal = document.createElement('div');
    modal.id = 'seller-product-modal';
    modal.classList.add('seller-product-modal');
    modal.style.display = 'flex';
    const span = modal.querySelectorAll('span');
    const modalElement = new ModalElement();
    const labelName = modalElement.renderLabel('modal-name', 'Игра');
    const spanName = modalElement.renderSpan('modal-name');
    spanName.textContent = order.name[0];
    const labelRegion = modalElement.renderLabel('modal-region', 'Регион');
    const spanRegion = modalElement.renderSpan('modal-region');
    spanRegion.textContent = order.region[0];
    const labelServer = modalElement.renderLabel('modal-server', 'Сервер');
    const spanServer = modalElement.renderSpan('modal-server');
    spanServer.textContent = order.server[0];
    const labelType = modalElement.renderLabel('modal-type', 'Тип');
    const spanType = modalElement.renderSpan('modal-type');
    spanType.textContent = order.type;
    const labelAvailable = modalElement.renderLabel('modal-available', 'Количество');
    const inputAvailable = modalElement.renderInput('modal-available');
    inputAvailable.value = order.available;
    const infoAvailable = modalElement.renderP('modal-placeholer', 'Здесь Вы можете изменить количество выставляемой валюты');
    

    
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('modal-button-container');
    const modalButtonClose = document.createElement('button');
    modalButtonClose.classList.add('modal-button');
    modalButtonClose.textContent = 'Закрыть';
    const modalButtonSaveEdit = document.createElement('button');
    modalButtonSaveEdit.classList.add('modal-button');
    modalButtonSaveEdit.id = idButton;
    modalButtonSaveEdit.textContent = 'Сохранить';
    buttonContainer.append(modalButtonClose, modalButtonSaveEdit);

    modalButtonClose.addEventListener('click', event => {
      const overlay = document.querySelector('.modal-overlay');
      overlay.style.display = 'none';
      if(escapingBallG) {
        escapingBallG.style.display = 'none';
      }
      
      modal.remove();
    })
    modal.append(
      labelName,
      spanName,
      labelRegion,
      spanRegion,
      labelServer,
      spanServer,
      labelType,
      spanType,
      labelAvailable,
      inputAvailable,
      infoAvailable,
      buttonContainer,
    );

    return modal;
  }
}