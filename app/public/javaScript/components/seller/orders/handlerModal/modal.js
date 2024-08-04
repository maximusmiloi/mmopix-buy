import { Elements } from './modalElement.js';
export class Modal { 
  constructor(data) {
    this.data = data;
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
    modal.style.height = '70%';
    modal.id = 'seller-order-modal';
    modal.classList.add('seller-order-modal');
    modal.style.display = 'flex';
    const escapingBallG = document.getElementById('escapingBallG');
    const modalElement = new Elements(this.data);

    const spanIdOrder = modalElement.renderSpan('modal-id');
    spanIdOrder.textContent = `Номер заказа: #${data.id}`

    const modalGameContainer = document.createElement('div');
    modalGameContainer.classList.add('modal-row-container');
    const labelGame = modalElement.renderLabel('modal-game', 'Игра');
    const spanGame = modalElement.renderSpan('modal-game');
    spanGame.textContent = data.game[0];
    modalGameContainer.append(labelGame, spanGame);

    const modalTypeContainer = document.createElement('div');
    modalTypeContainer.classList.add('modal-row-container');
    const labelType = modalElement.renderLabel('modal-type', 'Тип');
    const spanType = modalElement.renderSpan('modal-type');
    spanType.textContent = data.type;
    modalTypeContainer.append(labelType, spanType);

    const modalServerContainer = document.createElement('div');
    modalServerContainer.classList.add('modal-row-container');
    const labelServer = modalElement.renderLabel('modal-server', 'Сервер');
    const spanServer = modalElement.renderSpan('modal-server');
    spanServer.textContent = data.server[0];
    modalServerContainer.append(labelServer, spanServer);

    const modalMethodContainer = document.createElement('div');
    modalMethodContainer.classList.add('modal-row-container');
    const labelMethod = modalElement.renderLabel('modal-method', 'Метод доставка');
    const spanMethod = modalElement.renderSpan('modal-method');
    spanMethod.textContent = data.method;
    modalMethodContainer.append(labelMethod, spanMethod);

    const modalQuantityContainer = document.createElement('div');
    modalQuantityContainer.classList.add('modal-row-container');
    const labelQuantity = modalElement.renderLabel('modal-quantity', 'Количество');
    const pQuantity = modalElement.renderP('modal-quantity-p');
    pQuantity.textContent = data.available;
    modalQuantityContainer.append(labelQuantity, pQuantity);

    const modalPriceContainer = document.createElement('div');
    modalPriceContainer.classList.add('modal-row-container');
    const labelPrice = modalElement.renderLabel('modal-price', 'Оплата за заказ');
    const pPrice = modalElement.renderP('modal-price-p');
    pPrice.textContent = `${data.price} $`;
    modalPriceContainer.append(labelPrice, pPrice);


    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('modal-button-container');
    const modalButtonClose = document.createElement('div');
    modalButtonClose.classList.add('close-btn');
    const line1Container = document.createElement('div');
    line1Container.classList.add('line');
    line1Container.classList.add('line1');
    const line2Container = document.createElement('div');
    line2Container.classList.add('line2');
    line2Container.classList.add('line');
    modalButtonClose.append(line1Container, line2Container);
    /* modalButtonClose.classList.add('modal-button'); */
    
    /* modalButtonClose.textContent = 'Закрыть'; */
    const modalButtonDenied = document.createElement('button');
    modalButtonDenied.classList.add('modal-button');
    modalButtonDenied.style.color = 'red';
    modalButtonDenied.textContent = 'Отказаться';

    const modalButtonAccept = document.createElement('button');
    modalButtonAccept.classList.add('modal-button');
    modalButtonAccept.textContent = 'Принять';
    buttonContainer.append(modalButtonClose, modalButtonDenied, modalButtonAccept);
    modal.append(
      spanIdOrder,
      modalGameContainer,
      modalTypeContainer,
      modalServerContainer,
      modalMethodContainer,
      modalQuantityContainer,
      modalPriceContainer
    );
    modalButtonClose.addEventListener('click', async(event) => {
      const overlay = document.querySelector('.modal-overlay');
      overlay.style.display = 'none';
      if(escapingBallG) {
        escapingBallG.style.display = 'none';
      }
      modal.remove();
    })

    modalButtonDenied.addEventListener('click', async event => {
      //escapingBallG.style.display = 'flex';
      const seller = data.seller[0];
      const id = data.id;
      const server = data.server[0];
      modal.remove();
      const options = {
        method: 'POST',
        body: JSON.stringify({seller, id, server}),
        headers: {
          'Content-Type': 'application/json',
        }
      }
      const reqOrderAccpet = await fetch('/seller/deniedorder', options);
      const resOrderAccpet = await reqOrderAccpet.json();

      if(resOrderAccpet.message === 'success') {
        modal.remove();
        location.reload();
      }
/*       if(resOrderSave.message === 'success') {
        escapingBallG.classList.add('notification');
        escapingBallG.style.width = '300px';
        escapingBallG.style.height = '50px';
        escapingBallG.style.color = 'black';
        escapingBallG.innerHTML = 'Сохранено';
        escapingBallG.style.display = 'flex';
        await new Promise(resolve => setTimeout(resolve, 10000));
        escapingBallG.style.display = 'none';
      } */
    })
    modalButtonAccept.addEventListener('click', async event => {
      //escapingBallG.style.display = 'flex';
      const seller = data.seller[0];
      const id = data.id;
      const server = data.server[0];
      modal.remove();
      const options = {
        method: 'POST',
        body: JSON.stringify({seller, id, server}),
        headers: {
          'Content-Type': 'application/json',
        }
      }
      const reqOrderAccpet = await fetch('/seller/acceptorder', options);
      const resOrderAccpet = await reqOrderAccpet.json();

      if(resOrderAccpet.message === 'success') {
        this.renderStatusInwork(data);
      }
/*       if(resOrderSave.message === 'success') {
        escapingBallG.classList.add('notification');
        escapingBallG.style.width = '300px';
        escapingBallG.style.height = '50px';
        escapingBallG.style.color = 'black';
        escapingBallG.innerHTML = 'Сохранено';
        escapingBallG.style.display = 'flex';
        await new Promise(resolve => setTimeout(resolve, 10000));
        escapingBallG.style.display = 'none';
      } */
    })

    modal.appendChild(buttonContainer)
    return modal;
  }
  renderStatusInwork(data) {

    const contentContainer = document.querySelector('.order-content-container');
    const overlay = document.querySelector('.modal-overlay');
    overlay.style.display = 'flex';
    const modal = document.createElement('div');
    modal.style.height = '70%';
    modal.style.width = '80%';
    modal.id = 'seller-order-modal';
    modal.classList.add('seller-order-modal');
    modal.style.display = 'flex';
    const escapingBallG = document.getElementById('escapingBallG');
    const modalElement = new Elements(this.data);


    const modalContent = document.createElement('div');
    modalContent.classList.add('seller-order-modal-content');
    modal.appendChild(modalContent)

    const modalContentLeft = document.createElement('div');
    modalContentLeft.classList.add('seller-order-modal-content-left');

    const modalContentRight = document.createElement('div');
    modalContentRight.classList.add('seller-order-modal-content-right');
    modalContent.append(modalContentLeft, modalContentRight)
////Left
    const spanIdOrder = modalElement.renderSpan('modal-id');
    spanIdOrder.textContent = `Номер заказа: #${data.id}`

    const modalGameContainer = document.createElement('div');
    modalGameContainer.classList.add('modal-row-container');
    const labelGame = modalElement.renderLabel('modal-game', 'Игра');
    const spanGame = modalElement.renderSpan('modal-game');
    spanGame.textContent = data.game[0];
    modalGameContainer.append(labelGame, spanGame);

    const modalTypeContainer = document.createElement('div');
    modalTypeContainer.classList.add('modal-row-container');
    const labelType = modalElement.renderLabel('modal-type', 'Тип');
    const spanType = modalElement.renderSpan('modal-type');
    spanType.textContent = data.type;
    modalTypeContainer.append(labelType, spanType);

    const modalServerContainer = document.createElement('div');
    modalServerContainer.classList.add('modal-row-container');
    const labelServer = modalElement.renderLabel('modal-server', 'Сервер');
    const spanServer = modalElement.renderSpan('modal-server');
    spanServer.textContent = data.server[0];
    modalServerContainer.append(labelServer, spanServer);

    const modalMethodContainer = document.createElement('div');
    modalMethodContainer.classList.add('modal-row-container');
    const labelMethod = modalElement.renderLabel('modal-method', 'Метод доставка');
    const spanMethod = modalElement.renderSpan('modal-method');
    spanMethod.textContent = data.method;
    modalMethodContainer.append(labelMethod, spanMethod);

    const modalQuantityContainer = document.createElement('div');
    modalQuantityContainer.classList.add('modal-row-container');
    const labelQuantity = modalElement.renderLabel('modal-quantity', 'Количество');
    const pQuantity = modalElement.renderP('modal-quantity-p');
    pQuantity.textContent = data.available;
    modalQuantityContainer.append(labelQuantity, pQuantity);

    const modalPriceContainer = document.createElement('div');
    modalPriceContainer.classList.add('modal-row-container');
    const labelPrice = modalElement.renderLabel('modal-price', 'Оплата за заказ');
    const pPrice = modalElement.renderP('modal-price-p');
    pPrice.textContent = `${data.price} $`;
    modalPriceContainer.append(labelPrice, pPrice);
///
///Right
    const modalNicknameContainer = document.createElement('div');
    modalNicknameContainer.classList.add('modal-row-container');
    const labelNickname = modalElement.renderLabel('modal-nick', 'Никнейм покупателя:');
    const spanNickname = modalElement.renderSpan('modal-nick');
    spanNickname.textContent = data.buyer;
    modalNicknameContainer.append(labelNickname, spanNickname);

    const modalDiscriptionContainer = document.createElement('div');
    modalDiscriptionContainer.classList.add('modal-row-container');
    const labelDiscription = modalElement.renderLabel('modal-discription', 'Примечание:');
    const spanDiscription = modalElement.renderSpan('modal-discription');
    spanDiscription.style.height = '100%';
    spanDiscription.textContent = data.discription;
    modalDiscriptionContainer.append(labelDiscription, spanDiscription);

    const modalInfoContainer = document.createElement('div');
    modalInfoContainer.classList.add('modal-row-container');
    const plInfo = modalElement.renderLabel('modal-info', 'Сервис для залива видео с пруфами:');
    const pInfo = modalElement.renderP('modal-info');
    pInfo.style.height = '100%';
    pInfo.style.fontSize = '16px';
    pInfo.style.color = '#229ED9';
    pInfo.textContent = 'files.fm';
    modalInfoContainer.append(plInfo, pInfo);

    const modalProofContainer = document.createElement('div');
    modalProofContainer.classList.add('modal-row-container');
    const labelProof = modalElement.renderLabel('modal-proof', 'Ссылка на видео:');
    const inputProof = modalElement.renderInput('modal-proof-input');

    modalProofContainer.append(labelProof, inputProof);

    modalContentRight.append(modalNicknameContainer, modalDiscriptionContainer, modalInfoContainer, modalProofContainer)
///
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('modal-button-container');

    const modalButtonClose = document.createElement('div');
    modalButtonClose.classList.add('close-btn');
    const line1Container = document.createElement('div');
    line1Container.classList.add('line');
    line1Container.classList.add('line1');
    const line2Container = document.createElement('div');
    line2Container.classList.add('line2');
    line2Container.classList.add('line');
    modalButtonClose.append(line1Container, line2Container);

    const modalButtonSupport = document.createElement('button');
    modalButtonSupport.classList.add('modal-button');
    modalButtonSupport.textContent = 'Помощь (TG)';
    modalButtonSupport.style.color = 'white';
    modalButtonSupport.addEventListener('click', event => {
      window.open(`https://t.me/Mmopix_shop`, '_blank');
    })

    const modalButtonDenied = document.createElement('button');
    modalButtonDenied.classList.add('modal-button');
    modalButtonDenied.style.color = 'White';
    modalButtonDenied.textContent = 'Отказаться';

    const modalButtonDone = document.createElement('button');
    modalButtonDone.classList.add('modal-button');
    modalButtonDone.textContent = 'Готово';


    buttonContainer.append(modalButtonSupport, modalButtonClose, modalButtonDenied,  modalButtonDone);
    modalContentLeft.append(
      spanIdOrder,
      modalGameContainer,
      modalTypeContainer,
      modalServerContainer,
      modalMethodContainer,
      modalQuantityContainer,
      modalPriceContainer
    );
    modalButtonClose.addEventListener('click', async(event) => {
      const overlay = document.querySelector('.modal-overlay');
      overlay.style.display = 'none';
      if(escapingBallG) {
        escapingBallG.style.display = 'none';
      }
      modal.remove();
    })
    modalButtonDenied.addEventListener('click', async event => {
      escapingBallG.style.display = 'flex';
      const seller = data.seller[0];
      const id = data.id;
      const server = data.server[0];
      const proof = inputProof.value;
      const options = {
        method: 'POST',
        body: JSON.stringify({seller, id, server, proof}),
        headers: {
          'Content-Type': 'application/json',
        }
      }
      const reqOrderDone = await fetch('/seller/deniedorder', options);
      const resOrderDone = await reqOrderDone.json();

      if(resOrderDone.message === 'success') {
        modal.remove();
        location.reload();
      }
    })
    modalButtonDone.addEventListener('click', async event => {
      escapingBallG.style.display = 'flex';
      const seller = data.seller[0];
      const id = data.id;
      const server = data.server[0];
      const proof = inputProof.value;
      const options = {
        method: 'POST',
        body: JSON.stringify({seller, id, server, proof}),
        headers: {
          'Content-Type': 'application/json',
        }
      }
      const reqOrderDone = await fetch('/seller/doneorder', options);
      const resOrderDone = await reqOrderDone.json();

      if(resOrderDone.message === 'success') {
        modal.remove();
        location.reload();
      }
    })

    modalContentRight.appendChild(buttonContainer);
    contentContainer.appendChild(modal);
    return modal;
  } 
  renderStatusCanceled(data) {

    const overlay = document.querySelector('.modal-overlay');
    overlay.style.display = 'flex';
    const modal = document.createElement('div');
    modal.style.height = '70%';
    modal.id = 'seller-order-modal';
    modal.classList.add('seller-order-modal');
    modal.style.display = 'flex';
    const escapingBallG = document.getElementById('escapingBallG');
    const modalElement = new Elements(this.data);

    const spanIdOrder = modalElement.renderSpan('modal-id');
    spanIdOrder.textContent = `Номер заказа: #${data.id}`

    const modalGameContainer = document.createElement('div');
    modalGameContainer.classList.add('modal-row-container');
    const labelGame = modalElement.renderLabel('modal-game', 'Игра');
    const spanGame = modalElement.renderSpan('modal-game');
    spanGame.textContent = data.game[0];
    modalGameContainer.append(labelGame, spanGame);

    const modalTypeContainer = document.createElement('div');
    modalTypeContainer.classList.add('modal-row-container');
    const labelType = modalElement.renderLabel('modal-type', 'Тип');
    const spanType = modalElement.renderSpan('modal-type');
    spanType.textContent = data.type;
    modalTypeContainer.append(labelType, spanType);

    const modalServerContainer = document.createElement('div');
    modalServerContainer.classList.add('modal-row-container');
    const labelServer = modalElement.renderLabel('modal-server', 'Сервер');
    const spanServer = modalElement.renderSpan('modal-server');
    spanServer.textContent = data.server[0];
    modalServerContainer.append(labelServer, spanServer);

    const modalMethodContainer = document.createElement('div');
    modalMethodContainer.classList.add('modal-row-container');
    const labelMethod = modalElement.renderLabel('modal-method', 'Метод доставка');
    const spanMethod = modalElement.renderSpan('modal-method');
    spanMethod.textContent = data.method;
    modalMethodContainer.append(labelMethod, spanMethod);

    const modalQuantityContainer = document.createElement('div');
    modalQuantityContainer.classList.add('modal-row-container');
    const labelQuantity = modalElement.renderLabel('modal-quantity', 'Количество');
    const pQuantity = modalElement.renderP('modal-quantity-p');
    pQuantity.textContent = data.available;
    modalQuantityContainer.append(labelQuantity, pQuantity);

    const modalPriceContainer = document.createElement('div');
    modalPriceContainer.classList.add('modal-row-container');
    const labelPrice = modalElement.renderLabel('modal-price', 'Оплата за заказ');
    const pPrice = modalElement.renderP('modal-price-p');
    pPrice.textContent = `${data.price} $`;
    modalPriceContainer.append(labelPrice, pPrice);


    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('modal-button-container');

    const modalButtonClose = document.createElement('div');
    modalButtonClose.classList.add('close-btn');
    const line1Container = document.createElement('div');
    line1Container.classList.add('line');
    line1Container.classList.add('line1');
    const line2Container = document.createElement('div');
    line2Container.classList.add('line2');
    line2Container.classList.add('line');
    modalButtonClose.append(line1Container, line2Container);

    buttonContainer.append(modalButtonClose);
    modal.append(
      spanIdOrder,
      modalGameContainer,
      modalTypeContainer,
      modalServerContainer,
      modalMethodContainer,
      modalQuantityContainer,
      modalPriceContainer
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
  renderStatusDone(data) {

    const contentContainer = document.querySelector('.order-content-container');
    const overlay = document.querySelector('.modal-overlay');
    overlay.style.display = 'flex';
    const modal = document.createElement('div');
    modal.style.height = '70%';
    modal.style.width = '80%';
    modal.id = 'seller-order-modal';
    modal.classList.add('seller-order-modal');
    modal.style.display = 'flex';
    const escapingBallG = document.getElementById('escapingBallG');
    const modalElement = new Elements(this.data);


    const modalContent = document.createElement('div');
    modalContent.classList.add('seller-order-modal-content');
    modal.appendChild(modalContent)

    const modalContentLeft = document.createElement('div');
    modalContentLeft.classList.add('seller-order-modal-content-left');

    const modalContentRight = document.createElement('div');
    modalContentRight.classList.add('seller-order-modal-content-right');
    modalContent.append(modalContentLeft, modalContentRight)
////Left
    const spanIdOrder = modalElement.renderSpan('modal-id');
    spanIdOrder.textContent = `Номер заказа: #${data.id}`

    const modalGameContainer = document.createElement('div');
    modalGameContainer.classList.add('modal-row-container');
    const labelGame = modalElement.renderLabel('modal-game', 'Игра');
    const spanGame = modalElement.renderSpan('modal-game');
    spanGame.textContent = data.game[0];
    modalGameContainer.append(labelGame, spanGame);

    const modalTypeContainer = document.createElement('div');
    modalTypeContainer.classList.add('modal-row-container');
    const labelType = modalElement.renderLabel('modal-type', 'Тип');
    const spanType = modalElement.renderSpan('modal-type');
    spanType.textContent = data.type;
    modalTypeContainer.append(labelType, spanType);

    const modalServerContainer = document.createElement('div');
    modalServerContainer.classList.add('modal-row-container');
    const labelServer = modalElement.renderLabel('modal-server', 'Сервер');
    const spanServer = modalElement.renderSpan('modal-server');
    spanServer.textContent = data.server[0];
    modalServerContainer.append(labelServer, spanServer);

    const modalMethodContainer = document.createElement('div');
    modalMethodContainer.classList.add('modal-row-container');
    const labelMethod = modalElement.renderLabel('modal-method', 'Метод доставка');
    const spanMethod = modalElement.renderSpan('modal-method');
    spanMethod.textContent = data.method;
    modalMethodContainer.append(labelMethod, spanMethod);

    const modalQuantityContainer = document.createElement('div');
    modalQuantityContainer.classList.add('modal-row-container');
    const labelQuantity = modalElement.renderLabel('modal-quantity', 'Количество');
    const pQuantity = modalElement.renderP('modal-quantity-p');
    pQuantity.textContent = data.available;
    modalQuantityContainer.append(labelQuantity, pQuantity);

    const modalPriceContainer = document.createElement('div');
    modalPriceContainer.classList.add('modal-row-container');
    const labelPrice = modalElement.renderLabel('modal-price', 'Оплата за заказ');
    const pPrice = modalElement.renderP('modal-price-p');
    pPrice.textContent = `${data.price} $`;
    modalPriceContainer.append(labelPrice, pPrice);
///
///Right
    const modalNicknameContainer = document.createElement('div');
    modalNicknameContainer.classList.add('modal-row-container');
    const labelNickname = modalElement.renderLabel('modal-nick', 'Никнейм покупателя:');
    const spanNickname = modalElement.renderSpan('modal-nick');
    spanNickname.textContent = data.buyer;
    modalNicknameContainer.append(labelNickname, spanNickname);

    const modalDiscriptionContainer = document.createElement('div');
    modalDiscriptionContainer.classList.add('modal-row-container');
    const labelDiscription = modalElement.renderLabel('modal-discription', 'Примечание:');
    const spanDiscription = modalElement.renderSpan('modal-discription');
    spanDiscription.style.height = '100%';
    spanDiscription.textContent = data.discription;
    modalDiscriptionContainer.append(labelDiscription, spanDiscription);

    const modalInfoContainer = document.createElement('div');
    modalInfoContainer.classList.add('modal-row-container');
    const plInfo = modalElement.renderLabel('modal-info', 'Сервис для залива видео с пруфами:');
    const pInfo = modalElement.renderP('modal-info');
    pInfo.style.height = '100%';
    pInfo.style.fontSize = '16px';
    pInfo.style.color = '#229ED9';
    pInfo.textContent = 'files.fm';
    modalInfoContainer.append(plInfo, pInfo);

    const modalProofContainer = document.createElement('div');
    modalProofContainer.classList.add('modal-row-container');
    const labelProof = modalElement.renderLabel('modal-proof', 'Ссылка на видео:');
    const spanProof = modalElement.renderSpan('modal-proof-span');
    spanProof.textContent = data.proof;
    modalProofContainer.append(labelProof, spanProof);

    modalContentRight.append(modalNicknameContainer, modalDiscriptionContainer, modalInfoContainer, modalProofContainer);
///
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('modal-button-container');

    const modalButtonClose = document.createElement('div');
    modalButtonClose.classList.add('close-btn');
    const line1Container = document.createElement('div');
    line1Container.classList.add('line');
    line1Container.classList.add('line1');
    const line2Container = document.createElement('div');
    line2Container.classList.add('line2');
    line2Container.classList.add('line');

    modalButtonClose.append(line1Container, line2Container);
    const modalButtonSupport = document.createElement('button');
    modalButtonSupport.classList.add('modal-button');
    modalButtonSupport.textContent = 'Помощь (TG)';
    modalButtonSupport.style.color = 'white';
    modalButtonSupport.addEventListener('click', event => {
      window.open(`https://t.me/Mmopix_shop`, '_blank');
    })
    const modalButtonDone = document.createElement('button');
    modalButtonDone.classList.add('modal-button');
    modalButtonDone.textContent = 'Готово';
    buttonContainer.append(modalButtonSupport, modalButtonClose);
    modalContentLeft.append(
      spanIdOrder,
      modalGameContainer,
      modalTypeContainer,
      modalServerContainer,
      modalMethodContainer,
      modalQuantityContainer,
      modalPriceContainer
    );
    modalButtonClose.addEventListener('click', async(event) => {
      const overlay = document.querySelector('.modal-overlay');
      overlay.style.display = 'none';
      if(escapingBallG) {
        escapingBallG.style.display = 'none';
      }
      modal.remove();
    })
    modalContentRight.appendChild(buttonContainer);
    contentContainer.appendChild(modal);
    return modal;
  }
  renderStatusCheck(data) { 

    const contentContainer = document.querySelector('.order-content-container');
    const overlay = document.querySelector('.modal-overlay');
    overlay.style.display = 'flex';
    const modal = document.createElement('div');
    modal.style.height = '70%';
    modal.style.width = '80%';
    modal.id = 'seller-order-modal';
    modal.classList.add('seller-order-modal');
    modal.style.display = 'flex';
    const escapingBallG = document.getElementById('escapingBallG');
    const modalElement = new Elements(this.data);


    const modalContent = document.createElement('div');
    modalContent.classList.add('seller-order-modal-content');
    modal.appendChild(modalContent)

    const modalContentLeft = document.createElement('div');
    modalContentLeft.classList.add('seller-order-modal-content-left');

    const modalContentRight = document.createElement('div');
    modalContentRight.classList.add('seller-order-modal-content-right');
    modalContent.append(modalContentLeft, modalContentRight)
////Left
    const spanIdOrder = modalElement.renderSpan('modal-id');
    spanIdOrder.textContent = `Номер заказа: #${data.id}`

    const modalGameContainer = document.createElement('div');
    modalGameContainer.classList.add('modal-row-container');
    const labelGame = modalElement.renderLabel('modal-game', 'Игра');
    const spanGame = modalElement.renderSpan('modal-game');
    spanGame.textContent = data.game[0];
    modalGameContainer.append(labelGame, spanGame);

    const modalTypeContainer = document.createElement('div');
    modalTypeContainer.classList.add('modal-row-container');
    const labelType = modalElement.renderLabel('modal-type', 'Тип');
    const spanType = modalElement.renderSpan('modal-type');
    spanType.textContent = data.type;
    modalTypeContainer.append(labelType, spanType);

    const modalServerContainer = document.createElement('div');
    modalServerContainer.classList.add('modal-row-container');
    const labelServer = modalElement.renderLabel('modal-server', 'Сервер');
    const spanServer = modalElement.renderSpan('modal-server');
    spanServer.textContent = data.server[0];
    modalServerContainer.append(labelServer, spanServer);

    const modalMethodContainer = document.createElement('div');
    modalMethodContainer.classList.add('modal-row-container');
    const labelMethod = modalElement.renderLabel('modal-method', 'Метод доставка');
    const spanMethod = modalElement.renderSpan('modal-method');
    spanMethod.textContent = data.method;
    modalMethodContainer.append(labelMethod, spanMethod);

    const modalQuantityContainer = document.createElement('div');
    modalQuantityContainer.classList.add('modal-row-container');
    const labelQuantity = modalElement.renderLabel('modal-quantity', 'Количество');
    const pQuantity = modalElement.renderP('modal-quantity-p');
    pQuantity.textContent = data.available;
    modalQuantityContainer.append(labelQuantity, pQuantity);

    const modalPriceContainer = document.createElement('div');
    modalPriceContainer.classList.add('modal-row-container');
    const labelPrice = modalElement.renderLabel('modal-price', 'Оплата за заказ');
    const pPrice = modalElement.renderP('modal-price-p');
    pPrice.textContent = `${data.price} $`;
    modalPriceContainer.append(labelPrice, pPrice);
///
///Right
    const modalNicknameContainer = document.createElement('div');
    modalNicknameContainer.classList.add('modal-row-container');
    const labelNickname = modalElement.renderLabel('modal-nick', 'Никнейм покупателя:');
    const spanNickname = modalElement.renderSpan('modal-nick');
    spanNickname.textContent = data.buyer;
    modalNicknameContainer.append(labelNickname, spanNickname);

    const modalDiscriptionContainer = document.createElement('div');
    modalDiscriptionContainer.classList.add('modal-row-container');
    const labelDiscription = modalElement.renderLabel('modal-discription', 'Примечание:');
    const spanDiscription = modalElement.renderSpan('modal-discription');
    spanDiscription.style.height = '100%';
    spanDiscription.textContent = data.discription;
    modalDiscriptionContainer.append(labelDiscription, spanDiscription);

    const modalInfoContainer = document.createElement('div');
    modalInfoContainer.classList.add('modal-row-container');
    const plInfo = modalElement.renderLabel('modal-info', 'Сервис для залива видео с пруфами:');
    const pInfo = modalElement.renderP('modal-info');
    pInfo.style.height = '100%';
    pInfo.style.fontSize = '16px';
    pInfo.style.color = '#229ED9';
    pInfo.textContent = 'files.fm';
    modalInfoContainer.append(plInfo, pInfo);

    const modalProofContainer = document.createElement('div');
    modalProofContainer.classList.add('modal-row-container');
    const labelProof = modalElement.renderLabel('modal-proof', 'Ссылка на видео:');
    const spanProof = modalElement.renderSpan('modal-proof-span');
    spanProof.textContent = data.proof;
    modalProofContainer.append(labelProof, spanProof);

    modalContentRight.append(modalNicknameContainer, modalDiscriptionContainer, modalInfoContainer, modalProofContainer);
///
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('modal-button-container');

    const modalButtonClose = document.createElement('div');
    modalButtonClose.classList.add('close-btn');
    const line1Container = document.createElement('div');
    line1Container.classList.add('line');
    line1Container.classList.add('line1');
    const line2Container = document.createElement('div');
    line2Container.classList.add('line2');
    line2Container.classList.add('line');
    modalButtonClose.append(line1Container, line2Container);

    const modalButtonSupport = document.createElement('button');
    modalButtonSupport.classList.add('modal-button');
    modalButtonSupport.textContent = 'Помощь (TG)';
    modalButtonSupport.style.color = 'white';
    modalButtonSupport.addEventListener('click', event => {
      window.open(`https://t.me/Mmopix_shop`, '_blank');
    })
    const modalButtonDone = document.createElement('button');
    modalButtonDone.classList.add('modal-button');
    modalButtonDone.textContent = 'Готово';
    buttonContainer.append(modalButtonSupport, modalButtonClose);
    modalContentLeft.append(
      spanIdOrder,
      modalGameContainer,
      modalTypeContainer,
      modalServerContainer,
      modalMethodContainer,
      modalQuantityContainer,
      modalPriceContainer
    );
    modalButtonClose.addEventListener('click', async(event) => {
      const overlay = document.querySelector('.modal-overlay');
      overlay.style.display = 'none';
      if(escapingBallG) {
        escapingBallG.style.display = 'none';
      }
      modal.remove();
    })
    modalContentRight.appendChild(buttonContainer);
    contentContainer.appendChild(modal);
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