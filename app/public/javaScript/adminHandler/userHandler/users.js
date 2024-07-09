import { Filter } from '../../components/admin/users/filter.js';
import { Content } from '../../components/admin/users/content.js';

const createUsersContent = async() => {
  try {
    const content = document.getElementById('content');

/*     const orderHeader = document.createElement('section');
    orderHeader.id = 'content-users_header';
    orderHeader.classList.add('content-users_header'); */

/*     const orderFilter = document.createElement('section');
    orderFilter.id = 'content-users_filter'
    orderHeader.classList.add('content-users_filter'); */

    const userContent = document.createElement('section');
    userContent.id = 'content-users_content';
    userContent.classList.add('content-users_content');
  ////
    const reqInfo = await fetch('/admin/info');
    const resInfo = await reqInfo.json();

    
/*     const filter = new Filter(resProducts);
    const createFilter = filter.render()
    orderFilter.appendChild(createFilter); */
    const contentUsers = new Content(resInfo.users);
    const createContent = contentUsers.render()
    userContent.appendChild(createContent);
    content.append(userContent);
  } catch(error) {
    console.log(error)
  }
}
export default createUsersContent;