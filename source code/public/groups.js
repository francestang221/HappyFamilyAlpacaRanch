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

// -------------------------- Groups ---------------------------------------

const deleteTableGrp = () => {
    // delete the table;
    let tbl = document.getElementById('groupsTable');
    tbl.innerHTML = '';
};

const makeHeaderRowGrp = () => {
    // Header Row
    let table = document.getElementById('groupsTable')
    let headerRow = document.createElement('tr')
    let th_contents = ['', 'Group Name', 'Group Discount', '']
    for (let i = 0; i < th_contents.length; i++) {
        let thead = document.createElement('th');
        thead.textContent = th_contents[i];
        headerRow.appendChild(thead)
    }
    table.appendChild(headerRow);   
};

const makeTableGrp = (allRows) => {
    // make table
    let table = document.getElementById('groupsTable');
    for (let i = 0; i < allRows.length; i++){
        let tr = makeRowGrp(allRows[i])
        table.appendChild(tr);
    }
};

const makeRowGrp = (rowData) => {
    // create a table row
    let trow = document.createElement('tr')
    let arr = ['group_id','group_name', 'group_discount'];
    let types = ['hidden', 'text','number'];
    for (let i = 0; i < arr.length; i++) {
        let td = makeCell(rowData[arr[i]], types[i]);
        trow.appendChild(td);
    }
    // add group_id into both update and delete buttons as a value
    // will later use that value for UPDATE
    let btn1 = makeButton('update', 'update');
    btn1.className = 'update';
    btn1.value = rowData['group_id'];
    let btn2 = makeButton('delete', 'delete');
    btn2.className = 'delete';
    btn2.value = rowData['group_id'];
    let tdata = document.createElement('td')
    tdata.appendChild(btn1);
    tdata.appendChild(btn2);
    trow.appendChild(tdata);
    return trow;
};


// when the page is loaded, make a table with all the mysql data
window.addEventListener('load', (event) => {
    console.log('page is fully loaded');
    let req = new XMLHttpRequest();
    req.open('GET', baseUrl + "/groups", true);
    req.setRequestHeader('Content-Type', 'application/json');

    req.addEventListener('load', function() {
        if (req.status >= 200 && req.status < 400) {
          let response = JSON.parse(req.responseText);
          // make a table with all the current mySQL data
          makeHeaderRowGrp();
          makeTableGrp(response);
          disableInputs();
        } else {
          console.log("Error in network request: " + req.statusText);
        }
      });
      req.send();
      event.preventDefault();
    });

// upon submitting the add group form , a new row will be added to the table
document.getElementById('submitGrp').addEventListener('click', function(event){
    let req = new XMLHttpRequest();
    let data = {};

    data.group_name = document.getElementById('group_name').value;
    data.group_discount = document.getElementById('discount').value;
    
    // Alert user if any of the required data is missing
    if (data.group_name=='') {
        alert('Group name cannot be empty!');
        return;
    }

    if (data.group_discount=='') {
        alert('Group discount cannot be empty!');
        return;
    }
    
    req.open('POST', baseUrl + "/groups", true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.onload = function () {
        if (req.status >= 200 & req.status < 400) {
            console.log('form data submitted successfully');

            // create the new row
            let response = JSON.parse(req.responseText);
            let tr = makeRowGrp(response[response.length-1])
            let tbl = document.getElementById('groupsTable')
            tbl.appendChild(tr);
            disableInputs();
        } else {
            console.error(users);
        }
    }
    req.send(JSON.stringify(data));
    event.preventDefault();
})

const enableRow = (rowEl) => {
    // enable the row for editing
    // enable 'group_name' cell
    var enabledCell_1 = rowEl.firstElementChild.nextElementSibling
    var enabledInput_1 = enabledCell_1.firstElementChild;
    enabledInput_1.disabled = false;

    // enable 'group_discount' cell
    var enabledCell_2 = enabledCell_1.nextElementSibling
    var enabledInput_2 = enabledCell_2.firstElementChild;
    enabledInput_2.disabled = false;
};

// Delete and Update Event Delegation
document.querySelector('#groupsTable').onclick = async (event) => {
    let target = event.target;

    // DELETE
    if (target.className == 'delete') {
        let req = new XMLHttpRequest();
        let data = {};
        data.group_id = target.parentNode.parentNode.firstElementChild.firstElementChild.value;
        console.log(data.group_id)
        req.open('DELETE', baseUrl + "/groups", true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener('load',function(){
          if(req.status >= 200 && req.status < 400){
            let response = JSON.parse(req.responseText);

            // delete the old table
            deleteTableGrp();
            // make a new table
            makeHeaderRowGrp();
            makeTableGrp(response);
            disableInputs();
          } else {
            console.log("Error in network request: " + req.statusText);
          }});
        req.send(JSON.stringify(data));
        event.preventDefault();
    }

    // UPDATE
    if (target.className == 'update') {
        // enable the rows
        var enabledRow= target.parentNode.parentNode;
        console.log(enabledRow);
        enableRow(enabledRow);

        // row id
        var row_id = enabledRow.firstElementChild.firstElementChild.value;

        // name change
        var editedCell_1 = enabledRow.firstElementChild.nextElementSibling;
        var editedInput_1 = editedCell_1.firstElementChild;

        // reps change
        var editedCell_2 = editedCell_1.nextElementSibling;
        var editedInput_2 = editedCell_2.firstElementChild;

        // click save and send edit form data 
        target.addEventListener('click', function(event) {
            // Open a PUT request and send data

            let req = new XMLHttpRequest();
            let data = {};
            data.group_name = editedInput_1.value;
            data.group_discount = editedInput_2.value;
            data.group_id = row_id;

            req.open('PUT', baseUrl + "/groups", true);
            req.setRequestHeader('Content-Type', 'application/json');
            req.addEventListener('load',function(){
                if(req.status >= 200 && req.status < 400){
                console.log('edit sent successfully')
                let response = JSON.parse(req.responseText);
                // delete the old table
                 deleteTableGrp();
                // make a new table
                makeHeaderRowGrp();
                makeTableGrp(response);
                disableInputs();
                } else {
            console.log("Error in network request: " + req.statusText);
        }});
        req.send(JSON.stringify(data));
        event.preventDefault(); 
    })
}};