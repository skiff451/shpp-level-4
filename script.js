'use strict';

const config1 = {
  parent: '#usersTable',
  apiUrl: 'https://mock-api.shpp.me/ssamohval/users/',

  columns: [
    { title: 'Имя', value: 'name' },
    { title: 'Фамилия', value: 'surname' },
    { title: 'День Рождения', value: 'birthday' },
  ]
};

const users = [
  { id: 30050, name: 'Вася', surname: 'Петров', age: 12 },
  { id: 30051, name: 'Вася', surname: 'Васечкин', age: 15 },
  { id: 30052, name: 'Петя', surname: 'Пяточкин', age: 23 },
  { id: 30053, name: 'Иван', surname: 'Иванов', age: 66 },
];

DataTable(config1);


function DataTable(config, data) {

  if (!data) {
    setServerDataIntoTable(config, constructTable);
  } else {
    constructTable(config, { data: data });
  }
}

function setServerDataIntoTable(config, tableConstructor) {
  const url = config.apiUrl;
  fetch(url)
    .then((response) => response.json())// get response and transform to json
    .then((json) => {
      return {// return an object with data
        data: Object.values(json.data),
        id: Object.keys(json.data),
        url: url,
      }
    })
    .then(tableData => {
      tableConstructor(config, tableData); //create table using server data which converted to array
    })
}

//create table

function constructTable(config, data) {
  const parentElement = document.querySelector(config.parent);
  const columnsNames = config.columns.map(col => col.title);
  const columnsValues = config.columns.map(col => col.value);

  const table = createTableElement('table', createTableHead(columnsNames))
  table.append(createTableBody(columnsValues, data))

  parentElement.append(table);

  const addBtn = document.querySelector('.add-button');

  addBtn.addEventListener('click', addInputs(config));
}

//create table element
//'elementName' - a tag name where appends content and then returns it
//'content' - can be a text, HTML element (array of HTML elements)

function createTableElement(elementName = 'td', content = 'null') {
  const element = document.createElement(elementName);
  if (Array.isArray(content)) {
    content.forEach(item => element.append(item));
  } else {
    element.append(content);
  }
  return element;
}

// create table head
function createTableHead(columnsNames) {
  columnsNames.unshift('№');
  columnsNames.push('Действие');
  const thArr = columnsNames.map(item => {
    return createTableElement('th', item);
  }),
    trHead = createTableElement('tr', thArr);

  const elemsArr = [createAddBtn(trHead.childElementCount), trHead];

  return createTableElement('thead', elemsArr);
}


function createAddBtn(childElementCount) {
  const img = document.createElement('img');
  img.setAttribute('src', './icons/Plus icon.svg');

  const elemArr = [img, createTableElement('span', 'Добавить')];
  const td = createTableElement('td', createTableElement('div', elemArr));
  td.setAttribute('colspan', childElementCount);

  const tr = createTableElement('tr', td);
  tr.classList.add('add-button');

  return tr;
}

function addInputs({ apiUrl, columns }) {
  const tHead = document.querySelector('thead');
  const tds = [];
  const inputs = {};

  tds.push(document.createElement('td'));

  columns.forEach((item) => {
    const val = item.value
    const input = createTableElement('input', '');
    inputs[val] = input;

    const td = createTableElement('td', input);
    tds.push(td);
  })

  tds.push(createTableElement('td', createAcceptBtn(apiUrl, inputs)));

  const tr = createTableElement('tr', tds);

  return () => {
    tHead.append(tr);
  }
}

function createAcceptBtn(url, inputs) {
  const acceptBtn = document.createElement('btn');
  acceptBtn.classList.add("accept-button");
  acceptBtn.innerHTML = `<span>Добавить</span><img src="./icons/Ok icon.svg" alt="accept">`

  acceptBtn.addEventListener('click', addUser(url, inputs));
  return acceptBtn;
}

function addUser(url, inputs) {

  return () => {
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(dataToFetch(inputs)),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    }).then(addNewTableRow(dataToFetch(inputs), url))

  }
}



function dataToFetch(inputs) {
  const keys = Object.keys(inputs);
  const data = keys.reduce((startData, currentKey, index) => {
    startData[currentKey] = inputs[keys[index]].value;
    return startData;
  }, {});
  data.avatar = "https://s3.amazonaws.com/uifaces/faces/twitter/arashmanteghi/128.jpg";
  return data;
}

function addNewTableRow(data, url) {
  fetch(url)
  .then((response) => response.json())// get response and transform to json
  .then((json) => {
    const tBody = document.querySelector('tbody');
    const number = new Number(tBody.lastChild.firstChild.innerText);
    const tds = [];
    const dataKeys = Object.keys(data);
    tds.push(createTableElement('td', number + 1));
  
    dataKeys.forEach(key => {
      if (key !== 'avatar') {
        tds.push(createTableElement('td', data[key]))
      }
    })

    const serverData = Object.keys(json.data);
    const prevId = serverData[serverData.length - 1]
    tds.push(createTableElement('td', createDeleteBtn(prevId + 1, url)))

    tBody.append(createTableElement('tr', tds))
  }) 
}


// create table body
function createTableBody(columnsValues, data) {
  const tableBodyTrs = [];
  data.data.forEach((dataItem, index) => {
    const tableBodyTds = [];
    tableBodyTds.push(createTableElement('td', index + 1));
    columnsValues.forEach(colProp => {
      // checks if prop is birthday otherwise just returns without transformation
      dataItem[colProp] = birthdayData(dataItem, colProp);
      tableBodyTds.push(createTableElement('td', dataItem[colProp]));
    })
    tableBodyTds.push(createTableElement('td', createDeleteBtn(data.id[index], data.url)));// add delete btn before adding a table row
    tableBodyTrs.push(createTableElement('tr', tableBodyTds));
  })
  return createTableElement('tbody', tableBodyTrs);
}

function createDeleteBtn(id, url) {
  const deleteBtn = document.createElement('btn');
  deleteBtn.classList.add("delete-button");
  deleteBtn.innerHTML = `<span>Удалить</span><img src="./icons/Remove icon.svg" alt="trash">`

  deleteBtn.addEventListener('click', deleteUser(id, url));
  return deleteBtn;
}

function deleteUser(id, url) {
  return (event) => {
    const deleteUrl = url + id;
    fetch(deleteUrl, {
      method: 'DELETE',
    })
      .then(() => {
        renderTableAfterDeletion(event)
      })
      
  }
}

// checks if data property is a date value
// if it is true just transform value in a date readable 'string'
// else returns property without transformation
function birthdayData(data, columnProperty) {
  if (columnProperty === 'birthday') {
    const date = new Date(data[columnProperty]),
      birthdayDay = `${addZero(date.getDay() + 1)}.${addZero(date.getMonth() + 1)}.${date.getFullYear()}`;
    return birthdayDay;
  } else {
    return data[columnProperty];
  }
}

// add zero to beautify date string
function addZero(dateItem) {
  if (dateItem < 10) {
    return `0${dateItem}`;
  } else {
    return dateItem;
  }
}

function renderTableAfterDeletion(event) {
  const tr = event.path.find(element => element.localName === "tr");
  tr.classList.add('fade');
  setInterval(() => {
    tr.remove();
    const numberedTd = document.querySelectorAll('tbody td:first-child');
    numberedTd.forEach((item, index) => {
      item.innerHTML = index + 1;
    })
  }, 300)
}


