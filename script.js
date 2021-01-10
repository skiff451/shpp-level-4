'use strict';

const obj = { a: 1, b: 2, c: 3 }

console.log(Object.values(obj));


function DataTable(config, data) {


  if (!data) {
    setServerDataIntoTable(config, constructTable);
  } else {
    constructTable(config, data);
  }
}

function setServerDataIntoTable(config, tableConstructor) {
  const url = config.apiUrl;
  fetch(url)
    .then((response) => response.json())
    .then((json) => Object.values(json.data))
    .then(tableData => {
      console.log(tableData);
      tableConstructor(config, tableData);
    })
}

function constructTable(config, data) {
  const parentElement = document.querySelector(config.parent),
    columnsNames = config.columns.map(col => col.title),
    columnsValues = config.columns.map(col => col.value);
  const table = createTableElement('table', createTableHead(columnsNames))
  table.append(createTableBody(columnsValues, data))
  parentElement.append(table);
}

function createTableElement(elementName = 'td', content = 'null') {
  const element = document.createElement(elementName);
  if (Array.isArray(content)) {
    content.forEach(item => element.append(item));
  } else {
    element.append(content);
  }
  return element;
}

function createTableHead(columnsNames) {
  columnsNames.unshift('№');
  const thArr = columnsNames.map(item => {
    return createTableElement('th', item);
  }),
    trHead = createTableElement('tr', thArr);
  return createTableElement('thead', trHead);
}

function createTableBody(columnsValues, data) {
  const tableBodyTrs = [];
  data.forEach((dataItem, index) => {
    const tableBodyTds = [];
    tableBodyTds.push(createTableElement('td', index + 1));
    columnsValues.forEach(colProp => {

      dataItem[colProp] = birthdayData(dataItem, colProp);

      tableBodyTds.push(createTableElement('td', dataItem[colProp]));
    })
    tableBodyTrs.push(createTableElement('tr', tableBodyTds));
  })
  return createTableElement('tbody', tableBodyTrs);
}

function birthdayData(data, columnProperty) {
  if (columnProperty === 'birthday') {
    console.log('date1 ', data[columnProperty]);
    const date = new Date(data[columnProperty]),
      birthdayDay = `${addZero(date.getDay() + 1)}.${ addZero(date.getMonth() + 1)}.${date.getFullYear()}`;
    return birthdayDay;
  } else {
    return data[columnProperty];
  }
}

function addZero(dateItem) {
  if (dateItem < 10) {
    return `0${dateItem}`;
  } else {
    return dateItem;
  }
}


const config1 = {
  parent: '#usersTable',
  apiUrl: 'http://mock-api.shpp.me/ssamohval/users/',

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


// fetch('http://mock-api.shpp.me/ssamohval/users/1', {
//   method: 'POST',
//   body: JSON.stringify({
//     "name": "Serghey",
//     "surname": "Samokhval",
//     "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/arashmanteghi/128.jpg",
//     "birthday": "2020-12-24T13:42:31.357Z",
//     "id": 1
//   }),
//   headers: {
//     'Content-type': 'application/json; charset=UTF-8',
//   },
// })
//   .then((response) => response.json())
//   .then((json) => console.log(json));


// fetch('http://mock-api.shpp.me/ssamohval/users/1')
//   .then((response) => response.json())
//   .then((json) => console.log(json));