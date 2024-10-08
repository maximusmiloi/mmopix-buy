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

/*       const imgButton = document.createElement('img');
      imgButton.src = 'img/logos_telegram.png'; */

      const containerButton = document.createElement('div');
      containerButton.classList.add('container-button-not');
      const button = document.createElement('button');
      button.classList.add('notification-content-container-button');
      button.id = 'notification-button';
      /* button.append(); */
      button.innerHTML = `<img src="img/logos_telegram.png"> <div>Подключить</div>`;
      

      const indicatorNot = document.createElement('div');
      indicatorNot.classList.add('indicator-telegram');
      if(this.data.user.telegramId && this.data.user.telegramId > 0 && this.data.user.token && this.data.user.token.length > 0) {
        indicatorNot.style.color = 'green';
        indicatorNot.textContent = 'Тегерам подключен';
        indicatorNot.style.border = '3px solid green';
      } else {
        indicatorNot.style.color = 'gray';
        indicatorNot.textContent = 'Тегерам не подключен';
        indicatorNot.style.border = '3px dashed gray';
      }
      containerButton.append(button, indicatorNot);
      button.addEventListener('click', async event => {
        const req = await fetch('/seller/checktoken');
        const res = await req.json();
        if(res.token) {
          window.open(`https://t.me/MmopixStore_bot?start=${res.token}`, '_blank');
        } else {
          p.style.color = 'red';
          p.style.fontSize = '16px';
          p.innerHTML = 'Что-то пошло не так. Обновите страницу и попробуйте снова';
        }
        
      })
      contentContainer.append(h2, p, containerButton);
      return contentContainer;
    } catch(error){
      console.log(error.message);
      return error.message;
    }
  }
}