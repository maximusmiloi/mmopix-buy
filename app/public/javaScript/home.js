import { Profile } from "./components/header.js";
(async() => {
  const buttonLogoutElement = document.getElementById('logout');
  if(buttonLogoutElement) {
    buttonLogoutElement.addEventListener('click', async(req, res) => {
      try {
        const request = await fetch('/logout')
        const response = await request.json();
        if(response.response === 'out') {
          window.location.href = '/';
        }
      } catch(error) {
      }
    })
  }
})();
(async() => {
  const userInfo = document.querySelector('.profile-info');
  const request = await fetch('/info');
  const response = await request.json();
  let role;
  let balance;
  !response.user ? role = undefined : role = response.user.role;
  !response.user ? balance = undefined : balance = response.user.balance;
  if(role === undefined) {
    const profile = new Profile(role, balance);
    const element = profile.render();
    userInfo.appendChild(element);
  }
  if(role === 'admin' || role === 'seller') {
    const profile = new Profile(role, balance);
    const element = profile.render();
    userInfo.appendChild(element);
  }
})();
