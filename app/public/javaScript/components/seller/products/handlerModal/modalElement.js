export class ModalElement {
  constructor(data) {
    this.data = data;
  }
  renderLabel(id, text) {
    const label = document.createElement('label');
    label.htmlFor = id;
    label.textContent = text;
    return label;
  }
  renderSelect(id) {
    const select = document.createElement('select')
    select.id = id;
    select.classList.add(id);
/*     dataSelect.forEach( chapter => {
      const option = document.createElement('option');
      option.textContent = chapter;
      option.value = chapter;
      select.appendChild(option);
    }) */
    return select;
  }
  renderSpan(id) {
    const span = document.createElement('span');
    span.classList.add(id);
    span.id = id;
    return span;
  }
  renderDiv(id) {
    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.gap = '30px';
    div.classList.add(id);
    div.id = id;
    return div;
  }
  renderCheckBox(id, value) {
    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.alignItems = 'center';
    div.style.gap = '10px';
    const label = document.createElement('label');
    label.id = id;
    label.textContent = `${value}: `;
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.classList.add(id);
    input.id = id;
    input.name = id;
    input.value = value;
    input.style.width = '20px';
    input.style.height = '20px';
    div.append(label, input);
    return div;
  }
  renderInput(id) {
    const span = document.createElement('input');
    span.id = id;
    span.classList.add(id);
    return span;
  }
  renderP(id, text) {
    const p = document.createElement('p');
    p.id = id;
    p.style.color = '#8778D9';
    p.textContent = text;
    p.classList.add(id);
    return p;
  }
}