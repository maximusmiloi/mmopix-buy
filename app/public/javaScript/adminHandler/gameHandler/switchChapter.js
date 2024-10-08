import { Switcher, Filter, Content} from '../../components/admin/games/components.js';
import { Modal } from '../../components/modal.js';

export const createContentChapter = async(value, gameData, chapterData) =>{
  const contentContainer = document.getElementById('content');
  contentContainer.innerHTML = '';

  const mainContentElement = document.createElement('section');
  mainContentElement.id = 'main-panel2';
  mainContentElement.classList.add('main-panel2');

  const mainFilterElement = document.createElement('section');
  mainFilterElement.id = 'main-filter';
  mainFilterElement.classList.add('main-filter');

  const mainFilterElementGames = document.createElement('main-content');
  mainFilterElementGames.id = 'main-content';
  mainFilterElementGames.classList.add('main-content');
  contentContainer.append(mainContentElement, mainFilterElement, mainFilterElementGames);

  const indicatorLoad = document.getElementById('escapingBallG'); 

  const header = new Switcher(value);
  const createHeader = header.render();
  mainContentElement.appendChild(createHeader);
  
  const filter = new Filter(value);
  const createfilter = filter.render();
  mainFilterElement.appendChild(createfilter);

  const content = new Content(chapterData);
  const createContent = content.render();
  mainFilterElementGames.appendChild(createContent);
  if (value === 'chapters') {
    const buttonCreateChapterGold = document.querySelector(`.main-filter-button`);
    const buttonEditChapter = document.querySelectorAll('.main-content-container-button-edit');
    const buttonEditDelete = document.querySelectorAll('.main-content-container-button-delete');
    const changeStateChapter = document.querySelectorAll('.enable-disable-chapter');

    buttonCreateChapterGold.addEventListener('click', async(event) => {
      if(buttonCreateChapterGold.value === 'create-new-chapter') {
        document.querySelector('.modal-overlay').style.display = 'block';
        const mainModal = document.getElementById('modal');
        const mainModalContent = new Modal(value, ['Game', 'Region', /* 'Version', */ 'Type'], [['modal-button-close', 'Закрыть'], ['modal-button-create-chapter', 'Создать']], gameData);
        const mainModalContentElement = mainModalContent.render();
        mainModal.appendChild(mainModalContentElement)
        mainModal.style.display = 'flex';
  
        const buttonCreateChapter = document.querySelector('.modal-button-create-chapter');
        const buttonCreateClose = document.querySelector('.modal-button-close');
        buttonCreateClose.addEventListener('click', async(event) => {
          document.querySelector('.modal-overlay').style.display = 'none';
          mainModal.style.display = 'none';
          indicatorLoad.style.display = 'none';
        })
        buttonCreateChapter.addEventListener('click', async(event) => {
          indicatorLoad.style.display = 'block';
          
          const selects = event.target.parentElement.parentElement.querySelectorAll('select');
          const inputCourse = document.getElementById('chapter-course-input');
          const inputCourseText = document.getElementById('chapter-course-input-text');
          const inputCourseFactor = document.getElementById('chapter-course-input-factor');
          const valueCourse = inputCourse.value;
          const valueCourseText = inputCourseText.value;
          const valueCourseFactor = inputCourseFactor.value;
          const courseArray = [valueCourse, valueCourseText, valueCourseFactor];
          const values = Array.from(selects).map(select => {
            return select.value.split(',').map(item => item.trim());
          });
          const optionsCreateChapter = {
            method: 'POST',
            body: JSON.stringify({values, courseArray}),
            headers: {
              'Content-Type': 'application/json',
            }
          }

          const requestCreateChapter = await fetch(`/admin/createnewchapter`, optionsCreateChapter);
          const responseCreateChapter = await requestCreateChapter.json();
          if(responseCreateChapter.message === 'success') {
            /* indicatorLoad.style.display = 'none'; */
            indicatorLoad.style.color = 'green';
            indicatorLoad.textContent = 'Раздел добавлен'
          }
          if(responseCreateChapter.message === 'haveChapter') {
            indicatorLoad.style.color = 'red';
            indicatorLoad.textContent = 'Такой раздел уже есть'
          }

        })
      }
    })
    buttonEditDelete.forEach(button => {
      button.addEventListener('click', async(event) => { 
        const idGame = event.target.dataset.id;
        const modalDelete = new Modal();
        const createModalDelete = await modalDelete.renderNotificationChapter('Раздел и все связанные с ним продукты будут удалены', idGame);
        contentContainer.append(createModalDelete)  
      } )
    })
    buttonEditChapter.forEach(button => {
      button.addEventListener('click', async(event) => {
        const idChapter = event.target.dataset.id;
        const dataElement = chapterData.find(element => element._id === idChapter);
        const mainModal = document.getElementById('modal');
        const mainModalContent = new Modal(/* value, ['Method Delivery', 'Options'], [['modal-button-close', 'Закрыть'], ['modal-button-create-chapter', 'Сохранить']], chapterData */);
        const mainModalContentElement = mainModalContent.renderEditChapter(dataElement, [['modal-button-close', 'Закрыть'], ['modal-button-chapter-edit_save', 'Сохранить']]);
        mainModal.appendChild(mainModalContentElement);
        mainModal.style.display = 'flex';

        const buttonCreateClose = document.querySelector('.modal-button-close');
        buttonCreateClose.addEventListener('click', async(event) => {
          document.querySelector('.modal-overlay').style.display = 'none';
          mainModal.style.display = 'none';
          indicatorLoad.style.display = 'none';
        })
        const buttonCreateSave = document.querySelector('.modal-button-chapter-edit_save');
        buttonCreateSave.addEventListener('click', async(event) => {
          indicatorLoad.style.display = 'block';
          const inputMethods = document.getElementById('modal-chapter-edit-methods');
          const optionContainerDivs = document.querySelectorAll('.modal-chapter-edit-options-container-element');
          const optionsArray = [];
          optionContainerDivs.forEach(div => {
            const inputArray = [];
            const inputs = div.querySelectorAll('input');
            inputs.forEach( input => {
              if(input.value && input.value.length > 0) {
                inputArray.push([input.value]);
              }
            })
            if(inputArray.length > 0) {
              optionsArray.push(inputArray);
            }
          });
          const methodsDelivery = inputMethods.value.split(',').map(item => item.trim());;
          const inputCourse = document.getElementById('chapter-course-input');
          const inputCourseText = document.getElementById('chapter-course-input-text');
          const inputCourseFactor = document.getElementById('chapter-course-input-factor');
          const valueCourse = inputCourse.value;
          const valueCourseText = inputCourseText.value;
          const valueCourseFactor = inputCourseFactor.value;
          const courseArray = [valueCourse, valueCourseText, valueCourseFactor];
          const optionsCreateChapter = {
            method: 'POST',
            body: JSON.stringify({optionsArray, idChapter, methodsDelivery, courseArray}),
            headers: {
              'Content-Type': 'application/json',
            }
          }
          const requestCreateChapter = await fetch(`/admin/editchapter`, optionsCreateChapter);
          const responseCreateChapter = await requestCreateChapter.json();
          if(responseCreateChapter.message === 'success') {

            indicatorLoad.style.color = 'green';
            indicatorLoad.textContent = 'Раздел добавлен'
          }
          if(responseCreateChapter.message === 'haveChapter') {
            indicatorLoad.style.color = 'red';
            indicatorLoad.textContent = 'Такой раздел уже есть'
          }
          indicatorLoad.style.display = 'none';
        })
        const buttonOptionDelete = document.querySelectorAll('.modal-chapter-edit-options-button_delete')
        buttonOptionDelete.forEach(button => {
          button.addEventListener('click', async(event) => {
            const parentDiv = event.target.closest('div');
            const firstInputValue = parentDiv.querySelector('input').value;
            const requestStateGame = await fetch(`/admin/deleteoption?id=${idChapter}&nameoption=${firstInputValue}`);
            const responseStateGame = await requestStateGame.json();
            event.target.parentElement.remove();
          })
        })
      })
    })
    changeStateChapter.forEach(element => {
      element.addEventListener('click', async(event) => {
        const idElement = element.parentElement.parentElement.parentElement.dataset.index;
        if(event.target.checked) {
          event.target.checked = true;
          const requestStateGame = await fetch(`/admin/statechapter?state=${event.target.checked}&id=${idElement}`)
          const responseStateGame = await requestStateGame.json();
        } else {
          event.target.checked = false;
          const requestStateGame = await fetch(`/admin/statechapter?state=${event.target.checked}&id=${idElement}`);
          const responseStateGame = await requestStateGame.json();
        }
      })
    })
  }

}
