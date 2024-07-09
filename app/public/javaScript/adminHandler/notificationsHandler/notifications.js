
import { ContentNotications } from '../../components/admin/notifications/content.js';
const createNotificationsContent = async() => {
  const content = document.getElementById('content');


  const contentElement = new ContentNotications();
  const createcontentElement = contentElement.render();

  content.append(createcontentElement)
  return content;
}
export default createNotificationsContent;


