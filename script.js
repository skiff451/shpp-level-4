'use strict';

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
      console.log("SERVER DATA", json.data);
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
  const parentElement = document.querySelector(config.parent),
    columnsNames = config.columns.map(col => col.title),
    columnsValues = config.columns.map(col => col.value);
  const table = createTableElement('table', createTableHead(columnsNames))
  table.append(createTableBody(columnsValues, data))
  parentElement.append(table);
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
  return createTableElement('thead', trHead);
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

  deleteBtn.addEventListener('click', deleteFunction(id, url));
  return deleteBtn;
}

function deleteFunction(id, url) {
  return () => {
    const deleteUrl = url + id;
    fetch(deleteUrl, {
      method: 'DELETE',
    })
      .then(document.querySelector('table').remove())
      .then(setServerDataIntoTable(config1, constructTable))
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


// fetch('http://mock-api.shpp.me/ssamohval/users/10',{
//   method: 'DELETE',
// }).then();

// fetch('http://mock-api.shpp.me/ssamohval/users')
//   .then((response) => response.json())
//   .then((json) => console.log(json));

// fetch('http://mock-api.shpp.me/ssamohval/users/', {
//   method: 'POST',
//   body: JSON.stringify(
//     {
//       "name": "Coca",
//       "surname": "Cola",
//       "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/arashmanteghi/128.jpg",
//       "birthday": "2021-04-24T13:42:31.357Z",
//       // "id": 1
//     }

//   ),
//   headers: {
//     'Content-type': 'application/json; charset=UTF-8',
//   },
// })
//   .then((response) => response.text())
//   .then((json) => {
//     console.log("json in post", json)
//   })
  // .then(() => {
  //   fetch('http://mock-api.shpp.me/ssamohval/users')
  //     .then((response) => response.json())
  //     .then((json) => console.log(json));
  // });

// fetch('http://mock-api.shpp.me/ssamohval/users/', {
//   method: 'POST',
//   body: JSON.stringify(
//     {
//       "name": "Georgiy",
//       "surname": "Kozubin",
//       "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/arashmanteghi/128.jpg",
//       "birthday": "2021-05-24T13:42:31.357Z",
//       // "id": 1
//     }

//   ),
//   headers: {
//     'Content-type': 'application/json; charset=UTF-8',
//   },
// })
//   .then((response) => response.text())
//   .then((json) => {
//     console.log("json in post", json)
//   }).then(() => {
//     // fetch('http://mock-api.shpp.me/ssamohval/users')
//     //   .then((response) => response.json())
//     //   .then((json) => console.log(json));
//   });


  // fetch('http://mock-api.shpp.me/ssamohval/users/', {
  //   method: 'POST',
  //   body: JSON.stringify(
  //     {
  //       "name": "ZORRO",
  //       "surname": "Zavalskii",
  //       "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/arashmanteghi/123.jpg",
  //       "birthday": "2021-01-24T13:42:31.357Z",
  //     }

  //   ),
  //   headers: {
  //     'Content-type': 'application/json; charset=UTF-8',
  //   },
  // })
  //   .then((response) => response.text())
  //   .then((json) => {
  //     console.log("json in post", json)
  //   }).then(() => {
  //     fetch('http://mock-api.shpp.me/ssamohval/users')
  //       .then((response) => response.json())
  //       .then((json) => console.log(json));
  //   });

