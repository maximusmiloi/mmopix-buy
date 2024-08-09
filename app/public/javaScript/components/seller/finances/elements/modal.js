import { Elements } from './elements.js';
export class Modal { 
  constructor(data, courseRUB) {
    this.data = data;
    this.courseRUB = courseRUB;
  }
  render(text, id) {
    const modal = document.createElement('div');
    modal.id = 'seller-finances-modal';
    modal.classList.add('seller-finances-modal');
/*     modal.style.width = '500px';
    modal.style.height = '200px'; */
    modal.style.display = 'flex';
    const textElement = document.createElement('div');
    textElement.textContent = text;
    modal.append(text);
    const select = document.createElement('select');
    this.data.paymentMethods.forEach(pay => {
      const option = document.createElement('option');
      option.textContent = pay[0];
      option.value = pay[0];
      select.appendChild(option);
    })
    modal.appendChild(select);
    const input = document.createElement('input');
    modal.appendChild(input);
    const span = document.createElement('span');
    input.addEventListener('input', event => {
      const procent = this.data.paymentMethods.find(method => method[0] === select.value);
      const initialValue = event.target.value;
      const percentage = procent[1];
      let result = initialValue - (initialValue * (percentage / 100));
      if(procent[2] && procent[2] !== '0' && procent[2] !== 0 && procent[2] !== undefined && procent[2] !== 'undefined') {
        result = result - procent[2];
      }
      span.innerHTML = `Сумма к получению: <span style="color: orange"> ${result} $ или ${(result * this.courseRUB).toFixed(2)} Рублей </span>`;
    });
    select.addEventListener('change', event => {
      input.value = '';
    });
    modal.appendChild(span);

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('modal-button-container');
    const modalButtonClose = document.createElement('button');
    modalButtonClose.classList.add('modal-button');
    modalButtonClose.textContent = 'Отмена';
    const modalButtonOrder = document.createElement('button');
    modalButtonOrder.classList.add('modal-button');
    modalButtonOrder.id = id;
    modalButtonOrder.textContent = 'Заказать';
    buttonContainer.append(modalButtonClose, modalButtonOrder);

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