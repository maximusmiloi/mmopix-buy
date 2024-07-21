export class Switcher {
  constructor(value) {
    this.value = value;
  }
  createRadioContainer(id, value, labelText, checked) {
    const container = document.createElement('div');
    container.classList.add('main-panel2-radio');

    const radio = document.createElement('input');
    [radio.id, radio.type, radio.name, radio.value] = [id, 'radio', 'select-header', value];
    radio.checked = checked;
    const label = document.createElement('label');
    label.htmlFor = id;
    label.textContent = labelText;

    container.appendChild(radio);
    container.appendChild(label);

    return container;
  }

  render() {
    let mainHeader = document.querySelector('.main-header');
    if (!mainHeader) {
      mainHeader = document.createElement('div');
      mainHeader.classList.add('main-header');
    } else {
      // Очищаем предыдущий контент
      mainHeader.innerHTML = '';
    }

    if (this.value === 'games') {
      const containerGames = this.createRadioContainer('select-header-1', 'games', 'Games', true);
      const containerChapters = this.createRadioContainer('select-header-2', 'chapters', 'Chapters');

      mainHeader.appendChild(containerGames);
      mainHeader.appendChild(containerChapters);
    }
    if (this.value === 'chapters') {
      const containerGames = this.createRadioContainer('select-header-1', 'games', 'Games');
      const containerChapters = this.createRadioContainer('select-header-2', 'chapters', 'Chapters', true);
      mainHeader.appendChild(containerGames);
      mainHeader.appendChild(containerChapters);
    }

    // Add other conditions as needed

    return mainHeader;
  }
}
export class Filter {
  constructor(value, game, region, /* version, */ type) {
    this.value = value;
    this.game = game;
    this.region = region;
/*     this.version = version; */
    this.type = type;
  }
  render() {
    if(this.value === 'games') {
      const mainFilter = document.getElementById('main-filter');
      mainFilter.innerHTML = '';
      let buttonCreate = document.createElement('button');
      buttonCreate.textContent = 'Добавить игру';
      buttonCreate.value = 'create-new-game';
      buttonCreate.classList.add('main-filter-button');
      let buttonUpdatePrices = document.createElement('button');
      buttonUpdatePrices.textContent = 'Обновить цены';
      buttonUpdatePrices.value = 'update-prices';
      buttonUpdatePrices.classList.add('main-filter-button-prices_update');
      return [buttonCreate, buttonUpdatePrices];
    }
    if(this.value === 'chapters') {
      let mainFilter = document.querySelector('.main-filter');
      mainFilter.innerHTML = '';
      let buttonCreate = document.createElement('button');
      buttonCreate.textContent = 'Добавить раздел Золота';
      buttonCreate.value = 'create-new-chapter';
      buttonCreate.classList.add('main-filter-button');
      return buttonCreate;
    }
  }
}

export class Content {
  constructor(data) {
    this.data = data
  }

  renderGames(element) {
    const contentContainerItem = document.createElement('div');
    const keys = Object.keys(element);
    keys.forEach(key => {
      if(key === 'name' || key === 'region' || key === 'methodDelivery' || /* key === 'options' || */ key === 'state'){
        if(key === 'state') {
          const contentContainerItemElement = document.createElement('div');
          const contentContainerItemElementName = document.createElement('div');
          const contentContainerItemElementValue = document.createElement('div')
          const contentContainerItemInput = document.createElement('input');
          contentContainerItemElementValue.appendChild(contentContainerItemInput);
          contentContainerItemInput.id = 'enable-disable-chapter';
          contentContainerItemInput.classList.add('enable-disable-chapter');
          contentContainerItemInput.type = 'checkbox';
          contentContainerItemInput.checked = element.state;
          contentContainerItemInput.style.width = '50px'
          contentContainerItemInput.style.height = '20px'
          contentContainerItemElementName.textContent = key;
          contentContainerItemElement.append(contentContainerItemElementName, contentContainerItemElementValue);
          contentContainerItem.appendChild(contentContainerItemElement);
        } else {
          const contentContainerItemElement = document.createElement('div');
          contentContainerItemElement.classList.add('main-content-container-element-div');
          const contentContainerItemElementName = document.createElement('div');
          const contentContainerItemElementValue = document.createElement('div');
          contentContainerItemElementName.textContent = key;
          contentContainerItemElementValue.textContent = element[key];
          contentContainerItemElement.append(contentContainerItemElementName, contentContainerItemElementValue);
          contentContainerItem.appendChild(contentContainerItemElement);
        }
      }
    })
    const contentContainerItemElement = document.createElement('div');
    contentContainerItemElement.style.dispay = 'flex';
    contentContainerItemElement.style.flexDirection = 'column';
    contentContainerItemElement.style.justifyContent = 'center';
    contentContainerItemElement.style.alignItems = 'center';
    contentContainerItemElement.style.gap = '5px';

    const buttonDelete = document.createElement('button');

    buttonDelete.id = 'main-content-container-button-delete';
    buttonDelete.classList.add('main-content-container-button-delete');
    buttonDelete.textContent = 'Удалить';
    buttonDelete.setAttribute('data-id', element._id);

    const buttonEdit = document.createElement('button');
    buttonEdit.id = 'main-content-container-button-edit';
    buttonEdit.classList.add('main-content-container-button-edit');
    buttonEdit.textContent = 'Редактировать';
    buttonEdit.setAttribute('data-id', element._id);

    contentContainerItemElement.append(buttonDelete, buttonEdit);
    contentContainerItem.appendChild(contentContainerItemElement);
    return contentContainerItem;
  }
  render() {
    const mainContentGames = document.getElementById('main-content');
    mainContentGames.innerHTML = '';

    //const mainContent = document.createElement('div');
    const contentContainer = document.createElement('div');
    contentContainer.classList.add('main-content-container');
    const contentRows = async(data) => {
      if(data) {

        data.forEach(element => {
          const contentContainerItem = this.renderGames(element);
          contentContainerItem.setAttribute('data-index', element._id);
          contentContainerItem.id = 'main-content-container-element';
          contentContainerItem.classList.add('main-content-container-element')
          contentContainer.appendChild(contentContainerItem)
        });
        
  /*       mainContent.appendChild(contentContainer) */
      }
    }
    const paginationContainer = document.createElement('div');
    paginationContainer.classList.add('pagination-container');
    let numberPage = (this.data.length / 10) < 1 ? 0 : Math.ceil(this.data.length / 10);
    //pagination
    console.log(numberPage)
    console.log(this.data)
    if(numberPage > 0) {
      console.log(numberPage)
      console.log(this.data.reverse())
      const data0Page = this.data.slice(0, 9).reverse();
      contentRows(data0Page);
    } else {
      contentRows(this.data);
    }

    while(numberPage >= 1) {
      const containerPage = document.createElement('span');
      containerPage.classList.add('pagination-page');
      containerPage.textContent = numberPage;
      paginationContainer.insertBefore(containerPage, paginationContainer.firstChild)
      numberPage = numberPage - 1;
    }
    contentContainer.appendChild(paginationContainer);
    const page = paginationContainer.querySelectorAll('.pagination-page');

    const currentPage = localStorage.getItem('admin-order-page');

    function paginate(array, pageNumber, itemsPerPage) {
      let startIndex = ((pageNumber * 10) -10);
      if(startIndex > 0) {
        startIndex - 1;
      }
      const endIndex = pageNumber * 10;
      return array.slice(startIndex, endIndex).reverse();
    }
    page.forEach(element => {
      if(+element.textContent === +currentPage) {
        element.style.color = '#FF7A00';
      }
      element.addEventListener('click', async(event) => {
        page.forEach(p => {
          p.style.color = 'white';
        });
        localStorage.setItem('admin-order-page', event.target.textContent);
        console.log(event.target.innerHTML)
        event.target.style.color = '#FF7A00';
        contentContainer.innerHTML = ''; 
        /* const data0Page = this.data.reverse().slice(0, 9); */
        const data0Page = paginate(this.data, event.target.innerHTML, this.data.length);
        contentRows(data0Page);
        contentContainer.appendChild(paginationContainer);
      })
    });
    return contentContainer;
    //pagination
  }
}