import { ModalElement} from './handlerModal/modalElement.js'
export class Modal { 
  constructor(data) {
    this.data = data;
    this.modalElement = new ModalElement(data);
    this.escapingBallG = document.getElementById('escapingBallG');
  }

  renderFilterModal() {
    const modal = document.createElement('div');
    modal.id = 'seller-product-modal';
    modal.classList.add('seller-product-modal');
    modal.style.display = 'flex';

    const elements = this.createElements();
    const buttonContainer = this.createButtonContainer();

    const fragment = document.createDocumentFragment();
    elements.forEach(el => fragment.appendChild(el));
    fragment.appendChild(buttonContainer);

    modal.appendChild(fragment);
    return modal;
  }

  createElements() {
    const elements = [];

    const labelGame = this.modalElement.renderLabel('modal-game', 'Игра');
    const selectGame = this.modalElement.renderSelect('modal-game');
    elements.push(labelGame, selectGame);

    const labelRegion = this.modalElement.renderLabel('modal-region', 'Регион');
    const selectRegion = this.modalElement.renderSelect('modal-region');
    elements.push(labelRegion, selectRegion);

    const labelMethod = this.modalElement.renderLabel('modal-method', 'Метод доставки');
    const divMethod = this.modalElement.renderDiv('modal-method');
    elements.push(labelMethod, divMethod);

    const labelServers = this.modalElement.renderLabel('modal-servers', 'Сервера');
    const selectServers = this.modalElement.renderSelect('modal-servers');
    elements.push(labelServers, selectServers);

    const labelPrice = this.modalElement.renderLabel('modal-price', 'Ориентировочная цена');
    const spanPrice = this.modalElement.renderP('modal-price');
    elements.push(labelPrice, spanPrice);

    const labelQuantity = this.modalElement.renderLabel('modal-quantity', 'Количество');
    const inputQuantity = this.modalElement.renderInput('modal-quantity');
    elements.push(labelQuantity, inputQuantity);

    this.populateNameSelect(selectGame);
    this.updateRegionAndServer(selectRegion, selectServers, selectGame.value, spanPrice, divMethod);

    this.attachEventListeners(selectGame, selectRegion, selectServers, spanPrice, divMethod);

    return elements;
  }

  createButtonContainer() {
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('modal-button-container');

    const modalButtonClose = document.createElement('button');
    modalButtonClose.classList.add('modal-button');
    modalButtonClose.textContent = 'Закрыть';

    const modalButtonSave = document.createElement('button');
    modalButtonSave.classList.add('modal-button');
    modalButtonSave.textContent = 'Выставить';

    buttonContainer.append(modalButtonClose, modalButtonSave);

    modalButtonClose.addEventListener('click', this.closeModal.bind(this));
    modalButtonSave.addEventListener('click', this.saveProduct.bind(this));

    return buttonContainer;
  }

  attachEventListeners(selectGame, selectRegion, selectServers, spanPrice, divMethod) {
    selectGame.addEventListener('change', () => {
      this.updateRegionAndServer(selectRegion, selectServers, selectGame.value, spanPrice, divMethod);
    });

    selectRegion.addEventListener('change', () => {
      this.updateServerAndMethods(selectServers, selectGame.value, selectRegion.value, spanPrice, divMethod);
    });

    selectServers.addEventListener('change', () => {
      const selectedName = selectGame.value;
      const selectedRegion = selectRegion.value;
      const selectedServer = selectServers.value;
      this.populatePrices(spanPrice, selectedName, selectedRegion, selectedServer);
    });
  }

  closeModal() {
    const overlay = document.querySelector('.modal-overlay');
    overlay.style.display = 'none';
    if (this.escapingBallG) {
      this.escapingBallG.style.display = 'none';
    }
    document.getElementById('seller-product-modal').remove();
  }

  async saveProduct(event) {
    this.escapingBallG.style.display = 'flex';

    const modal = event.target.closest('.seller-product-modal');
    const selects = modal.querySelectorAll('select');
    const inputsMethod = modal.querySelectorAll('input');
    const methodsArray = Array.from(inputsMethod).filter(el => el.checked).map(el => el.value);
    const availableInput = modal.querySelector('.modal-quantity').value;

    const values = Array.from(selects).map(select => select.value.split(',').map(item => item.trim()));

    const options = {
      method: 'POST',
      body: JSON.stringify({ values, available: availableInput, methodsArray }),
      headers: { 'Content-Type': 'application/json' }
    };

    const response = await fetch('/seller/saveproduct', options);
    const responseData = await response.json();

    this.handleResponse(responseData);
  }

  handleResponse(response) {
    let message = '';
    switch (response.message) {
      case 'notContant':
        message = 'ОШИБКА! Перейдите в раздел "Профиль" и заполните контактные данные: Telegram или Discord.';
        break;
      case 'emptyInput':
        message = 'Строка "Количество" пуста.';
        break;
      case 'notNumber':
        message = 'Строка "количество" не является числом.';
        break;
      case 'success':
        message = 'Товар успешно выставлен на продажу.';
        break;
      case 'hasOrder':
        message = 'Товар такого типа уже выставлен. Измените количество в уже выставленном товаре.';
        break;
      default:
        message = 'Неизвестная ошибка.';
        break;
    }

    this.showNotification(message, response.message === 'success');
  }

  showNotification(message, isSuccess) {
    this.escapingBallG.classList.add('notification');
    this.escapingBallG.style.width = '350px';
    this.escapingBallG.style.height = '90px';
    this.escapingBallG.style.color = isSuccess ? '#0AFE23' : 'white';
    this.escapingBallG.innerHTML = message;

    setTimeout(() => {
      this.escapingBallG.style.display = 'none';
    }, isSuccess ? 5000 : 10000);
  }

  populateNameSelect(selectGame) {
    const names = [...new Set(this.data.map(item => item.name))];
    this.clearSelect(selectGame);
    names.forEach(name => {
      const option = document.createElement('option');
      option.value = name;
      option.textContent = name;
      selectGame.appendChild(option);
    });
  }

  updateRegionAndServer(selectRegion, selectServers, selectedName, spanPrice, divMethod) {
    this.populateRegionSelect(selectRegion, selectedName);
    const firstRegion = selectRegion.options[0]?.value;
    if (firstRegion) {
      this.updateServerAndMethods(selectServers, selectedName, firstRegion, spanPrice, divMethod);
    }
  }

  updateServerAndMethods(selectServers, selectedName, selectedRegion, spanPrice, divMethod) {
    this.populateMethods(divMethod, selectedName, selectedRegion);
    this.populateOptionsSelect(selectServers, selectedName, selectedRegion);
    const firstServer = selectServers.options[0]?.value;
    this.populatePrices(spanPrice, selectedName, selectedRegion, firstServer);
  }

  populateRegionSelect(selectRegion, name) {
    const regions = [...new Set(this.data.filter(item => item.name === name).map(item => item.region))];
    this.clearSelect(selectRegion);
    regions.forEach(region => {
      const option = document.createElement('option');
      option.value = region;
      option.textContent = region;
      selectRegion.appendChild(option);
    });
  }

  populateMethods(divMethod, name, region) {
    const methods = this.data.filter(item => item.name === name && item.region === region);
    this.clearSelect(divMethod);
    if (methods.length > 0 && methods[0].methodDelivery) {
      methods[0].methodDelivery.forEach(method => {
        const checkBoxMethod = this.modalElement.renderCheckBox('modal-method-checkbox', method);
        divMethod.appendChild(checkBoxMethod);
      });
    }
  }

  populateOptionsSelect(selectServers, name, region) {
    const filteredItems = this.data.filter(item => item.name === name && item.region === region);
    filteredItems.sort((a, b) => a[0][0].localeCompare(b[0][0]));

    this.clearSelect(selectServers);
    if (filteredItems.length > 0) {
      const optionSort = filteredItems[0].options.sort((a, b) => a[0][0].localeCompare(b[0][0]));
      optionSort.forEach(optionArray => {
        const option = document.createElement('option');
        option.value = optionArray[0][0];
        option.textContent = optionArray[0][0];
        selectServers.appendChild(option);
      });
    }
  }

  populatePrices(spanPrice, name, region, server) {
    const prices = this.data.filter(item => item.name === name && item.region === region);
    this.clearSelect(spanPrice);
    if (server && prices.length > 0) {
      const price = prices[0].options.find(option => option[0][0] === server);
      console.log(prices[0])
      if (price &&  prices[0] && prices[0].courseG2G && prices[0].courseG2G[0] && price[2]) {
        spanPrice.textContent = prices[0].courseG2G
          ? `${+price[2][0] * +prices[0].courseG2G[2]} $ за ${prices[0].courseG2G[0]} ${prices[0].courseG2G[1]}`
          : price[2][0];
      } else {
        spanPrice.style.color = 'gray';
        spanPrice.textContent = 'Цена не определена';
      }
    } else if (prices.length > 0 && prices[0].options.length > 0) {
      spanPrice.textContent = prices[0].courseG2G
        ? `${+prices[0].options[0][2][0] * +prices[0].courseG2G[2]} $ за ${prices[0].courseG2G[0]} ${prices[0].courseG2G[1]}`
        : prices[0].options[0][2][0];
    } else {
      spanPrice.style.color = 'gray';
      spanPrice.textContent = 'Цена не определена';
    }
  }

  clearSelect(select) {
    while (select.firstChild) {
      select.removeChild(select.firstChild);
    }
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