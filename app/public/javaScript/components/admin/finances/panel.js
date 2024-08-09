import {Elements} from './elements/elements.js';
import {Modal} from './elements/modal.js';

export class Panel {
  constructor(data) {
    this.data = data;
  }
  render() {
    const escapingBallG = document.getElementById('escapingBallG');
    
    const panelContainer = document.createElement('div');
    panelContainer.id = 'finance-panel_container';
    panelContainer.classList.add('finance-panel_container');

    if (this.data && this.data !== null && this.data !== 'null') {
      const inputContainer = document.createElement('div');
      inputContainer.id = 'finance-panel_inputs-container';
      inputContainer.classList.add('finance-panel_inputs-container');

      this.data.methods.forEach(element => {
        inputContainer.append(this.createPaymentMethodElement(element));
      });

      const courseContainer = this.createCourseElement();
      panelContainer.append(inputContainer, courseContainer);
    }

    const buttonContainer = this.createButtonContainer();
    panelContainer.append(buttonContainer);

    return panelContainer;
  }

  createPaymentMethodElement(element) {
    const elements = new Elements();
    const infoContainer = document.createElement('div');
    infoContainer.classList.add('container-info-payment');

    const labelMethod = elements.renderLabel('payment-method', `${element[0]}: `);
    labelMethod.dataset.method = element[0];
    const inputMethod = elements.renderInput('payment-method');
    const spanMethod = elements.renderSpan('payment-method-span');
    const inputMethodFix = elements.renderInput('payment-method-fix');
    inputMethodFix.value = element[2];
    inputMethodFix.dataset.name = element[0];
    const spanMethodFix = elements.renderSpan('payment-method-span');
    spanMethodFix.textContent = '$';
    const buttonMethod = elements.renderButton('payment-method-button', 'Удалить');
    buttonMethod.style.width = '100px';
    buttonMethod.style.background = 'red';
    buttonMethod.style.color = 'white';
    buttonMethod.addEventListener('click', async event => {
      const modalDelete = new Modal();
      const nameMethod = event.target.parentNode.children[0].dataset.method;
      const createModalDelete = await modalDelete.renderNotification('Будет удалён метод, а также все реквизиты у каждого продавца', nameMethod);
      panelContainer.append(createModalDelete)
    });

    inputMethod.value = element[1];
    inputMethod.dataset.name = element[0];
    spanMethod.textContent = '%';

    infoContainer.append(labelMethod, inputMethod, spanMethod, inputMethodFix, spanMethodFix, buttonMethod);

    return infoContainer;
  }

  createCourseElement() {
    const elements = new Elements();
    const courseContainer = document.createElement('div');
    const labelCourse = elements.renderLabel('payment-course', `Курс рубля: `);
    const courseInput = elements.renderInput('payment-course');

    if (this.data.courseRUB) {
      courseInput.value = this.data.courseRUB;
    }

    courseInput.addEventListener('change', async (event) => {
      escapingBallG.style.display = 'flex';
      const reqChangeCourse = await fetch(`/admin/coursechange?value=${event.target.value}`);
      const resChangeCourse = await reqChangeCourse.json();
      if (resChangeCourse.message === 'success') {
        this.showNotification('Сохранено');
      }
    });

    courseContainer.append(labelCourse, courseInput);
    return courseContainer;
  }

  createButtonContainer() {
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

    this.eventButtonAdd(buttonAdd, buttonContainer);
    this.eventButtonSave(buttonSave, buttonContainer);

    return buttonContainer;
  }

  eventButtonAdd(button, panelContainer) {
    button.addEventListener('click', async(event) => {
      const elements = new Elements();
      const inputContainer = document.createElement('div');
      inputContainer.id = 'finance-panel_inputs-container';
      inputContainer.classList.add('finance-panel_inputs-container');

      const methodsContainer = document.createElement('div');
      methodsContainer.classList.add('finance_methods-container');

      const labelNameMethod = elements.renderLabel('payment-name-method', 'Название метода');
      const inputNameMethod = elements.renderInput('payment-name-method');
      const labelMethod = elements.renderLabel('payment-comission-method', 'Комиссия в %');
      const inputMethod = elements.renderInput('payment-comission-method');
      const labelMethodFix = elements.renderLabel('payment-comission-method-fix', 'Комиссия фикса в $');
      const inputMethodFix = elements.renderInput('payment-comission-method-fix');

      methodsContainer.append(labelMethod, inputMethod, labelMethodFix, inputMethodFix);
      inputContainer.append(labelNameMethod, inputNameMethod, methodsContainer);

      this.insertPenultimate(panelContainer, inputContainer);
    });
  }

  eventButtonSave(button, panelContainer) {
    button.addEventListener('click', async(event) => { 
      const escapingBallG = document.getElementById('escapingBallG');
      escapingBallG.style.display = 'flex';

      const inputs = panelContainer.querySelectorAll('input');
      const infoContainers = document.querySelectorAll('.container-info-payment');
      const arrayAdd = [];
      const arrayUpdate = [];

      inputs.forEach((input, index) => {
        if (input.id === 'payment-name-method') {
          arrayAdd.push([input.value, inputs[index + 1].value, inputs[index + 2].value]);
        }
      });

      infoContainers.forEach(element => {
        const inputs = element.querySelectorAll('input');
        const array = [];
        inputs.forEach(input => {
          if (input.id === 'payment-method') {
            array.push([input.dataset.name, input.value]);
          } else {
            array[0].push(input.value);
          }
        });
        arrayUpdate.push(array);
      });

      const options = {
        method: 'POST',
        body: JSON.stringify({ arrayAdd, arrayUpdate }),
        headers: {
          'Content-Type': 'application/json',
        }
      };

      const reqPaymentSave = await fetch('/admin/paymentsave', options);
      const resPaymentSave = await reqPaymentSave.json();
      if (resPaymentSave.message === 'success') {
        this.showNotification('Сохранено');
      }
    });
  }

  insertPenultimate(parent, ...elements) {
    const children = parent.children;
    const penultimateIndex = children.length > 0 ? children.length - 1 : 0;
    const referenceNode = children[penultimateIndex];
    elements.forEach(element => {
      parent.insertBefore(element, referenceNode);
    });
  }

  showNotification(message) {
    const escapingBallG = document.getElementById('escapingBallG');
    escapingBallG.classList.add('notification');
    escapingBallG.style.width = '300px';
    escapingBallG.style.height = '50px';
    escapingBallG.style.color = 'white';
    escapingBallG.innerHTML = message;
    setTimeout(() => {
      escapingBallG.style.display = 'none';
    }, 3000);
  }
}