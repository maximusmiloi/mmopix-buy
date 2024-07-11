import {Elements} from './elements/elements.js';
import {Modal} from './elements/modal.js';

export class Panel {
  constructor(data) {
    this.data = data;
  }
  render() {
    const panelContainer = document.createElement('div');
    panelContainer.id = 'finance-panel_container';
    panelContainer.classList.add('finance-panel_container');
    if(this.data && this.data !== null && this.data !== 'null') {
      const inputContainer = document.createElement('div');
      inputContainer.id = 'finance-panel_inputs-container';
      inputContainer.classList.add('finance-panel_inputs-container');
      const elements = new Elements();
      this.data.methods.forEach(element => {
        const infoContainer = document.createElement('div')
        const labelMethod = elements.renderLabel('payment-method', `${element[0]}: `);
        labelMethod.dataset.method = element[0];
        const inputMethod = elements.renderInput('payment-method');
        const spanMethod = elements.renderSpan('payment-method-span');
        const buttonMethod = elements.renderButton('payment-method-button', 'Удалить');
        buttonMethod.style.width = '100px';
        buttonMethod.style.background = 'red';
        buttonMethod.style.color = 'white';
        buttonMethod.addEventListener('click', async event => {
          const modalDelete = new Modal();
          const nameMethod = event.target.parentNode.children[0].dataset.method;
          console.log(nameMethod)
          const createModalDelete = await modalDelete.renderNotification('Будет удалён метод, а также все реквизиты у каждого продавца', nameMethod);
          panelContainer.append(createModalDelete)
        })
        inputMethod.value = element[1];
        inputMethod.dataset.name = element[0];
        spanMethod.textContent = '%';
        infoContainer.append(labelMethod, inputMethod, spanMethod, buttonMethod)
        inputContainer.append(infoContainer);
      });
      panelContainer.appendChild(inputContainer);
      /* const  */
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
    panelContainer.append(buttonContainer);
    return panelContainer;
  }

  eventButtonAdd(button, panelContainer) {
    button.addEventListener('click', async(event) => {
      function insertPenultimate(parent, ...elements) {
        const children = parent.children;
        const penultimateIndex = children.length > 0 ? children.length - 1 : 0;
        const referenceNode = children[penultimateIndex];
      
        elements.forEach(element => {
          parent.insertBefore(element, referenceNode);
        });
      }
      const elements = new Elements();
      const inputContainer = document.createElement('div');
      inputContainer.id = 'finance-panel_inputs-container';
      inputContainer.classList.add('finance-panel_inputs-container');
      const labelNameMethod = elements.renderLabel('payment-name-method', 'Название метода');
      const inputNameMethod = elements.renderInput('payment-name-method');
      const labelMethod = elements.renderLabel('payment-comission-method', 'Комиссия');
      const inputMethod = elements.renderInput('payment-comission-method');
 /*      inputMethod.value = element[1];
      spanMethod.textContent = element[1] */;
      
      inputContainer.append(labelNameMethod, inputNameMethod, labelMethod, inputMethod);
      insertPenultimate(panelContainer, inputContainer)
    })
  }
  eventButtonSave(button, panelContainer) {
    button.addEventListener('click', async(event) => { 
      const escapingBallG = document.getElementById('escapingBallG');
      escapingBallG.style.display = 'flex';
      const inputs = panelContainer.querySelectorAll('input');
      const arrayAdd = [];
      const arrayUpdate = [];
      inputs.forEach((input, index) => {
        if(input.id == 'payment-name-method') {
          arrayAdd.push([input.value, inputs[index+1].value])
        }
        if(input.id == 'payment-method') {
          arrayUpdate.push([input.dataset.name, input.value])
        }
      })

      const options = {
        method: 'POST',
        body: JSON.stringify({arrayAdd, arrayUpdate}),
        headers: {
          'Content-Type': 'application/json',
        }
      }
      const reqPaymentSave = await fetch('/admin/paymentsave', options);
      const resPaymentSave = await reqPaymentSave.json();
      if(resPaymentSave.message === 'success') {
        escapingBallG.classList.add('notification');
        escapingBallG.style.width = '300px';
        escapingBallG.style.height = '50px';
        escapingBallG.style.color = 'black';
        escapingBallG.innerHTML = 'Сохранено';
        await new Promise(resolve => setTimeout(resolve, 10000));
        escapingBallG.style.display = 'none';
      }
    })
  }
}