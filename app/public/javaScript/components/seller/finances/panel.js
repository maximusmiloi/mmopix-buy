import {Elements} from './elements/elements.js';
import {Modal} from './elements/modal.js';
export class Panel {
  constructor(data, courseRUB) {
    this.data = data;
    this.courseRUB = courseRUB;
  }
  render() {
    const elements = new Elements();
    const panelContainer = this.createElementWithClass('div', 'finance-panel_container', 'finance-panel_container');
  
    const balanceContainer = this.createElementWithClass('div', 'finance-panel_container__balance', 'finance-panel_container__balance');
    const methodsContainer = this.createElementWithClass('div', 'finance-panel_container__methods', 'finance-panel_container__methods');
  
    const balanceContainerSpan = this.createElementWithClass('div', null, 'finance-panel_container__balance-container');
    const balanceContainerButtons = document.createElement('div');
  
    const balanceSpanText = elements.renderSpan('finance-panel_container__balance___text');
    balanceSpanText.textContent = 'Ваш баланс: ';
    const balanceSpanValue = elements.renderSpan('finance-panel_container__balance___value');
    balanceSpanValue.textContent = `${this.data.user.balance} $`;
  
    balanceContainerSpan.append(balanceSpanText, balanceSpanValue);
  
    const buttonOrder = this.createButton('finance-panel_container__balance___button', 'Заказать выплату');
    balanceContainerButtons.appendChild(buttonOrder);
    balanceContainer.append(balanceContainerSpan, balanceContainerButtons);
  
    if (this.data) {
      const inputContainer = this.createElementWithClass('div', 'finance-panel_inputs-container', 'finance-panel_inputs-container');
      const h2Info = document.createElement('h2');
      h2Info.textContent = 'Реквизиты для оплаты:';
      inputContainer.append(h2Info);
      
      this.data.paymentMethods.forEach(element => {
        const infoContainer = this.createElementWithClass('div', null, 'payment-method-container');
        
        const labelMethod = elements.renderLabel('payment-method', `${element[0]}: `);
        const inputMethod = elements.renderInput('payment-method');
        const spanMethod = elements.renderSpan('payment-method-span');
      
        this.data.user.payments.forEach(pay => {
          if (pay[0] === element[0]) {
            inputMethod.value = pay[1];
          }
        });
      
        inputMethod.dataset.name = element[0];
        spanMethod.textContent = `${element[1]} %`;
        if (element[2] && element[2] !== 0 && element[2] !== '0') {
          spanMethod.textContent = `${element[1]} % + ${element[2]} $`;
        }
      
        infoContainer.append(labelMethod, inputMethod, spanMethod);
        inputContainer.append(infoContainer); // Добавляем только infoContainer, h2 уже добавлен
      });
      methodsContainer.appendChild(inputContainer);
    }
  
    const buttonContainer = this.createElementWithClass('div', 'finance-panel_button-container', 'finance-panel_button-container');
    const buttonSave = this.createButton('finance-panel_button-save', 'Сохранить');
    buttonContainer.append(buttonSave);
    methodsContainer.appendChild(buttonContainer);
    
    panelContainer.append(balanceContainer, methodsContainer);
  
    this.eventButtonOrder(buttonOrder, panelContainer, this.data, this.courseRUB);
    this.eventButtonSave(buttonSave, panelContainer, methodsContainer);
  
    return panelContainer;
  }
  
  createElementWithClass(tag, id, className) {
    const element = document.createElement(tag);
    if (id) element.id = id;
    if (className) element.classList.add(className);
    return element;
  }
  
  createButton(id, text) {
    const button = document.createElement('button');
    button.id = id;
    button.classList.add(id);
    button.textContent = text;
    return button;
  }
  
  eventButtonOrder(button, panelContainer, data, courseRUB) {
    button.addEventListener('click', async(event) => {
      const overlay = document.querySelector('.modal-overlay');
      overlay.style.display = 'block';
      const modal = new Modal(data, courseRUB);
      const createModal = modal.render('Методы оплаты', 'modal-finances-button');
      const buttonOrder = createModal.querySelector('#modal-finances-button');
  
      buttonOrder.addEventListener('click', async(event) => {
        const escapingBallG = document.getElementById('escapingBallG');
        escapingBallG.style.display = 'flex';
        const selectElement = createModal.querySelector('select');
        const valueElement = createModal.querySelector('input');
        const value = valueElement.value;
        const methodValue = selectElement.value;
  
        const options = {
          method: 'POST',
          body: JSON.stringify({ methodValue, value }),
          headers: {
            'Content-Type': 'application/json',
          }
        };
        const reqPaymentSave = await fetch('/seller/orderpayment', options);
        const resPaymentSave = await reqPaymentSave.json();
        this.handleResponse(resPaymentSave, escapingBallG);
      });
      panelContainer.append(createModal);
    });
  }
  
  eventButtonSave(button, panelContainer, methodsContainer) {
    button.addEventListener('click', async(event) => {
      const escapingBallG = document.getElementById('escapingBallG');
      escapingBallG.style.display = 'flex';
      const inputs = methodsContainer.querySelectorAll('input');
      const arrayPayments = Array.from(inputs).map(input => [input.dataset.name, input.value]);
  
      const options = {
        method: 'POST',
        body: JSON.stringify({ arrayPayments }),
        headers: {
          'Content-Type': 'application/json',
        }
      };
      const reqPaymentSave = await fetch('/seller/paymentsave', options);
      const resPaymentSave = await reqPaymentSave.json();
      this.handleResponse(resPaymentSave, escapingBallG);
    });
  }
  
  handleResponse(response, escapingBallG) {
    const messages = {
      'success': 'Сохранено',
      'limitBalance': 'Недостаточно баланса :)',
      'requisitesEmpty': 'Реквизиты данного метода не заполнены',
      'notFoundMethod': 'Реквизита метода не заполнены. Введите реквизиты в соответствующее поле и нажмите "Сохранить"',
      'error': 'Ошибка. Обратитесь к администратору'
    };
  
    const message = messages[response.message] || messages['error'];
    escapingBallG.classList.add('notification');
    escapingBallG.style.width = '300px';
    escapingBallG.style.height = '50px';
    escapingBallG.style.color = 'white';
    escapingBallG.innerHTML = message;
    if (response.message !== 'success') {
      escapingBallG.style.background = 'black';
      if (response.message === 'notFoundMethod') {
        escapingBallG.style.width = '400px';
        escapingBallG.style.height = '150px';
      }
    }
    setTimeout(() => {
      escapingBallG.style.display = 'none';
    }, 3000);
  }
}