import { Filter } from '../../components/admin/users/filter.js';
import { Content } from '../../components/admin/users/content.js';

const createUsersContent = async() => {
  try {
    const content = document.getElementById('content');
    const userContent = document.createElement('section');
    userContent.id = 'content-users_content';
    userContent.classList.add('content-users_content');
  ////
    const reqInfo = await fetch('/admin/info');
    const resInfo = await reqInfo.json();

    
const filterContainer = document.createElement('div');
const usersContainer = document.createElement('div');

const filter = new Filter(resInfo.users);
const createFilter = filter.render();
filterContainer.appendChild(createFilter);

const contentUsers = new Content(resInfo.users);
const createContent = contentUsers.render();
usersContainer.appendChild(createContent);

userContent.appendChild(filterContainer);
userContent.appendChild(usersContainer); 
content.append(userContent);

const buttonSort = document.getElementById('user-filter-sort-balance');
const inputSortNick = document.getElementById('user-filter-login');

buttonSort.addEventListener('click', event => {
  resInfo.users.sort((a, b) => a.balance - b.balance);

  usersContainer.innerHTML = '';

  const sortedContentUsers = new Content(resInfo.users);
  const createSortedContent = sortedContentUsers.render();
  usersContainer.appendChild(createSortedContent);
});

inputSortNick.addEventListener('change', event => {
  const filteredUsers = resInfo.users.filter(user => user.login == event.target.value);

  usersContainer.innerHTML = '';

  const filteredContentUsers = new Content(filteredUsers);
  const createFilteredContent = filteredContentUsers.render();
  usersContainer.appendChild(createFilteredContent);
});
  } catch(error) {
    console.log(error)
  }
}
export default createUsersContent;