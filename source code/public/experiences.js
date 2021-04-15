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


const deleteTableExp = () => {
    // delete the table;
    let tbl = document.getElementById('expTable');
    tbl.innerHTML = '';
};

const makeHeaderRowExp = () => {
    // Header Row
    let table = document.getElementById('expTable')
    let headerRow = document.createElement('tr')
    let th_contents = ['', 'Experience Name', 'Experience Price', '']
    for (let i = 0; i < th_contents.length; i++) {
        let thead = document.createElement('th');
        thead.textContent = th_contents[i];
        headerRow.appendChild(thead)
    }
    table.appendChild(headerRow);   
};

const makeTableExp = (allRows) => {
    // make table
    let table = document.getElementById('expTable');
    for (let i = 0; i < allRows.length; i++){
        let tr = makeRowExp(allRows[i])
        table.appendChild(tr);
    }
};

const makeRowExp = (rowData) => {
    // create a table row
    let trow = document.createElement('tr')
    let arr = ['experience_id','experience_name', 'experience_price'];
    let types = ['hidden', 'text','number'];
    for (let i = 0; i < arr.length; i++) {
        let td = makeCell(rowData[arr[i]], types[i]);
        trow.appendChild(td);
    }
    let btn1 = makeButton('update', 'update');
    btn1.className = 'update';
    btn1.value = rowData['experience_id']
    let btn2 = makeButton('delete', 'delete');
    btn2.className = 'delete';
    btn2.value = rowData['experience_id']
    let tdata = document.createElement('td')
    tdata.appendChild(btn1);
    tdata.appendChild(btn2);
    trow.appendChild(tdata);
    return trow;
};


// when the page is loaded, make an Experiences table with all the mysql data
window.addEventListener('load', (event) => {
    console.log('page is fully loaded');
    let req = new XMLHttpRequest();
    req.open('GET', baseUrl + "/experiences", true);
    req.setRequestHeader('Content-Type', 'application/json');

    req.addEventListener('load', function() {
        if (req.status >= 200 && req.status < 400) {
          let response = JSON.parse(req.responseText);
        //   make a table with all the current mySQL data
          makeHeaderRowExp();
          makeTableExp(response);
          disableInputs();
        } else {
          console.log("Error in network request: " + req.statusText);
        }
      });
      req.send();
      event.preventDefault();
    });

// upon submitting the add experience form, a new row will be added to the table

document.getElementById('submitExp').addEventListener('click', function(event){
    let req = new XMLHttpRequest();
    let data = {};

    data.experience_name = document.getElementById('exp_name').value;
    data.experience_price = document.getElementById('exp_price').value;
    
    // Alert user if any of the required data is missing
    if (data.experience_name=='') {
        alert('Experience name cannot be empty!');
        return;
    }

    if (data.experience_price=='') {
        alert('Experience price cannot be empty!');
        return;
    }
    
    req.open('POST', baseUrl + "/experiences", true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.onload = function () {
        if (req.status >= 200 & req.status < 400) {
            console.log('form data submitted successfully');
            // create the new row
            let response = JSON.parse(req.responseText);
            let tr = makeRowExp(response[response.length-1])
            let tbl = document.getElementById('expTable')
            tbl.appendChild(tr);
            disableInputs();
        } else {
            console.error(users);
        }
    }
    req.send(JSON.stringify(data));
    event.preventDefault();

});

const enableRow = (rowEl) => {
    // enable the row for editing
    // enable 'experience_name' cell
    var enabledCell_1 = rowEl.firstElementChild.nextElementSibling
    var enabledInput_1 = enabledCell_1.firstElementChild;
    enabledInput_1.disabled = false;

    // enable 'experience_price' cell
    var enabledCell_2 = enabledCell_1.nextElementSibling
    var enabledInput_2 = enabledCell_2.firstElementChild;
    enabledInput_2.disabled = false;
};

// Delete and Update Event Delegation
document.querySelector('#expTable').onclick = async (event) => {
    let target = event.target;

    // DELETE
    if (target.className == 'delete') {
        let req = new XMLHttpRequest();
        let data = {};
        data.experience_id = target.parentNode.parentNode.firstElementChild.firstElementChild.value;
        console.log(data.experience_id)
        req.open('DELETE', baseUrl + "/experiences", true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener('load',function(){
          if(req.status >= 200 && req.status < 400){
            let response = JSON.parse(req.responseText);

            // delete the old table
            deleteTableExp();
            // make a new table
            makeHeaderRowExp();
            makeTableExp(response);
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

        // experience_id
        var row_id = enabledRow.firstElementChild.firstElementChild.value;

        // experience_name
        var editedCell_1 = enabledRow.firstElementChild.nextElementSibling;
        var editedInput_1 = editedCell_1.firstElementChild;

        // experience_price
        var editedCell_2 = editedCell_1.nextElementSibling;
        var editedInput_2 = editedCell_2.firstElementChild;

        // click save and send edit form data 
        target.addEventListener('click', function(event) {
            // Open a PUT request and send data

            let req = new XMLHttpRequest();
            let data = {};
            data.experience_name = editedInput_1.value;
            data.experience_price = editedInput_2.value;
            data.experience_id = row_id;

            console.log("data:", data)

            req.open('PUT', baseUrl + "/experiences", true);
            req.setRequestHeader('Content-Type', 'application/json');
            req.addEventListener('load',function(){
                if(req.status >= 200 && req.status < 400){
                console.log('edit sent successfully')
                let response = JSON.parse(req.responseText);
                // delete the old table
                 deleteTableExp();
                // make a new table
                makeHeaderRowExp();
                makeTableExp(response);
                disableInputs();
                } else {
            console.log("Error in network request: " + req.statusText);
        }});
        req.send(JSON.stringify(data));
        event.preventDefault(); 
    })
}};