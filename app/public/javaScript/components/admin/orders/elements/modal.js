import { Elements } from './elements.js';
export class Modal { 
  constructor(data) {
    this.data = data;
  }
  renderProductModal() {
    const overlay = document.querySelector('.modal-overlay');
      overlay.style.display = 'flex';
    const modal = document.createElement('div');
    modal.id = 'admin-product-modal';
    modal.classList.add('admin-product-modal');
    modal.style.display = 'flex';
    const escapingBallG = document.getElementById('escapingBallG');

    const modalElement = new Elements(this.data);

    const labelid = modalElement.renderLabel('modal-id', 'ID');
    const spanid = modalElement.renderSpan('modal-id');
    spanid.textContent = this.data.id;

    const labelSeller = modalElement.renderLabel('modal-seller', 'Продавец');
    const spanSeller = modalElement.renderSpan('modal-seller');
    spanSeller.textContent = this.data.login;

    const labelGame = modalElement.renderLabel('modal-game', 'Игра');
    const spanGame = modalElement.renderSpan('modal-game');
    spanGame.textContent = this.data.name[0];

    const labelRegion = modalElement.renderLabel('modal-region', 'Регион');
    const spanRegion = modalElement.renderSpan('modal-region');
    spanRegion.textContent = this.data.region[0];

    const labelServer = modalElement.renderLabel('modal-server', 'Сервер');
    const spanServer = modalElement.renderSpan('modal-server');
    spanServer.textContent = this.data.server[0];

/*     const labelPrice = modalElement.renderLabel('modal-price', 'Приблизительная цена');
    const spanPrice = modalElement.renderSpan('modal-price');
    spanPrice.textContent = this.data.available; */

    const labelQuantity = modalElement.renderLabel('modal-quantity', 'Количество');
    const inputQuantity = modalElement.renderInput('modal-quantity');

    const labelPrice = modalElement.renderLabel('modal-price', 'Стоимость');
    const inputPrice = modalElement.renderInput('modal-price');

    const labelByuer = modalElement.renderLabel('modal-buyer', 'Никнейм покупателя');
    const inputByuer = modalElement.renderInput('modal-buyer');

    const labelMethod = modalElement.renderLabel('modal-method', 'Способ доставки');
    const inputMethod = modalElement.renderInput('modal-method');

    const labelDiscription = modalElement.renderLabel('modal-discription', 'Описание заказа');
    const inputDiscription = modalElement.renderInput('modal-discription');



    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('modal-button-container');
    const modalButtonClose = document.createElement('button');
    modalButtonClose.classList.add('modal-button');
    modalButtonClose.textContent = 'Закрыть';
    const modalButtonSave = document.createElement('button');
    modalButtonSave.classList.add('modal-button');
    modalButtonSave.textContent = 'Заказать';
    buttonContainer.append(modalButtonClose, modalButtonSave);

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
      const spans = event.target.parentElement.parentElement.querySelectorAll('span');
      const inputs = event.target.parentElement.parentElement.querySelectorAll('input');
      const valuesInput = [];
      inputs.forEach(input => {
        valuesInput.push(input.value)
      });
      const values = Array.from(spans).map(span => {
        return span.textContent.split(',').map(item => item.trim());
      });
      const options = {
        method: 'POST',
        body: JSON.stringify({values, valuesInput}),
        headers: {
          'Content-Type': 'application/json',
        }
      }
      const requestProductOrder = await fetch('/admin/productorder', options);
      const responseProductOrder = await requestProductOrder.json();
      if(responseProductOrder.message === 'emptyInput') {
        escapingBallG.classList.add('notification');
        escapingBallG.style.width = '300px';
        escapingBallG.style.height = '50px';
        escapingBallG.innerHTML = 'Строка "Количество" пуста.';
        await new Promise(resolve => setTimeout(resolve, 5000));
        escapingBallG.style.display = 'none';
      }
      if(responseProductOrder.message === 'notNumber') {
        escapingBallG.classList.add('notification');
        escapingBallG.style.width = '300px';
        escapingBallG.style.height = '50px';
        escapingBallG.innerHTML = 'Строка "количество" не является числом.';
        await new Promise(resolve => setTimeout(resolve, 5000));
        escapingBallG.style.display = 'none';
      }
      if(responseProductOrder.message === 'success') {
        escapingBallG.classList.add('notification');
        escapingBallG.style.width = '300px';
        escapingBallG.style.height = '50px';
        escapingBallG.style.color = '#0AFE23';
        escapingBallG.innerHTML = 'Товар заказан.';
        await new Promise(resolve => setTimeout(resolve, 5000));
        escapingBallG.style.display = 'none';
      }
      if(responseProductOrder.message === 'hasOrder') {
        escapingBallG.classList.add('notification');
        escapingBallG.style.width = '300px';
        escapingBallG.style.height = '50px';
        escapingBallG.style.color = 'black';
        escapingBallG.innerHTML = 'Товар такого типа уже выставлен. Измените количество в уже выставленном товаре.';
        await new Promise(resolve => setTimeout(resolve, 10000));
        escapingBallG.style.display = 'none';
      }
      if(responseProductOrder.message === 'limit') {
        escapingBallG.classList.add('notification');
        escapingBallG.style.width = '300px';
        escapingBallG.style.height = '50px';
        escapingBallG.style.color = 'black';
        escapingBallG.innerHTML = 'Вы заказали больше, чем есть у продавца.';
        await new Promise(resolve => setTimeout(resolve, 10000));
        escapingBallG.style.display = 'none';
      }
    })
    modal.append(
      labelid,
      spanid,
      labelSeller,
      spanSeller,
      labelGame,
      spanGame,
      labelRegion,
      spanRegion,
      labelServer,
      spanServer,
/*       labelPrice,
      spanPrice, */
      labelQuantity,
      inputQuantity,
      labelPrice,
      inputPrice,
      labelByuer,
      inputByuer,
      labelMethod,
      inputMethod,
      labelDiscription,
      inputDiscription,
      buttonContainer,
    );
    modal.appendChild(buttonContainer)
    return modal;
  }
  renderOrderModal() {
    if(this.data.status === 'new') {
      return this.renderStatusNew(this.data);
    }
    if(this.data.status === 'inwork') {
      return this.renderStatusInwork(this.data);
    }
    if(this.data.status === 'check') {
      return this.renderStatusCheck(this.data);
    }
    if(this.data.status === 'canceled') {
      return this.renderStatusCanceled(this.data);
    }
    if(this.data.status === 'done') {
      return this.renderStatusDone(this.data);
    }
  }
/////
  renderStatusNew(data) {
    const overlay = document.querySelector('.modal-overlay');
    overlay.style.display = 'flex';
    const modal = document.createElement('div');
    modal.id = 'admin-product-modal';
    modal.classList.add('admin-product-modal');
    modal.style.display = 'flex';
    const escapingBallG = document.getElementById('escapingBallG');
    const modalElement = new Elements(this.data);

    const labelSeller = modalElement.renderLabel('modal-seller', 'Продавец');
    const spanSeller = modalElement.renderSpan('modal-seller');
    spanSeller.textContent = data.seller[0];
    const labelServer = modalElement.renderLabel('modal-server', 'Сервер');
    const spanServer = modalElement.renderSpan('modal-server');
    spanServer.textContent = data.server[0];
    const labelAvailable = modalElement.renderLabel('modal-available', 'Количество');
    const spanAvailable = modalElement.renderSpan('modal-available');
    spanAvailable.textContent = data.available;
    const labelPrice = modalElement.renderLabel('modal-price', 'Цена');
    const spanPrice = modalElement.renderSpan('modal-price');
    spanPrice.textContent = data.price;
    const labelStatus = modalElement.renderLabel('modal-status', 'Статус');
    const selectStatus = modalElement.renderSelect('modal-status');
    ['new', 'inwork', 'check', 'canceled', 'done'].forEach(status => {
      const option = document.createElement('option');
      option.value = status;
      option.textContent = status;
      selectStatus.appendChild(option)
    })
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('modal-button-container');
    const modalButtonClose = document.createElement('button');
    modalButtonClose.classList.add('modal-button');
    modalButtonClose.textContent = 'Закрыть';
    const modalButtonSave = document.createElement('button');
    modalButtonSave.classList.add('modal-button');
    modalButtonSave.textContent = 'Сохранить';
    buttonContainer.append(modalButtonClose, modalButtonSave);
    modal.append(
      labelSeller,
      spanSeller,
      labelServer,
      spanServer,
      labelAvailable,
      spanAvailable,
      labelPrice,
      spanPrice,
      labelStatus,
      selectStatus
    );
    modalButtonClose.addEventListener('click', async(event) => {
      const overlay = document.querySelector('.modal-overlay');
      overlay.style.display = 'none';
      if(escapingBallG) {
        escapingBallG.style.display = 'none';
      }
      modal.remove();
    })
    modalButtonSave.addEventListener('click', async event => {
      escapingBallG.style.display = 'flex';
      const status = selectStatus.value;
      const seller = data.seller[0];
      const id = data.id;
      const server = data.server[0];
      const options = {
        method: 'POST',
        body: JSON.stringify({status, seller, id, server}),
        headers: {
          'Content-Type': 'application/json',
        }
      }
      const reqOrderSave = await fetch('/admin/changestatusorder', options);
      const resOrderSave = await reqOrderSave.json();
      if(resOrderSave.message === 'success') {
        escapingBallG.classList.add('notification');
        escapingBallG.style.width = '300px';
        escapingBallG.style.height = '50px';
        escapingBallG.style.color = 'black';
        escapingBallG.innerHTML = 'Сохранено';
        escapingBallG.style.display = 'flex';
        await new Promise(resolve => setTimeout(resolve, 10000));
        escapingBallG.style.display = 'none';
      }
    })

    modal.appendChild(buttonContainer)
    return modal;
  }
  renderStatusInwork(data) {
    const overlay = document.querySelector('.modal-overlay');
    overlay.style.display = 'flex';
    const modal = document.createElement('div');
    modal.id = 'admin-product-modal';
    modal.classList.add('admin-product-modal');
    modal.style.display = 'flex';
    const escapingBallG = document.getElementById('escapingBallG');
    const modalElement = new Elements(this.data);

    const labelSeller = modalElement.renderLabel('modal-seller', 'Продавец');
    const spanSeller = modalElement.renderSpan('modal-seller');
    spanSeller.textContent = data.seller[0];
    const labelServer = modalElement.renderLabel('modal-server', 'Сервер');
    const spanServer = modalElement.renderSpan('modal-server');
    spanServer.textContent = data.server[0];
    const labelAvailable = modalElement.renderLabel('modal-available', 'Количество');
    const spanAvailable = modalElement.renderSpan('modal-available');
    spanAvailable.textContent = data.available;
    const labelPrice = modalElement.renderLabel('modal-price', 'Цена');
    const spanPrice = modalElement.renderSpan('modal-price');
    spanPrice.textContent = data.price;
    const labelStatus = modalElement.renderLabel('modal-status', 'Статус');
    const selectStatus = modalElement.renderSelect('modal-status');
    ['new', 'inwork', 'check', 'canceled', 'done'].forEach(status => {
      const option = document.createElement('option');
      option.value = status;
      option.textContent = status;
      selectStatus.appendChild(option)
    })
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('modal-button-container');
    const modalButtonClose = document.createElement('button');
    modalButtonClose.classList.add('modal-button');
    modalButtonClose.textContent = 'Закрыть';
    const modalButtonSave = document.createElement('button');
    modalButtonSave.classList.add('modal-button');
    modalButtonSave.textContent = 'Сохранить';
    buttonContainer.append(modalButtonClose, modalButtonSave);
    modal.append(
      labelSeller,
      spanSeller,
      labelServer,
      spanServer,
      labelAvailable,
      spanAvailable,
      labelPrice,
      spanPrice,
      labelStatus,
      selectStatus
    );
    modalButtonClose.addEventListener('click', async(event) => {
      const overlay = document.querySelector('.modal-overlay');
      overlay.style.display = 'none';
      if(escapingBallG) {
        escapingBallG.style.display = 'none';
      }
      modal.remove();
    })
    modalButtonSave.addEventListener('click', async event => {
      escapingBallG.style.display = 'flex';
      const status = selectStatus.value;
      const seller = data.seller[0];
      const id = data.id;
      const server = data.server[0];
      const options = {
        method: 'POST',
        body: JSON.stringify({status, seller, id, server}),
        headers: {
          'Content-Type': 'application/json',
        }
      }
      const reqOrderSave = await fetch('/admin/changestatusorder', options);
      const resOrderSave = await reqOrderSave.json();
      if(resOrderSave.message === 'success') {
        escapingBallG.classList.add('notification');
        escapingBallG.style.width = '300px';
        escapingBallG.style.height = '50px';
        escapingBallG.style.color = 'black';
        escapingBallG.innerHTML = 'Сохранено';
        escapingBallG.style.display = 'flex';
        await new Promise(resolve => setTimeout(resolve, 10000));
        escapingBallG.style.display = 'none';
      }
    })

    modal.appendChild(buttonContainer)
    return modal;
  } 
  renderStatusCanceled(data) {
    const overlay = document.querySelector('.modal-overlay');
    overlay.style.display = 'flex';
    const modal = document.createElement('div');
    modal.id = 'admin-product-modal';
    modal.classList.add('admin-product-modal');
    modal.style.display = 'flex';
    const escapingBallG = document.getElementById('escapingBallG');
    const modalElement = new Elements(this.data);

    const labelSeller = modalElement.renderLabel('modal-seller', 'Продавец');
    const spanSeller = modalElement.renderSpan('modal-seller');
    spanSeller.textContent = data.seller[0];
    const labelServer = modalElement.renderLabel('modal-server', 'Сервер');
    const spanServer = modalElement.renderSpan('modal-server');
    spanServer.textContent = data.server[0];
    const labelAvailable = modalElement.renderLabel('modal-available', 'Количество');
    const spanAvailable = modalElement.renderSpan('modal-available');
    spanAvailable.textContent = data.available;
    const labelPrice = modalElement.renderLabel('modal-price', 'Цена');
    const spanPrice = modalElement.renderSpan('modal-price');
    spanPrice.textContent = data.price;
    const labelStatus = modalElement.renderLabel('modal-status', 'Статус');
    const selectStatus = modalElement.renderSelect('modal-status');
    ['new', 'inwork', 'check', 'canceled', 'done'].forEach(status => {
      const option = document.createElement('option');
      option.value = status;
      option.textContent = status;
      selectStatus.appendChild(option)
    })
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('modal-button-container');
    const modalButtonClose = document.createElement('button');
    modalButtonClose.classList.add('modal-button');
    modalButtonClose.textContent = 'Закрыть';
    const modalButtonSave = document.createElement('button');
    modalButtonSave.classList.add('modal-button');
    modalButtonSave.textContent = 'Сохранить';
    buttonContainer.append(modalButtonClose, modalButtonSave);
    modal.append(
      labelSeller,
      spanSeller,
      labelServer,
      spanServer,
      labelAvailable,
      spanAvailable,
      labelPrice,
      spanPrice,
      labelStatus,
      selectStatus
    );
    modalButtonClose.addEventListener('click', async(event) => {
      const overlay = document.querySelector('.modal-overlay');
      overlay.style.display = 'none';
      if(escapingBallG) {
        escapingBallG.style.display = 'none';
      }
      modal.remove();
    })
    modalButtonSave.addEventListener('click', async event => {
      escapingBallG.style.display = 'flex';
      const status = selectStatus.value;
      const seller = data.seller[0];
      const id = data.id;
      const server = data.server[0];
      const options = {
        method: 'POST',
        body: JSON.stringify({status, seller, id, server}),
        headers: {
          'Content-Type': 'application/json',
        }
      }
      const reqOrderSave = await fetch('/admin/changestatusorder', options);
      const resOrderSave = await reqOrderSave.json();
      if(resOrderSave.message === 'success') {
        escapingBallG.classList.add('notification');
        escapingBallG.style.width = '300px';
        escapingBallG.style.height = '50px';
        escapingBallG.style.color = 'black';
        escapingBallG.innerHTML = 'Сохранено';
        escapingBallG.style.display = 'flex';
        await new Promise(resolve => setTimeout(resolve, 10000));
        escapingBallG.style.display = 'none';
      }
    })

    modal.appendChild(buttonContainer)
    return modal;
  } 
  renderStatusDone(data) {
    const overlay = document.querySelector('.modal-overlay');
    overlay.style.display = 'flex';
    const modal = document.createElement('div');
    modal.id = 'admin-product-modal';
    modal.classList.add('admin-product-modal');
    modal.style.display = 'flex';
    const escapingBallG = document.getElementById('escapingBallG');
    const modalElement = new Elements(this.data);

    const labelSeller = modalElement.renderLabel('modal-seller', 'Продавец');
    const spanSeller = modalElement.renderSpan('modal-seller');
    spanSeller.textContent = data.seller[0];
    const labelServer = modalElement.renderLabel('modal-server', 'Сервер');
    const spanServer = modalElement.renderSpan('modal-server');
    spanServer.textContent = data.server[0];
    const labelAvailable = modalElement.renderLabel('modal-available', 'Количество');
    const spanAvailable = modalElement.renderSpan('modal-available');
    spanAvailable.textContent = data.available;
    const labelPrice = modalElement.renderLabel('modal-price', 'Цена');
    const spanPrice = modalElement.renderSpan('modal-price');
    spanPrice.textContent = data.price;
    const labelByer = modalElement.renderLabel('modal-price', 'Ник покупателя');
    const spanBuyer = modalElement.renderSpan('modal-price');
    spanBuyer.textContent = data.buyer;
    const labelProof = modalElement.renderLabel('modal-price', 'ССЫЛКА НА ПРОВЕРКУ');
    const spanProof = modalElement.renderSpan('modal-price');
    spanProof.textContent = data.proof;


    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('modal-button-container');
    const modalButtonClose = document.createElement('button');
    modalButtonClose.classList.add('modal-button');
    modalButtonClose.textContent = 'Закрыть';
    buttonContainer.append(modalButtonClose);
    modal.append(
      labelSeller,
      spanSeller,
      labelServer,
      spanServer,
      labelAvailable,
      spanAvailable,
      labelPrice,
      spanPrice,
      labelByer,
      spanBuyer,
      labelProof,
      spanProof,
    );
    modalButtonClose.addEventListener('click', async(event) => {
      const overlay = document.querySelector('.modal-overlay');
      overlay.style.display = 'none';
      if(escapingBallG) {
        escapingBallG.style.display = 'none';
      }
      modal.remove();
    })

    modal.appendChild(buttonContainer)
    return modal;
  }
  renderStatusCheck(data) { 
    const overlay = document.querySelector('.modal-overlay');
    overlay.style.display = 'flex';
    const modal = document.createElement('div');
    modal.id = 'admin-product-modal';
    modal.classList.add('admin-product-modal');
    modal.style.display = 'flex';
    const escapingBallG = document.getElementById('escapingBallG');
    const modalElement = new Elements(this.data);

    const labelSeller = modalElement.renderLabel('modal-seller', 'Продавец');
    const spanSeller = modalElement.renderSpan('modal-seller');
    spanSeller.textContent = data.seller[0];
    const labelServer = modalElement.renderLabel('modal-server', 'Сервер');
    const spanServer = modalElement.renderSpan('modal-server');
    spanServer.textContent = data.server[0];
    const labelAvailable = modalElement.renderLabel('modal-available', 'Количество');
    const spanAvailable = modalElement.renderSpan('modal-available');
    spanAvailable.textContent = data.available;
    const labelPrice = modalElement.renderLabel('modal-price', 'Цена');
    const spanPrice = modalElement.renderSpan('modal-price');
    spanPrice.textContent = data.price;
    const labelByer = modalElement.renderLabel('modal-price', 'Ник покупателя');
    const spanBuyer = modalElement.renderSpan('modal-price');
    spanBuyer.textContent = data.buyer;
    const labelProof = modalElement.renderLabel('modal-price', 'ССЫЛКА НА ПРОВЕРКУ');
    const spanProof = modalElement.renderSpan('modal-price');
    spanProof.textContent = data.proof;

    const labelStatus = modalElement.renderLabel('modal-status', 'Статус');
    const selectStatus = modalElement.renderSelect('modal-status');
    ['new', 'inwork', 'check', 'canceled', 'done'].forEach(status => {
      const option = document.createElement('option');
      option.value = status;
      option.textContent = status;
      selectStatus.appendChild(option)
    })
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('modal-button-container');
    const modalButtonClose = document.createElement('button');
    modalButtonClose.classList.add('modal-button');
    modalButtonClose.textContent = 'Закрыть';
    const modalButtonSave = document.createElement('button');
    modalButtonSave.classList.add('modal-button');
    modalButtonSave.textContent = 'Сохранить';
    buttonContainer.append(modalButtonClose, modalButtonSave);
    modal.append(
      labelSeller,
      spanSeller,
      labelServer,
      spanServer,
      labelAvailable,
      spanAvailable,
      labelPrice,
      spanPrice,
      labelByer,
      spanBuyer,
      labelProof,
      spanProof,
      labelStatus,
      selectStatus
    );
    modalButtonClose.addEventListener('click', async(event) => {
      const overlay = document.querySelector('.modal-overlay');
      overlay.style.display = 'none';
      if(escapingBallG) {
        escapingBallG.style.display = 'none';
      }
      modal.remove();
    })
    modalButtonSave.addEventListener('click', async event => {
      escapingBallG.style.display = 'flex';
      const status = selectStatus.value;
      const seller = data.seller[0];
      const id = data.id;
      const server = data.server[0];
      const options = {
        method: 'POST',
        body: JSON.stringify({status, seller, id, server}),
        headers: {
          'Content-Type': 'application/json',
        }
      }
      const reqOrderSave = await fetch('/admin/changestatusorder', options);
      const resOrderSave = await reqOrderSave.json();

      if(resOrderSave.message === 'success') {
        escapingBallG.classList.add('notification');
        escapingBallG.style.width = '300px';
        escapingBallG.style.height = '50px';
        escapingBallG.style.color = 'black';
        escapingBallG.innerHTML = 'Сохранено';
        escapingBallG.style.display = 'flex';
        await new Promise(resolve => setTimeout(resolve, 10000));
        escapingBallG.style.display = 'none';
      }
    })

    modal.appendChild(buttonContainer)
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
}