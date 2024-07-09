
import { Panel } from '../../components/admin/finances/panel.js';
import { ContentFinance } from '../../components/admin/finances/content.js';
const createFinancesContent = async() => {
  const content = document.getElementById('content');
  const reqPayments = await fetch('/admin/getpayments');
  const resPayments = await reqPayments.json();
  console.log(resPayments)
  const panelElement = new Panel(resPayments.payments);
  const createPanelElement = panelElement.render();

  const contentElement = new ContentFinance(resPayments.payments.orders);
  const createcontentElement = contentElement.render();

  content.append(createPanelElement, createcontentElement)
  return content;
}
export default createFinancesContent;