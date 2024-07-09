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
/*     const input = document.createElement('input');
    modal.appendChild(input);
    const span = document.createElement('span');
    input.addEventListener('input', event => {
      const procent = this.data.paymentMethods.find(method => method[0] === select.value);
      const initialValue = event.target.value;
      const percentage = procent[1];
      const result = initialValue - (initialValue * (percentage / 100));
      console.log(procent[1]);
      span.innerHTML = `Сумма к получению: <span style="color: orange"> ${result} $ </span>`;
    });
    select.addEventListener('change', event => {
      input.value = '';
    });
    modal.appendChild(span); */

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
}