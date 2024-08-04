import {clearModal} from './handlerModal/clearModal.js';
import {ModalElement} from './handlerModal/createModalElement.js';
export class Modal {
  constructor(value, values, buttons, data) {
    this.value = value;
    this.values = values;
    this.buttons = buttons;
    this.data = data;
  }
  render() {
    const mainModal = document.getElementById('modal');
    mainModal.innerHTML = '';

    const content = document.createElement('div');
    content.classList.add('modal-content');

    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('modal-button-container');

//GAMES
    if(this.value === 'games') {
      console.log(this.values)
      this.values.forEach((element, index) => {

        const label = document.createElement('label');
        label.htmlFor = element + `-${index}`;
        label.textContent = element;
        const input = document.createElement('input');
        console.log(this.data);


        if(this.data) {
          [input.id, input.type, input.value] = [element + `-${index}`, 'text', this.data[element]];
          input.classList.add(element + `-${index}`);
        } else {
          [input.id, input.type] = [element + `-${index}`, 'text'];
          input.classList.add(element + `-${index}`);
        }
        console.log(element)
        if(element === 'Region'/*  || element === 'region' */) {
          console.log(element)
          function insertPenultimate(parent, ...elements) {
            const children = parent.children;
            const penultimateIndex = children.length > 0 ? children.length - 1 : 0;
            const referenceNode = children[penultimateIndex];
          
            elements.forEach(element => {
              parent.insertBefore(element, referenceNode);
            });
          }
          const buttonAddRegion = document.createElement('button');
          buttonAddRegion.classList.add('modal-games-add-region-button');
          buttonAddRegion.textContent = 'Добавить';
          buttonAddRegion.addEventListener('click', async(event) => {
            const optionsContainerElement = document.createElement('div');
            optionsContainerElement.classList.add('modal-games-add-region-container');
            const input = document.createElement('input');
            if(this.data) {
              [input.id, input.type, input.value] = [element + `-${index}`, 'text', this.data[element]];
            } else {
              [input.id, input.type] = [element + `-${index}`, 'text'];
            }
            const buttonRegionDelete = document.createElement('button');
            buttonRegionDelete.textContent = 'удалить';
            buttonRegionDelete.classList.add('modal-games-delete-region-button');
            optionsContainerElement.append(input,buttonRegionDelete);
            insertPenultimate(content, optionsContainerElement);
            buttonRegionDelete.addEventListener('click', event => {
              input.remove();
              buttonRegionDelete.remove();
            })
          });
          content.append(label, input, buttonAddRegion);
        } else {
          content.append(label, input);
        }
      });
    }
//CHAPTERS
    if(this.value === 'chapters') {
      function insertPenultimate(parent, ...elements) {
        const children = parent.children;
        const penultimateIndex = children.length > 0 ? children.length - 1 : 0;
        const referenceNode = children[penultimateIndex];
      
        elements.forEach(element => {
          parent.insertBefore(element, referenceNode);
        });
      }
      const indicatorLoad = document.getElementById('escapingBallG');
      const modalContainer = document.querySelector('.modal');

      const modalElement = new ModalElement();

      const labelGame = modalElement.renderLabel('chapter-game', 'Game', 'chapter-game-label');
      const selectGame = modalElement.renderSelect('chapter-game-select', 'name', this.data, 'init');
      content.append(labelGame, selectGame);

      const labelRegion = modalElement.renderLabel('chapter-region', 'Region', 'chapter-region-label');
      const selectRegion = modalElement.renderSelect('chapter-region-select', 'region', this.data, 'init');
      content.append(labelRegion, selectRegion);

      const divCourse = document.createElement('div');
      divCourse.classList.add('chapter-course-input-container');
      const labelCourse = modalElement.renderLabelNew('chapter-course-label', 'За', 'chapter-course-label');
      const inputCourse  = modalElement.renderInputNew('chapter-course-input'/* , 'region', this.data, 'init' */);
      const labelCourseText = modalElement.renderLabelNew('chapter-course-label-text', 'Чего', 'chapter-course-label-text');
      const inputCourseText = modalElement.renderInputNew('chapter-course-input-text'/* , 'region', this.data, 'init' */);
      const inputCourseFactor = modalElement.renderInputNew('chapter-course-input-factor'/* , 'region', this.data, 'init' */)
      divCourse.append(labelCourse, inputCourse, labelCourseText, inputCourseText, inputCourseFactor);
      content.append(/* labelCourse, */ divCourse);


/*       const labelMethodDelivery = modalElement.renderLabel('chapter-method_delivery', 'Method Delivery', 'chapter-method_delivery-label');
      const inputMethodDelivery = modalElement.renderInput('chapter-region-select', this.dataChapter, 'init');
      content.append(labelMethodDelivery, inputMethodDelivery);

      const options = modalElement.renderGoldOptions(dataChapter);
      content.append(options); */
      
      let eventGameValue;
      let eventRegionValue;
      selectGame.addEventListener('change', async(event) => {
        indicatorLoad.style.display = 'block';
        eventGameValue = event.target.value;
        clearModal(content, ['chapter-game-label'], ['chapter-game-select']);

        const labelRegion = modalElement.renderLabel('chapter-region', 'Region', 'chapter-region-label');
        const selectRegion = modalElement.renderSelect('chapter-region-select', 'region', this.data, eventGameValue);
        const divCourseHave = document.querySelector('.chapter-course-input-container');
        if(divCourseHave) {
          divCourseHave.remove();
        }
        const divCourse = document.createElement('div');
        divCourse.classList.add('chapter-course-input-container');
        const labelCourse = modalElement.renderLabelNew('chapter-course-label', 'За', 'chapter-course-label');
        const inputCourse  = modalElement.renderInputNew('chapter-course-input'/* , 'region', this.data, 'init' */);
        const labelCourseText = modalElement.renderLabelNew('chapter-course-label-text', 'Чего', 'chapter-course-label-text');
        const inputCourseText = modalElement.renderInputNew('chapter-course-input-text'/* , 'region', this.data, 'init' */);
        const inputCourseFactor = modalElement.renderInputNew('chapter-course-input-factor'/* , 'region', this.data, 'init' */)
        divCourse.append(labelCourse, inputCourse, labelCourseText, inputCourseText, inputCourseFactor);
        insertPenultimate(content, labelRegion, selectRegion, divCourse);

/*         const labelMethodDelivery = modalElement.renderLabel('chapter-method_delivery', 'Method Delivery', 'chapter-method_delivery-label');
        const inputMethodDelivery = modalElement.renderInput('chapter-region-select', this.data, eventGameValue);
        insertPenultimate(content, labelMethodDelivery, inputMethodDelivery);
        const options = modalElement.renderGoldOptions();
        insertPenultimate(content, options); */

        indicatorLoad.style.display = 'none';

/*         selectRegion.addEventListener('change', async(event) => {
          await clearModal(content, ['chapter-game-label', 'chapter-region-label'], ['chapter-game-select', 'chapter-region-select']);
          eventRegionValue = event.target.value;
          const labelMethodDelivery = modalElement.renderLabel('chapter-method_delivery', 'Method Delivery', 'chapter-method_delivery-label');
          const inputMethodDelivery = modalElement.renderInput('chapter-region-select', this.data, eventRegionValue);
          insertPenultimate(content, labelMethodDelivery, inputMethodDelivery);
          const options = modalElement.renderG  oldOptions();
          insertPenultimate(content, options);
        }) */


      }) 
/*       selectRegion.addEventListener('change', async(event) => {
        await clearModal(content, ['chapter-game-label', 'chapter-region-label'], ['chapter-game-select', 'chapter-region-select']);
        eventRegionValue = event.target.value;
        const labelMethodDelivery = modalElement.renderLabel('chapter-method_delivery', 'Method Delivery', 'chapter-method_delivery-label');
        const inputMethodDelivery = modalElement.renderInput('chapter-region-select', this.data, eventRegionValue);
        insertPenultimate(content, labelMethodDelivery, inputMethodDelivery);
      }) */
    }
    this.buttons.forEach((button, index) => {
      const buttonCreate = document.createElement('button');
      buttonCreate.classList.add(button[0]);
      buttonCreate.id = button[0];
      buttonCreate.textContent = button[1];
      buttonsContainer.appendChild(buttonCreate);
    })
    content.appendChild(buttonsContainer);
    return content;
  }
  renderEditChapter(dataElement, buttons) {
    const mainModal = document.getElementById('modal');
    mainModal.innerHTML = '';

    function insertPenultimate(parent, ...elements) {
      const children = parent.children;
      const penultimateIndex = children.length > 0 ? children.length - 2 : 0;
      const referenceNode = children[penultimateIndex];
    
      elements.forEach(element => {
        parent.insertBefore(element, referenceNode);
      });
    }

    const content = document.createElement('div');
    content.classList.add('modal-content');

    const labelMethods = document.createElement('label');
    labelMethods.htmlFor = 'modal-chapter-edit-label_methods';
    labelMethods.textContent = 'Методы доставки';
    labelMethods.id = 'modal-chapter-edit-label_methods';
    const inputMethods = document.createElement('input');
    inputMethods.id = 'modal-chapter-edit-methods';
    inputMethods.value = dataElement.methodDelivery;

    const modalElement = new ModalElement();
    console.log(dataElement)
    const divCourse = document.createElement('div');
    divCourse.classList.add('chapter-course-input-container');
    const labelCourse = modalElement.renderLabelNew('chapter-course-label', 'За', 'chapter-course-label');
    const inputCourse  = modalElement.renderInputNew('chapter-course-input'/* , 'region', this.data, 'init' */);
    const labelCourseText = modalElement.renderLabelNew('chapter-course-label-text', 'Чего', 'chapter-course-label-text');
    const inputCourseText = modalElement.renderInputNew('chapter-course-input-text'/* , 'region', this.data, 'init' */);
    const inputCourseFactor = modalElement.renderInputNew('chapter-course-input-factor'/* , 'region', this.data, 'init' */)
    if(dataElement && dataElement.courseG2G && dataElement.courseG2G[0]) {
      inputCourse.value = dataElement.courseG2G[0];
      inputCourseText.value = dataElement.courseG2G[1];
      inputCourseFactor.value = dataElement.courseG2G[2];
    }
    divCourse.append(labelCourse, inputCourse, labelCourseText, inputCourseText, inputCourseFactor);
    const labeloptions = document.createElement('label');
    labeloptions.textContent = 'Опции';
    const optionsContainer = document.createElement('div');
    optionsContainer.classList.add('modal-chapter-edit-options-container')
    if(dataElement.options.length > 0) {
      dataElement.options.forEach(option => {
        const optionsContainerElement = document.createElement('div');
        optionsContainerElement.classList.add('modal-chapter-edit-options-container-element');
        const inputOption1 = document.createElement('input');
        inputOption1.value = option[0];
        inputOption1.classList.add('modal-chapter-edit-options-input')
        const inputOption2 = document.createElement('input');
        inputOption2.classList.add('modal-chapter-edit-options-input')
        inputOption2.value = option[1];
        const inputOption3 = document.createElement('span');
        if(option[2]) {
          inputOption2.classList.add('modal-chapter-edit-options-span');
          inputOption3.textContent = option[2];
        }
        const buttonOptionDelete = document.createElement('button');
        buttonOptionDelete.textContent = 'удалить';
        buttonOptionDelete.classList.add('modal-chapter-edit-options-button_delete');
        optionsContainerElement.append(inputOption1, inputOption2, inputOption3, buttonOptionDelete);
        optionsContainer.appendChild(optionsContainerElement);
      })
    } else {
      const optionsContainerElement = document.createElement('div');
      optionsContainerElement.classList.add('modal-chapter-edit-options-container-element');
      const inputOption1 = document.createElement('input');
      inputOption1.classList.add('modal-chapter-edit-options-input')
      const inputOption2 = document.createElement('input');
      inputOption2.classList.add('modal-chapter-edit-options-input')
      const buttonOptionDelete = document.createElement('button');
      buttonOptionDelete.textContent = 'удалить';
      buttonOptionDelete.classList.add('modal-chapter-edit-options-button_delete');
      optionsContainerElement.append(inputOption1, inputOption2, buttonOptionDelete);
      optionsContainer.appendChild(optionsContainerElement);
    }
    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('modal-button-container');

    const buttonAddOption = document.createElement('button');
    buttonAddOption.classList.add('modal-chapter-edit-button-add_option');
    buttonAddOption.textContent = 'Добавить';
    buttonAddOption.addEventListener('click', async(event) => {
      const optionsContainerElement = document.createElement('div');
      optionsContainerElement.classList.add('modal-chapter-edit-options-container-element');
      const inputOption1 = document.createElement('input');
      inputOption1.classList.add('modal-chapter-edit-options-input')
      const inputOption2 = document.createElement('input');
      inputOption2.classList.add('modal-chapter-edit-options-input')
      const buttonOptionDelete = document.createElement('button');
      buttonOptionDelete.textContent = 'удалить';
      buttonOptionDelete.classList.add('modal-chapter-edit-options-button_delete');
      optionsContainerElement.append(inputOption1, inputOption2, buttonOptionDelete);
      insertPenultimate(content, optionsContainerElement);
    })

    buttons.forEach((button, index) => {
      const buttonCreate = document.createElement('button');
      buttonCreate.classList.add(button[0]);
      buttonCreate.id = button[0];
      buttonCreate.textContent = button[1];
      buttonsContainer.appendChild(buttonCreate);
    })
    content.append(labelMethods, inputMethods, divCourse,  labeloptions, optionsContainer, buttonAddOption,  buttonsContainer);

    return content;
  }
  async renderNotification(text, idGame) {
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
        body: JSON.stringify({idGame}),
        headers: {
          'Content-Type': 'application/json',
        }
      }
      const requestCreateGame = await fetch(`/admin/deletegame`, optionsCreateGame);
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
  async renderNotificationChapter(text, idGame) {
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
        body: JSON.stringify({idGame}),
        headers: {
          'Content-Type': 'application/json',
        }
      }
      const requestCreateGame = await fetch(`/admin/deletechapter`, optionsCreateGame);
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