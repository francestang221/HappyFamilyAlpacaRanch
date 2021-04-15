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

const deleteTableCus = () => {
    // delete the table;
    let tbl = document.getElementById('customersTable');
    tbl.innerHTML = '';
};

const makeHeaderRowCus = () => {
    // Header Row
    let table = document.getElementById('customersTable')
    let headerRow = document.createElement('tr')
    let th_contents = ['', 'First Name', 'Last Name', 'Email', 'Group ID', '']
    for (let i = 0; i < th_contents.length; i++) {
        let thead = document.createElement('th');
        thead.textContent = th_contents[i];
        headerRow.appendChild(thead)
    }
    table.appendChild(headerRow);   
};

const makeTableCus = (allRows) => {
    // make table
    let table = document.getElementById('customersTable');
    for (let i = 0; i < allRows.length; i++){
        let tr = makeRowCus(allRows[i])
        table.appendChild(tr);
    }
};

const makeRowCus = (rowData) => {
    // create a table row
    let trow = document.createElement('tr')
    let arr = ['customer_id','first_name', 'last_name', 'email', 'group_id'];
    let types = ['hidden', 'text','text', 'text', 'number'];
    for (let i = 0; i < arr.length; i++) {
        let td = makeCell(rowData[arr[i]], types[i]);
        trow.appendChild(td);
    }
    let btn1 = makeButton('test', 'test');
    btn1.className = 'test';
    btn1.value = rowData['customer_id']
    let btn2 = makeButton('delete', 'delete');
    btn2.className = 'delete';
    btn2.value = rowData['customer_id']
    let tdata = document.createElement('td')
    // tdata.appendChild(btn1);
    tdata.appendChild(btn2);
    trow.appendChild(tdata);
    return trow;
};


// group id drop down menu
const createGrpList = (rowData) => {
    // creates the dropdown menu list of group names in the form

    let grpList = document.getElementById('group_list');

    // add a NULL option to the dropdown menu
    let grpSelect = document.getElementById('grp_select');

    for (let i = 0; i < rowData.length; i++){
        // iterate through each object in the row's list of objects
        // create a new group option and a new alpaca option for each object
        let grpOption = document.createElement('option');
        grpOption.value = rowData[i]['group_id'];
        grpOption.text = rowData[i]['group_name'];

        // add both new options into the respective "select"
        grpSelect.appendChild(grpOption);
    }
    grpList.appendChild(grpSelect);
}

// when the page is loaded, will create a dropdown list of all of the available groups for the form
window.addEventListener('load', (event) => {
    console.log('page is fully loaded - 2nd request');
    let req = new XMLHttpRequest();
    req.open('GET', baseUrl + "/groups", true);
    // request data from the groups table
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', function() {
        if (req.status >= 200 && req.status < 400) {
          let response = JSON.parse(req.responseText);
          createGrpList(response);
        } else {
          console.log("Error in network request: " + req.statusText);
        }
      });
      req.send();
      event.preventDefault();
    });


// when the page is loaded, make a table with all the mysql data
window.addEventListener('load', (event) => {
    console.log('page is fully loaded');
    let req = new XMLHttpRequest();
    req.open('GET', baseUrl + "/customers", true);
    req.setRequestHeader('Content-Type', 'application/json');

    req.addEventListener('load', function() {
        if (req.status >= 200 && req.status < 400) {
          let response = JSON.parse(req.responseText);
          // make a table with all the current mySQL data
          makeHeaderRowCus();
          makeTableCus(response);
          disableInputs();
        } else {
          console.log("Error in network request: " + req.statusText);
        }
      });
      req.send();
      event.preventDefault();
    });

// upon submitting the add customers form , a new row will be added to the table

document.getElementById('submitCus').addEventListener('click', function(event){
    let req = new XMLHttpRequest();
    let data = {};

    data.first_name = document.getElementById('fname').value;
    data.last_name = document.getElementById('lname').value;
    data.email = document.getElementById('email').value;
    data.group_id = document.getElementById('grp_select').value;
    if (data.group_id == 'null') {
        data.group_id = null;
    }

    // Alert user if any of the required data is missing
    if (data.first_name=='') {
        alert('First name cannot be empty!');
        return;
    }

    if (data.last_name=='') {
        alert('Last name cannot be empty!');
        return;
    }

    if (data.email=='') {
        alert('Email cannot be empty!');
        return;
    }
    
    req.open('POST', baseUrl + "/customers", true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.onload = function () {
        if (req.status >= 200 & req.status < 400) {
            console.log('form data submitted successfully');

            // create the new row
            let response = JSON.parse(req.responseText);
            let tr = makeRowCus(response[response.length-1])
            let tbl = document.getElementById('customersTable')
            tbl.appendChild(tr);
            disableInputs();
        } else {
            console.error();
        }
    }
    req.send(JSON.stringify(data));
    event.preventDefault();

})

const enableRow = (rowEl) => {
    // enable the row for editing
    // enable 'first_name' cell
    var enabledCell_1 = rowEl.firstElementChild.nextElementSibling
    var enabledInput_1 = enabledCell_1.firstElementChild;
    enabledInput_1.disabled = false;

    // enable 'last_name' cell
    var enabledCell_2 = enabledCell_1.nextElementSibling
    var enabledInput_2 = enabledCell_2.firstElementChild;
    enabledInput_2.disabled = false;

    // enable 'email' cell
    var enabledCell_3 = enabledCell_2.nextElementSibling
    var enabledInput_3 = enabledCell_3.firstElementChild;
    enabledInput_3.disabled = false;
};


// Delete and Update Event Delegation
document.querySelector('#customersTable').onclick = async (event) => {
    let target = event.target;

    // DELETE
    if (target.className == 'delete') {
        let req = new XMLHttpRequest();
        let data = {};
        data.customer_id = target.parentNode.parentNode.firstElementChild.firstElementChild.value;
        console.log(data.customer_id)
        req.open('DELETE', baseUrl + "/customers", true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener('load',function(){
          if(req.status >= 200 && req.status < 400){
            let response = JSON.parse(req.responseText);

            // delete the old table
            deleteTableCus();
            // make a new table
            makeHeaderRowCus();
            makeTableCus(response);
            disableInputs();
          } else {
            console.log("Error in network request: " + req.statusText);
          }});
        req.send(JSON.stringify(data));
        event.preventDefault();
    }
};
