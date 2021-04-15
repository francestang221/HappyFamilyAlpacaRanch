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

const deleteTableAlp = () => {
    // delete the table;
    let tbl = document.getElementById('alpacasTable');
    tbl.innerHTML = '';
};

const makeHeaderRowAlp = () => {
    // Header Row
    let table = document.getElementById('alpacasTable')
    let headerRow = document.createElement('tr')
    let th_contents = ['', 'Alpaca Name', 'Age', 'Breed', '']
    for (let i = 0; i < th_contents.length; i++) {
        let thead = document.createElement('th');
        thead.scope = "col";
        thead.textContent = th_contents[i];
        headerRow.appendChild(thead)
    }
    table.appendChild(headerRow);   
};

const makeTableAlp = (allRows) => {
    // make table
    let table = document.getElementById('alpacasTable');
    for (let i = 0; i < allRows.length; i++){
        let tr = makeRowAlp(allRows[i])
        table.appendChild(tr);
    }
};

const makeRowAlp = (rowData) => {
    // create a table row
    let trow = document.createElement('tr')
    let arr = ['alpaca_id','alpaca_name', 'age', 'breed'];
    let types = ['hidden', 'text','number', 'text'];
    for (let i = 0; i < arr.length; i++) {
        let td = makeCell(rowData[arr[i]], types[i]);
        trow.appendChild(td);
    }
    let btn1 = makeButton('update', 'update');
    btn1.className = 'update';
    btn1.value = rowData['alpaca_id']
    let btn2 = makeButton('delete', 'delete');
    btn2.className = 'delete';
    btn2.value = rowData['alpaca_id']
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
    req.open('GET', baseUrl + "/alpacas", true);
    req.setRequestHeader('Content-Type', 'application/json');

    req.addEventListener('load', function() {
        if (req.status >= 200 && req.status < 400) {
          let response = JSON.parse(req.responseText);
          // make a table with all the current mySQL data
          makeHeaderRowAlp();
          makeTableAlp(response);
          disableInputs();
        } else {
          console.log("Error in network request: " + req.statusText);
        }
      });
      req.send();
      event.preventDefault();
    });

// upon submitting the add alpaca form , a new row will be added to the table

document.getElementById('submitAlp').addEventListener('click', function(event){
    let req = new XMLHttpRequest();
    let data = {};

    data.alpaca_name = document.getElementById('alp_name').value;
    data.age = document.getElementById('alp_age').value;
    data.breed = document.getElementById('breed').value;
    
    // Alert user if any of the data is missing
    if (data.alpaca_name=='') {
        alert('Aplaca name cannot be empty!');
        return;
    }

    if (data.age=='') {
        alert('Age cannot be empty!');
        return;
    }

    if (data.breed=='') {
        alert('Breed cannot be empty!');
        return;
    }

    req.open('POST', baseUrl + "/alpacas", true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.onload = function () {
        if (req.status >= 200 & req.status < 400) {
            console.log('form data submitted successfully');

            // create the new row
            let response = JSON.parse(req.responseText);
            let tr = makeRowAlp(response[response.length-1])
            let tbl = document.getElementById('alpacasTable')
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
    // enable 'alpaca_name' cell
    var enabledCell_1 = rowEl.firstElementChild.nextElementSibling
    var enabledInput_1 = enabledCell_1.firstElementChild;
    enabledInput_1.disabled = false;

    // enable 'age' cell
    var enabledCell_2 = enabledCell_1.nextElementSibling
    var enabledInput_2 = enabledCell_2.firstElementChild;
    enabledInput_2.disabled = false;

    // enable 'breed' cell
    var enabledCell_3 = enabledCell_2.nextElementSibling
    var enabledInput_3 = enabledCell_3.firstElementChild;
    enabledInput_3.disabled = false;
};


// Delete and Update Event Delegation
document.querySelector('#alpacasTable').onclick = async (event) => {
    let target = event.target;

    // DELETE
    if (target.className == 'delete') {
        let req = new XMLHttpRequest();
        let data = {};
        data.alpaca_id = target.parentNode.parentNode.firstElementChild.firstElementChild.value;
        req.open('DELETE', baseUrl + "/alpacas", true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener('load',function(){
          if(req.status >= 200 && req.status < 400){
            let response = JSON.parse(req.responseText);

            // delete the old table
            deleteTableAlp();
            // make a new table
            makeHeaderRowAlp();
            makeTableAlp(response);
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

        // alpaca_name change
        var editedCell_1 = enabledRow.firstElementChild.nextElementSibling;
        var editedInput_1 = editedCell_1.firstElementChild;

        // age change
        var editedCell_2 = editedCell_1.nextElementSibling;
        var editedInput_2 = editedCell_2.firstElementChild;

        // breed change
        var editedCell_3 = editedCell_2.nextElementSibling;
        var editedInput_3 = editedCell_3.firstElementChild;

        // click save and send edit form data 
        target.addEventListener('click', function(event) {
            // Open a PUT request and send data

            let req = new XMLHttpRequest();
            let data = {};
            data.alpaca_name = editedInput_1.value;
            data.age = editedInput_2.value;
            data.breed = editedInput_3.value;
            data.alpaca_id = row_id;

            req.open('PUT', baseUrl + "/alpacas", true);
            req.setRequestHeader('Content-Type', 'application/json');
            req.addEventListener('load',function(){
                if(req.status >= 200 && req.status < 400){
                console.log('edit sent successfully')
                let response = JSON.parse(req.responseText);
                // delete the old table
                deleteTableAlp();
                // make a new table
                makeHeaderRowAlp();
                makeTableAlp(response);
                disableInputs();
                } else {
            console.log("Error in network request: " + req.statusText);
        }});
        req.send(JSON.stringify(data));
        event.preventDefault(); 
    })

}};
     