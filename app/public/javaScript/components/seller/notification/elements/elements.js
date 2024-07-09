export class Elements {
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
    span.id = id;
    return span;
  }
  renderInput(id) {
    const span = document.createElement('input');
    span.id = id;
    return span;
  }
  renderP(id, text) {
    const p = document.createElement('p');
    p.id = id;
    p.style.color = '#8778D9';
    p.textContent = text;
    return p;
  }
  renderCheckbox() {

  }
}