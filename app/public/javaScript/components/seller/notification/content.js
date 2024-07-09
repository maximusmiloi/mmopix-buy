import {Modal} from './elements/modal.js';
export class ContentNotifications {
  constructor(data) {
    this.data = data;
  }
  render() {
    try {
      const contentContainer = document.createElement('div');
      contentContainer.classList.add('notification-content-container');

      const h2 = document.createElement('h2');
      h2.classList.add('notification-content-container-h2')
      h2.textContent = 'Уведомления Telegram';

      const p = document.createElement('p');
      p.classList.add('notification-content-container-p');
      p.textContent = 'Вы будете получать оповещения когда на Ваш товар найдётся продавец или покупатель.';

      const imgButton = document.createElement('img');
      imgButton.src = 'img/logos_telegram.png';

      const button = document.createElement('button');
      button.classList.add('notification-content-container-button');
      button.id = 'notification-button';
      button.textContent = 'Подключить';
      button.append(imgButton);

      button.addEventListener('click', async event => {
        const req = await fetch('/seller/checktoken');
        const res = await req.json();
        if(res.token) {
          window.open(`https://t.me/MmopixStore_bot/start${res.token}`, '_blank');
        } else {
          p.style.color = 'red';
          p.style.fontSize = '16px';
          p.innerHTML = 'Что-то пошло не так. Обновите страницу и попробуйте снова';
        }
        
      })
      contentContainer.append(h2, p, button);
      return contentContainer;
    } catch(error){
      console.log(error.message);
      return error.message;
    }
  }
}