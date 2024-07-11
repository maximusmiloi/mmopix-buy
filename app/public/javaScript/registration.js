(async() => {
  const indicator = document.querySelector('.indicator-reg');
  try{
    const registrationButton = document.getElementById('registration-button');
    const loginElement = document.getElementById('login');
    const passwordElement = document.getElementById('password');
    const passwordTwoElement = document.getElementById('passwordTwo');
    const emailElement = document.getElementById('email');
    
    registrationButton.addEventListener('click', async(event) => {
      indicator.style.display = 'block';
      if(passwordElement.value == passwordTwoElement.value) {
        const login = loginElement.value;
        const password = passwordElement.value;
        const passwordTwo = passwordTwoElement.value;
        const email = emailElement.value;
        if(!login || !password || !passwordTwo || !email) {
          indicator.style.display = 'block';
          indicator.innerHTML = 'Какое-то из полей не заполнено';
          indicator.style.display = 'none';
          return 'error'  
        }
        const options = {
          method: 'POST',
          body: JSON.stringify({login, password, email}),
          headers: {
            'Content-Type': 'application/json',
          }
        }
        const request = await fetch('/auth/register', options);
        const respone = await request.json();
        if(respone.message === 'userRegistered') {
          indicator.style.display = 'block';
          indicator.innerHTML = 'Пользователь успешно создан. Переходим на страницу входа...';
          await new Promise(resolve => setTimeout(resolve, 2000));    
          window.location.href = 'https://mmopix.store/auth/login';
          return 'succes';
        }
        if(respone.message === 'userHaveAlready') {
          indicator.style.display = 'block';
          indicator.innerHTML = 'Пользователь с таким логином уже существует';
          return 'succes'   
        }
      } else {
        indicator.style.display = 'block';
        indicator.innerHTML = 'Пароли не совпадают';
        return 'error'
      }
    })
  } catch(error) {
    console.log(error.message);
    indicator.style.display = 'block';
    indicator.innerHTML = 'Непредвиденная ошибка. Обратитесь к администратору';
    return 'error'  
  }
})()