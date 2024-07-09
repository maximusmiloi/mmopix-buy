export class ContentProfiles {
  constructor(data) {
    this.data = data;
  }
  render() {
    const contentContainer = document.createElement('div');
    contentContainer.classList.add('profiles-container');

    const nameContainer = document.createElement('div');
    nameContainer.classList.add('profiles-container-name');
    
    const name = document.createElement('div');
    name.classList.add('profiles-container-name_name');
    name.textContent = this.data.login;

    const emailIdContainer = document.createElement('div');
    emailIdContainer.classList.add('profiles-container-name_div__email_id');

    const email = document.createElement('div');
    email.textContent = this.data.email;
    email.classList.add('profiles-container-name_email');

    const id = document.createElement('div');
    id.textContent = `ID: ${this.data.id}`;
    id.classList.add('profiles-container-name_id');

    const verifContainer = document.createElement('div');
    verifContainer.classList.add('profiles-container-verif');
    const verifContainerMessage = document.createElement('div');
    verifContainerMessage.textContent = 'Что бы получить доступ к заказам на услуги бустинга, Вам требуется пройти верификацию.';
    const veriContainerfButton = document.createElement('div');
    const verifButton = document.createElement('button');
    verifButton.textContent = 'Пройти верификацию';
    veriContainerfButton.append(verifButton);
    verifContainer.append(verifContainerMessage, verifButton);

    emailIdContainer.append(email, id)
    nameContainer.append(name, emailIdContainer);

    const profilesEditInfoContainter = document.createElement('div');
    profilesEditInfoContainter.classList.add('profiles-input-container');
    const inputsProfles = [
      ['profiles-input-telegram', 'Telegram'],
      ['profiles-input-discord', 'Discord'],
      ['profiles-input-password', 'Новый пароль (Должен содержать не менее 6 символов)'],
      ['profiles-input-twopassword', 'Повторите новые пароль']
    ]
    inputsProfles.forEach(id => {
      const label= document.createElement('label');
      label.textContent = id[1];
      label.id = id[0];
      const input= document.createElement('input');
      if(id[1] === 'Telegram') {
        input.value = this.data.telegram;
      }
      if(id[1] === 'Discord') {
        input.value = this.data.discord;
      }
      input.id = id[0];
      input.classList.add('profiles-input');
      profilesEditInfoContainter.append(label, input);
    })
    const saveInfoButton = document.createElement('button');
    saveInfoButton.textContent = 'Сохранить';
    profilesEditInfoContainter.appendChild(saveInfoButton);
    contentContainer.append(nameContainer, verifContainer, profilesEditInfoContainter);

    this.eventButtonSave(saveInfoButton, contentContainer, profilesEditInfoContainter)
    this.eventButtonVerif(verifButton, contentContainer);
    return contentContainer;
  } 
  eventButtonSave(saveInfoButton, contentContainer, profilesEditInfoContainter) {
    saveInfoButton.addEventListener('click', async event => {
      const escapingBallG = document.getElementById('escapingBallG');
      escapingBallG.style.display = 'flex';
/*       const notification = this.notificationModal('Данная функция ещё недоступнна', 'profiles-notification')
      contentContainer.append(notification); */
      const profilesInfo = profilesEditInfoContainter.querySelectorAll('input');
      const info = {
        telegram: profilesInfo[0].value,
        discord: profilesInfo[1].value,
        password: profilesInfo[2].value,
        twopassword: profilesInfo[3].value,
      }
      const options = {
        method: 'POST',
        body: JSON.stringify(info),
        headers: {
          'Content-Type': 'application/json',
        }
      }
      const reqSaveProfiles = await fetch('/seller/profilessave', options)
      const resSaveProfiles = await reqSaveProfiles.json();
      if(resSaveProfiles.message === 'success') {
        escapingBallG.classList.add('notification');
        escapingBallG.style.width = '300px';
        escapingBallG.style.height = '50px';
        escapingBallG.innerHTML = 'Данные обновлены.';
        await new Promise(resolve => setTimeout(resolve, 5000));
        escapingBallG.style.display = 'none';
      } else {
        escapingBallG.classList.add('notification');
        escapingBallG.style.width = '300px';
        escapingBallG.style.height = '50px';
        escapingBallG.innerHTML = 'Ошибка сохранения данных.';
        await new Promise(resolve => setTimeout(resolve, 5000));
        escapingBallG.style.display = 'none';
      }

    })
  }
  eventButtonVerif(verifButton, contentContainer) {
    verifButton.addEventListener('click', event => {
      const notification = this.notificationModal('Данная функция ещё недоступнна', 'profiles-notification')
      contentContainer.append(notification);
    })
  }
  notificationModal(text, id) {
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
    modal.append(buttonContainer);
    return modal;
  }
}