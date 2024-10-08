import { Elements } from './elements.js';
export class Modal { 
  constructor(data) {
    this.data = data;
  }
  render(text, id) {
    const elements = new Elements();
    const modal = document.createElement('div');
    modal.id = 'modal';
    modal.classList.add('modal');
    modal.style.width = '500px';
    modal.style.height = '40%';
    modal.style.display = 'flex';
    const spanUser = elements.renderSpan('admin-finances-span-user');
    spanUser.innerHTML = `<span style="color:orange">ПОЛЬЗОВАТЕЛЬ</span>:   ${this.data.user}`;
    modal.appendChild(spanUser);
    const spanMethod = elements.renderSpan('admin-finances-span-method');
    spanMethod.innerHTML = `<span style="color:orange">МЕТОД</span>:   ${this.data.method}`;
    modal.appendChild(spanMethod);
    const spanValue = elements.renderSpan('admin-finances-span-value');
    spanValue.innerHTML = `<span style="color:orange">СУММА</span>:   ${this.data.value}`;
    modal.appendChild(spanValue);
    const spanRequisites = elements.renderSpan('admin-finances-span-requisites');
    spanRequisites.innerHTML = `<span style="color:orange">РЕКВИЗИТЫ</span>:   ${this.data.requisites}`;
    modal.appendChild(spanRequisites);

    const textElement = document.createElement('div');
    textElement.textContent = text;
    modal.append(text);
    const select = document.createElement('select');
    ['inwork', 'canceled', 'done' ].forEach(status => {
      const option = document.createElement('option');
      option.textContent = status;
      option.value = status;
      select.appendChild(option);
    })
    modal.appendChild(select);
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('modal-button-container');
    const modalButtonClose = document.createElement('button');
    modalButtonClose.classList.add('modal-button');
    modalButtonClose.textContent = 'Отмена';
    const modalButtonOrder = document.createElement('button');
    modalButtonOrder.classList.add('modal-button');
    modalButtonOrder.id = id;
    modalButtonOrder.textContent = 'Изменить';
    buttonContainer.append(modalButtonClose, modalButtonOrder);

    modalButtonClose.addEventListener('click', event => {
      const overlay = document.querySelector('.modal-overlay');
      overlay.style.display = 'none';
      if(escapingBallG) {
        escapingBallG.style.display = 'none';
      }
      modal.remove();
    })
    modalButtonOrder.addEventListener('click', async event => {
      const selectValue = select.value;
      const user = this.data.user;
      const id = this.data.id;
      const value = this.data.value;
      const options = {
        method: 'POST',
        body: JSON.stringify({selectValue, user, id, value}),
        headers: {
          'Content-Type': 'application/json',
        }
      }
      const reqChangeStatus = await fetch(`/admin/changestatuspayment`, options);
      const resChangeStatus = await reqChangeStatus.json();
      if(resChangeStatus.message === 'success') {
        modal.remove();
      }
    });
    modal.append(buttonContainer);
    return modal;
  }
  async renderNotification(text, nameMethod) {
    const modal = document.createElement('div');
    modal.id = 'seller-product-modal';
    modal.classList.add('seller-product-modal');
    modal.style.width = '300px';
    modal.style.height = '200px';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    const textElement = document.createElement('div');
    textElement.textContent = text;
    modal.append(text);

    const buttonContainer = document.createElement('div');
    buttonContainer.style.width = '100%';
    buttonContainer.classList.add('modal-button-container');
    const modalButtonClose = document.createElement('button');
    modalButtonClose.classList.add('modal-button');
    modalButtonClose.textContent = 'Закрыть';
    buttonContainer.append(modalButtonClose);

    modalButtonClose.addEventListener('click', event => {
      const overlay = document.querySelector('.modal-overlay');
      overlay.style.display = 'none';
      if(escapingBallG) {
        escapingBallG.style.display = 'none';
      }
      modal.remove();
    })
    const modalButtonDelete = document.createElement('button');
    modalButtonDelete.classList.add('modal-button-delete-game');
    modalButtonDelete.textContent = 'Удалить';
    buttonContainer.append(modalButtonDelete);

    modalButtonDelete.addEventListener('click', async event => {
      const optionsCreateGame = {
        method: 'POST',
        body: JSON.stringify({nameMethod}),
        headers: {
          'Content-Type': 'application/json',
        }
      }
      const requestCreateGame = await fetch(`/admin/deleteMethodPay`, optionsCreateGame);
      const responseCreateGame = await requestCreateGame.json();
      if(responseCreateGame.message === 'success') {
        location.reload();
      } else {
        textElement.style.color = 'red';
        textElement.innerHTML = `Что-то пошло не так, попробуйте снова.`
      }
    })

    modal.append(buttonContainer);
    return modal;
  }
}