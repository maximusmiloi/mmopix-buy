(async() => {
  const indicator = document.querySelector('.indicator-log');
  try{
    const loginButton = document.getElementById('button-log');
    const loginElement = document.getElementById('login');
    const passwordElement = document.getElementById('password');
    loginButton.addEventListener('click', async(event) => {
        const login = loginElement.value;
        const password = passwordElement.value;
        if(!login || !password) {
          indicator.style.display = 'block';
          indicator.innerHTML = 'Какое-то из полей не заполнено';
          return 'error'  
        }
        const options = {
          method: 'POST',
          body: JSON.stringify({login, password}),
          headers: {
            'Content-Type': 'application/json',
          }
        }
        const request = await fetch('/auth/login', options);
        const respone = await request.json();
        if(respone.message === 'success') {
          window.location.href = '/';
        }
        if(respone.message === 'incorrectPassword') {
          indicator.style.display = 'block';
          indicator.style.color = 'red';
          indicator.textContent = 'НЕВЕРНЫЙ ЛОГИН ИЛИ ПАРОЛЬ'
          /* window.location.href = '/auth/login'; */
        }
        
/*         if(respone.message === 'loginSucces') {
          indicator.style.display = 'block';
          indicator.innerHTML = 'Успешный вход';
          console.log(respone);
          return 'succes'   
        }
        if(respone.message === 'errorPassword') {
          indicator.style.display = 'block';
          indicator.innerHTML = 'Неверный логин или пароль';
          console.log(respone);
          return 'errorPassword'   
        } */
    })
  } catch(error) {
    console.log(error.message);
    indicator.style.display = 'block';
    indicator.innerHTML = 'Непредвиденная ошибка. Обратитесь к администратору';
    return 'error'  
  }
})()