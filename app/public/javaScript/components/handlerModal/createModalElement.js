export class ModalElement { 
  constructor() {
    
  }
  renderLabel(forElement, text, id) {
    const label = document.createElement('label');
    label.htmlFor = forElement;
    label.textContent = text;
    label.id = id;
    return label;
  }
  renderSelect(id, value, data, init) {
    const select = document.createElement('select')
    select.id = id;
    if(init === 'init' || !init) {
      if(value === 'name') {
        data.forEach( game => {
          const option = document.createElement('option');
          option.textContent = game[value];
          option.value = game[value];
          select.appendChild(option);
        })
      }
      if(value === 'region') {
        data.forEach( game => {
          if(game.name === data[0].name){
            game.region.forEach(region => {
              const option = document.createElement('option');
              option.textContent = region;
              option.value = region;
              select.appendChild(option);
            })
          }
        })
      }
    } else {
      if(value === 'name') {
        data.forEach( game => {
          const option = document.createElement('option');
          option.textContent = game[value];
          option.value = game[value];
          select.appendChild(option);
        })
      }
      if(value === 'region') {
        data.forEach( game => {
          if(game.name[0] === init){
            game.region.forEach(region => {
              const option = document.createElement('option');
              option.textContent = region;
              option.value = region;
              select.appendChild(option);
            })
          }
        })
      }
    }

    return select;
  }

  renderInput(id, data, init) {
    const input = document.createElement('input');
    input.id = id
    if(init === 'init') {
      data.forEach( game => {
        if(game.name[0] === data[0].name){
          if(game.region[0] === data[0].region) {
            if(game.methodDelivery) {
              input.value = game.methodDelivery;
            }
          }
        }
      })
    } else {
      data.forEach( game => {
        if(game.name[0] === init){
          if(game.region[0] === data[0].region) {
            if(game.methodDelivery) {
              input.value = game.methodDelivery;
            }
          }
        }
      })
    }
    return input;
  } 

  renderGoldOptions(id) {
    const divElement = document.createElement('div');
    divElement.classList.add('chapter-options');

    const inputValue = document.createElement('input');
    inputValue.classList.add('chapter-options-input-1');

    const inputLink = document.createElement('input');
    inputLink.classList.add('chapter-options-input-2');

    const buttonDeleteOption = document.createElement('button');
    buttonDeleteOption.classList.add('chapter-options-buttons-delete');
    buttonDeleteOption.textContent = 'Удалить';

    const buttonAddOption = document.createElement('button');
    buttonAddOption.classList.add('chapter-options-buttons-add');
    buttonAddOption.textContent = 'Добавить';
    divElement.append(inputValue, inputLink, buttonDeleteOption);
    return divElement;
  }
}