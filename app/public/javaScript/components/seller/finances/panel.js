import {Elements} from './elements/elements.js';
import {Modal} from './elements/modal.js';
export class Panel {
  constructor(data) {
    this.data = data;
  }
  render() {
    const elements = new Elements();
    const panelContainer = document.createElement('div');
    panelContainer.id = 'finance-panel_container';
    panelContainer.classList.add('finance-panel_container');

    const balanceContainer = document.createElement('div');
    balanceContainer.id = 'finance-panel_container__balance';
    balanceContainer.classList.add('finance-panel_container__balance');

    const methodsContainer = document.createElement('div');
    methodsContainer.id = 'finance-panel_container__methods';
    methodsContainer.classList.add('finance-panel_container__methods');

    const balanceContainerSpan = document.createElement('div');
    balanceContainerSpan.classList.add('finance-panel_container__balance-container');
    const balanceContainerButtons = document.createElement('div');
    const balanceSpanText = elements.renderSpan('finance-panel_container__balance___text');
    balanceSpanText.textContent = 'Ваш баланс: ';
    const balanceSpanValue = elements.renderSpan('finance-panel_container__balance___value');
    balanceSpanValue.textContent = `${this.data.user.balance} $`;
    balanceContainerSpan.append(balanceSpanText, balanceSpanValue);
    const buttonOrder = document.createElement('button');
    buttonOrder.id = 'finance-panel_container__balance___button';
    buttonOrder.classList.add('finance-panel_container__balance___button');
    buttonOrder.textContent = 'Заказать выплату';
    balanceContainerButtons.appendChild(buttonOrder);
    balanceContainer.append(balanceContainerSpan, balanceContainerButtons);

    if(this.data) {
      const inputContainer = document.createElement('div');
      inputContainer.id = 'finance-panel_inputs-container';
      inputContainer.classList.add('finance-panel_inputs-container');
      
      this.data.paymentMethods.forEach(element => {
        const infoContainer = document.createElement('div');
        infoContainer.classList.add('payment-method-container');
        const labelMethod = elements.renderLabel('payment-method', `${element[0]}: `);
        const inputMethod = elements.renderInput('payment-method');
        const spanMethod = elements.renderSpan('payment-method-span');
        const spanMethodFix = elements.renderSpan('payment-method-span-fix');
        this.data.user.payments.forEach(pay => {
          if(pay[0] === element[0]) {
            inputMethod.value = pay[1];
          }
        })
        /* inputMethod.value = element[1]; */
        inputMethod.dataset.name = element[0];
        spanMethod.textContent = `${element[1]} %`;
        if(element[2] && element[2] !== 0 && element[2] !== '0' && element[2] !== undefined && element[2] !== 'undefined') {
          spanMethodFix.textContent = `+ ${element[2]} $`;
        }
        infoContainer.append(labelMethod, inputMethod, spanMethod, spanMethodFix);
        inputContainer.append(infoContainer);
      });
      methodsContainer.appendChild(inputContainer);
    }
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'finance-panel_button-container';
    buttonContainer.classList.add('finance-panel_button-container');

    const buttonSave = document.createElement('button');
    buttonSave.id = 'finance-panel_button-save';
    buttonSave.classList.add('finance-panel_button-save');
    buttonSave.textContent = 'Сохранить';
    buttonContainer.append(buttonSave);
    methodsContainer.appendChild(buttonContainer);
    panelContainer.append(balanceContainer, methodsContainer);
    this.eventButtonOrder(buttonOrder, panelContainer, this.data);
    this.eventButtonSave(buttonSave, panelContainer, methodsContainer);
/*     if(this.data && this.data !== null && this.data !== 'null') {
      const inputContainer = document.createElement('div');
      inputContainer.id = 'finance-panel_inputs-container';
      inputContainer.classList.add('finance-panel_inputs-container');
      const elements = new Elements();
      this.data.methods.forEach(element => {
        const infoContainer = document.createElement('div')
        const labelMethod = elements.renderLabel('payment-method', `${element[0]}: `);
        const inputMethod = elements.renderInput('payment-method');
        const spanMethod = elements.renderSpan('payment-method-span');
        inputMethod.value = element[1];
        inputMethod.dataset.name = element[0];
        spanMethod.textContent = '%';
        infoContainer.append(labelMethod, inputMethod, spanMethod)
        inputContainer.append(infoContainer);
      });
      panelContainer.appendChild(inputContainer);
    }

    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'finance-panel_button-container';
    buttonContainer.classList.add('finance-panel_button-container');

    const buttonAdd = document.createElement('button');
    buttonAdd.id = 'finance-panel_button-add';
    buttonAdd.classList.add('finance-panel_button-add');
    buttonAdd.textContent = 'Добавить метод';

    const buttonSave = document.createElement('button');
    buttonSave.id = 'finance-panel_button-save';
    buttonSave.classList.add('finance-panel_button-save');
    buttonSave.textContent = 'Сохранить';
    buttonContainer.append(buttonAdd, buttonSave);

    this.eventButtonAdd(buttonAdd, panelContainer);
    this.eventButtonSave(buttonSave, panelContainer);
    panelContainer.append(buttonContainer); */
    return panelContainer;
  }

  eventButtonOrder(button, panelContainer, data) {
    button.addEventListener('click', async(event) => {
      const modal = new Modal(data);
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
          body: JSON.stringify({methodValue, value}),
          headers: {
            'Content-Type': 'application/json',
          }
        }
        const reqPaymentSave = await fetch('/seller/orderpayment', options);
        const resPaymentSave = await reqPaymentSave.json();
        console.log(resPaymentSave)
        if(resPaymentSave.message === 'success') {
          escapingBallG.classList.add('notification');
          escapingBallG.style.width = '300px';
          escapingBallG.style.height = '50px';
          escapingBallG.style.color = 'white';
          escapingBallG.innerHTML = 'Сохранено';
          await new Promise(resolve => setTimeout(resolve, 3000));
          escapingBallG.style.display = 'none';
        } else if(resPaymentSave.message === 'limitBalance') {
          escapingBallG.classList.add('notification');
          escapingBallG.style.width = '300px';
          escapingBallG.style.height = '50px';
          escapingBallG.style.color = 'white';
          escapingBallG.style.background = 'black';
          escapingBallG.innerHTML = 'Недостаточно баланса :)';
          await new Promise(resolve => setTimeout(resolve, 3000));
          escapingBallG.style.display = 'none';
        } else if(resPaymentSave.message === 'requisitesEmpty') {
          escapingBallG.classList.add('notification');
          escapingBallG.style.width = '350px';
          escapingBallG.style.height = '70px';
          escapingBallG.style.color = 'white';
          escapingBallG.style.background = 'black';
          escapingBallG.innerHTML = 'Реквизиты данного метода не заполнены';
          await new Promise(resolve => setTimeout(resolve, 3000));
          escapingBallG.style.display = 'none';
        }  else if(resPaymentSave.message === 'notFoundMethod') {
          escapingBallG.classList.add('notification');
          escapingBallG.style.width = '400px';
          escapingBallG.style.height = '150px';
          escapingBallG.style.color = 'white';
          escapingBallG.style.background = 'black';
          escapingBallG.innerHTML = 'Реквизита метода не заполнены. Введите реквизиты в соответствующее поле и нажмите "Сохранить"';
          await new Promise(resolve => setTimeout(resolve, 3000));
          escapingBallG.style.display = 'none';
        } else {
          escapingBallG.classList.add('notification');
          escapingBallG.style.width = '300px';
          escapingBallG.style.height = '50px';
          escapingBallG.style.color = 'white';
          escapingBallG.style.background = 'black';
          escapingBallG.innerHTML = 'Ошибка. Обратитесь к администратору';
          await new Promise(resolve => setTimeout(resolve, 3000));
          escapingBallG.style.display = 'none';
        }

      })
      panelContainer.append(createModal)
    })
  }
  eventButtonSave(button, panelContainer, methodsContainer) {
    button.addEventListener('click', async(event) => { 
      const escapingBallG = document.getElementById('escapingBallG');
      escapingBallG.style.display = 'flex';
      const inputs = methodsContainer.querySelectorAll('input');
      const arrayPayments = [];
      inputs.forEach(input => {
        arrayPayments.push([input.dataset.name, input.value]);
      })

      const options = {
        method: 'POST',
        body: JSON.stringify({arrayPayments}),
        headers: {
          'Content-Type': 'application/json',
        }
      }
      const reqPaymentSave = await fetch('/seller/paymentsave', options);
      const resPaymentSave = await reqPaymentSave.json();
      if(resPaymentSave.message === 'success') {
        escapingBallG.classList.add('notification');
        escapingBallG.style.width = '300px';
        escapingBallG.style.height = '50px';
        escapingBallG.style.color = 'white';
        escapingBallG.innerHTML = 'Сохранено';
        await new Promise(resolve => setTimeout(resolve, 2000));
        escapingBallG.style.display = 'none';
      }
    })
  }
}