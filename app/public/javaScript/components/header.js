export class Profile {
  constructor(role, balance) {
    this.role = role;
    this.balance = balance;
/*     this.$balance = document.querySelector(selector.balance),
    this.$menu = document.querySelector(selector.menu) */
  }
  render() {
    const userInfoDiv = document.createElement('div');
    userInfoDiv.classList.add('profile-info-container');
    if(!this.role) {
      const linkLogin = document.createElement('a');
      const linkRegister = document.createElement('a');
      linkLogin.textContent = 'Войти';
      linkRegister.textContent = 'Регистрация';
      linkLogin.href = `/auth/login`;
      linkRegister.href = `/auth/registration`;
      userInfoDiv.appendChild(linkLogin);
      userInfoDiv.appendChild(linkRegister);
      return userInfoDiv;
    }
    if(this.role === 'admin') {
      const userUserInfoDiv = document.createElement('div');
      userUserInfoDiv.classList.add('profile-info-container-user')
      const userBalance = document.createElement('span');
      userBalance.classList.add('profile-info-container-balance');
      userBalance.textContent = this.balance + `$`;
      const imgProfile = document.createElement('img');
      imgProfile.src = `img/profile.png`;
      const link = document.createElement('a');
      link.href = '/admin';
      link.appendChild(imgProfile);
      const logout = document.createElement('a');
      logout.textContent = 'Выйти';
      logout.href = '/';
      userUserInfoDiv.appendChild(userBalance);
      userUserInfoDiv.appendChild(link);
      userUserInfoDiv.appendChild(logout);
      userInfoDiv.appendChild(userUserInfoDiv);

      logout.addEventListener('click', async event => {
        await fetch('/auth/logout');
      })
      return userInfoDiv;
    }
    if(this.role === 'seller') {
      const userUserInfoDiv = document.createElement('div');
      userUserInfoDiv.classList.add('profile-info-container-user')
      const userBalance = document.createElement('span');
      userBalance.classList.add('profile-info-container-balance');
      userBalance.textContent = this.balance + `$`;
      const imgProfile = document.createElement('img');
      imgProfile.src = `img/profile.png`;
      const link = document.createElement('a');
      link.href = '/seller'
      link.appendChild(imgProfile);
      const logout = document.createElement('a');
      logout.textContent = 'Выйти';
      logout.href = '/';
      userUserInfoDiv.appendChild(userBalance);
      userUserInfoDiv.appendChild(link);
      userUserInfoDiv.appendChild(logout);
      userInfoDiv.appendChild(userUserInfoDiv);

      logout.addEventListener('click', async event => {
        await fetch('/auth/logout');
      })
      return userInfoDiv;
    }
  }
}
