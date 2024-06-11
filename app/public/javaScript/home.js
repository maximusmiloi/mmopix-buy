(async() => {
  const buttonLogoutElement = document.getElementById('logout');
  buttonLogoutElement.addEventListener('click', async(req, res) => {
    try {
      const request = await fetch('/logout')
      const response = await request.json();
      if(response.response === 'out') {
        window.location.href = '/';
      }
      console.log(request)
    } catch(error) {
      console.log(error);
    }
  })
})()