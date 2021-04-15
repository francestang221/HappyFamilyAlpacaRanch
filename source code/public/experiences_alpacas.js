// Reference: code adpated from Mengmeng Tang's CS 290 HW6 assignment
// Date: Feb 25, 2021

const baseUrl = `http://flip3.engr.oregonstate.edu:6799`;


const makeCell = (content, type) => {
    // Create a table data cell
    let tdata = document.createElement('td')
    let input = document.createElement('input');
    input.value = content;
    input.type = type;
    input.className = 'inputs';
    tdata.appendChild(input)
    return tdata;
};

const makeButton = (name, txt) => {
    // Make Button
    let btn = document.createElement('button')
    let text = document.createTextNode(txt);
    btn.value = name
    btn.appendChild(text)
    return btn;
};

const disableInputs = () => {
    // Gray out
    let x = document.getElementsByClassName('inputs');
    for (let i = 0; i< x.length; i++) {
        x[i].disabled = true;
    }
    
};

const deleteTableExpAlp = () => {
    // delete the table;
    let tbl = document.getElementById('expAlpTable');
    tbl.innerHTML = '';
};

const makeHeaderRowExpAlp = () => {
    // Header Row
    let table = document.getElementById('expAlpTable')
    let headerRow = document.createElement('tr')
    let th_contents = ['', '', 'Experience', '', 'Alpaca', '']
    for (let i = 0; i < th_contents.length; i++) {
        let thead = document.createElement('th');
        thead.textContent = th_contents[i];
        headerRow.appendChild(thead)
    }
    table.appendChild(headerRow);   
};

const makeTableExpAlp = (allRows) => {
    // make table
    let table = document.getElementById('expAlpTable');
    for (let i = 0; i < allRows.length; i++){
        let tr = makeRowExpAlp(allRows[i])
        table.appendChild(tr);
    }
};

const makeRowExpAlp = (rowData) => {
    // create a table row
    let trow = document.createElement('tr')
    let arr = ['ea_id', 'experience_id', 'experience_name', 'alpaca_id', 'alpaca_name'];
    // will have columns for experience_id and alpaca_id for reference but will hide the columns
    let types = ['hidden', 'hidden', 'text', 'hidden', 'text']
    for (let i = 0; i < arr.length; i++) {
        let td = makeCell(rowData[arr[i]], types[i]);
        trow.appendChild(td);
    }
    let btn1 = makeButton('delete', 'delete');
    btn1.className = 'delete';
    btn1.value = rowData['order_id']
    let tdata = document.createElement('td')
    tdata.appendChild(btn1);
    trow.appendChild(tdata);
    return trow;
};

const createExpList = (rowData) => {
    // creates the dropdown menu list of experience_names and alpaca_names in the form

    let expList = document.getElementById('experience_list');

    let expSelect = document.createElement('select');
    expSelect.id = "exp_select";

    for (let i = 0; i < rowData.length; i++){
        // iterate through each object in the row's list of objects
        // create a new experience option and a new alpaca option for each object
        let expOption = document.createElement('option');
        expOption.value = rowData[i]['experience_id'];
        expOption.text = rowData[i]['experience_name'];

        // add both new options into the respective "select"
        expSelect.appendChild(expOption);
    }
    expList.appendChild(expSelect);
}


const createAlpList = (rowData) => {
    // creates the dropdown menu list of experience_names and alpaca_names in the form

    let alpList = document.getElementById('alpaca_list');

    let alpSelect = document.createElement('select');
    alpSelect.id = "alp_select";

    for (let i = 0; i < rowData.length; i++){
        // iterate through each object in the row's list of objects
        // create a new experience option and a new alpaca option for each object
        let alpOption = document.createElement('option');
        alpOption.value = rowData[i]['alpaca_id'];
        alpOption.text = rowData[i]['alpaca_name'];

        // add both new options into the respective "select"
        alpSelect.appendChild(alpOption);
    }
    alpList.appendChild(alpSelect);
}


// when the page is loaded, make an experiences_alpaca table with all the mysql data
window.addEventListener('load', (event) => {
    console.log('page is fully loaded - 1st request');
    let req = new XMLHttpRequest();
    req.open('GET', baseUrl + "/experiences-alpacas", true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', function() {
        if (req.status >= 200 && req.status < 400) {
          let response = JSON.parse(req.responseText);
          console.log(response)
        //   make a table with all the current mySQL data
          makeHeaderRowExpAlp();
          makeTableExpAlp(response);
          disableInputs();
        //   createLists(response);
        } else {
          console.log("Error in network request: " + req.statusText);
        }
      });
      req.send();
      event.preventDefault();
    });

// when the page is loaded, will create a dropdown list of all of the available alpacas for the form
window.addEventListener('load', (event) => {
    console.log('page is fully loaded - 2nd request');
    let req = new XMLHttpRequest();
    req.open('GET', baseUrl + "/alpacas", true);
    // request data from the alpacas table
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', function() {
        if (req.status >= 200 && req.status < 400) {
          let response = JSON.parse(req.responseText);
          createAlpList(response);
        } else {
          console.log("Error in network request: " + req.statusText);
        }
      });
      req.send();
      event.preventDefault();
    });

// when the page is loaded, will create a dropdown list of all of the available experiences for the form
window.addEventListener('load', (event) => {
    console.log('page is fully loaded - 3rd request');
    let req = new XMLHttpRequest();
    req.open('GET', baseUrl + "/experiences", true);
    // request data from the experiences table
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', function() {
        if (req.status >= 200 && req.status < 400) {
          let response = JSON.parse(req.responseText);
          createExpList(response);
        } else {
          console.log("Error in network request: " + req.statusText);
        }
      });
      req.send();
      event.preventDefault();
    });


// enables the input row during UPDATE 
const enableRow = (rowEl) => {
    // enable the row for editing but not for ea_id/experience_id/alpaca_id
    // enable 'experience_name' cell
    var enabledCell_1 = rowEl.firstElementChild.nextElementSibling.nextElementSibling;
    var enabledInput_1 = enabledCell_1.firstElementChild;
    enabledInput_1.disabled = false;

    // enable 'alpaca_name' cell
    var enabledCell_2 = enabledCell_1.nextElementSibling;
    var enabledInput_2 = enabledCell_2.firstElementChild;
    enabledInput_2.disabled = false;
};

// upon submitting the add experience form, a new row will be added to the table
document.getElementById('submitExpAlp').addEventListener('click', function(event){
    let req = new XMLHttpRequest();
    let data = {};

    data.experience_id = document.getElementById('exp_select').value;
    data.alpaca_id = document.getElementById('alp_select').value;   
    // Alert user if any of the data is missing
    // if (data.alpaca_name=='' || data.age=='' || data.breed) {
    //     alert('Please input all of the fields');
    //     return;
    // }

    req.open('POST', baseUrl + "/experiences-alpacas", true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.onload = function () {
        if (req.status >= 200 & req.status < 400) {
            console.log('form data submitted successfully');
            // create the new row
            let response = JSON.parse(req.responseText);
            let tr = makeRowExpAlp(response[response.length-1])
            let tbl = document.getElementById('expAlpTable')
            tbl.appendChild(tr);
            disableInputs();
        } else {
            console.error();
        }
    }
    req.send(JSON.stringify(data));
    event.preventDefault();
})

// Delete and Update Event Delegation
document.querySelector('#expAlpTable').onclick = async (event) => {
  let target = event.target;

  // DELETE
  if (target.className == 'delete') {
      let req = new XMLHttpRequest();
      let data = {};
      data.ea_id = target.parentNode.parentNode.firstElementChild.firstElementChild.value;
      req.open('DELETE', baseUrl + "/experiences-alpacas", true);
      req.setRequestHeader('Content-Type', 'application/json');
      req.addEventListener('load',function(){
        if(req.status >= 200 && req.status < 400){
          let response = JSON.parse(req.responseText);
          console.log("deleted correctly");

          // delete the old table
          deleteTableExpAlp();
          // make a new table
          makeHeaderRowExpAlp();
          makeTableExpAlp(response);
          disableInputs();
        } else {
          console.log("Error in network request: " + req.statusText);
        }});
      req.send(JSON.stringify(data));
      event.preventDefault();
}};