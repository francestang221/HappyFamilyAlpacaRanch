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

const deleteTableOrd = (tableID) => {
    // delete the table

    let tbl = document.getElementById(`${tableID}`);
    tbl.innerHTML = '';

    if (tableID == "searchTable"){
        // remove the header (in the div) above the searchTable
        // for when user is doing INSERT/DELETE on the all orders table, after having finished a search
        let div_text = document.getElementById("search_text");
        if (div_text.firstChild != null){
            // will only run if div has the header (child)
            div_text.removeChild(div_text.firstChild);
        }
    }
};


const makeHeaderRowOrd = (tableID) => {
    // Header Row
    let table = document.getElementById(`${tableID}`)
    let headerRow = document.createElement('tr')
    let th_contents = ['', 'Customer Name', 'Experience-Alpaca', 'Ticket Quantity', 'Order Date', 'Subtotal', '']
    for (let i = 0; i < th_contents.length; i++) {
        let thead = document.createElement('th');
        thead.textContent = th_contents[i];
        headerRow.appendChild(thead)
    }
    table.appendChild(headerRow);   
};

const makeTableOrd = (allRows, tableID) => {
    // make table
    let table = document.getElementById(`${tableID}`);
    for (let i = 0; i < allRows.length; i++){
        let tr = makeRowOrd(allRows[i], tableID)
        table.appendChild(tr);
    }
};

const makeRowOrd = (rowData, tableID) => {
    // create a table row
    let trow = document.createElement('tr')
    let arr = ['order_id', 'customer_name', 'ea_name', 'ticket_quantity', 'order_date', 'order_subtotal'];
    let types = ['hidden', 'text','text', 'number', 'date', 'number'];
    for (let i = 0; i < arr.length; i++) {
        if (i == 4){
            unparsedDate = rowData[arr[i]];
            dateData = unparsedDate.substring(0, 10);
            let td = makeCell(dateData, types[i]);
            trow.appendChild(td); 
        }
        else{
            let td = makeCell(rowData[arr[i]], types[i]);
            trow.appendChild(td);
        }
    }

    if (tableID == "ordersTable"){
        let btn1 = makeButton('delete', 'delete');
        btn1.className = 'delete';
        btn1.value = rowData['order_id']
        let tdata = document.createElement('td')
        tdata.appendChild(btn1);
        trow.appendChild(tdata);
    }
    return trow;
};

const createCusList = (queryData) => {
    // creates the dropdown menu list of customer_name in the INSERT form

    let cusList = document.getElementById('customer_list');
    let cusSelect = document.createElement('select');
    cusSelect.id = "cus_select";

    for (let i = 0; i < queryData.length; i++){
        // iterate through the objects in the list, creating a new option for each object
        let cusOption = document.createElement('option');
        cusOption.value = queryData[i]['customer_id'];
        cusOption.text = queryData[i]['customer_name'];

        // add the new option into a select
        cusSelect.appendChild(cusOption);
    }
    // add the selection (with options) into the INSERT form
    cusList.appendChild(cusSelect);
}

const createEAList = (queryData) => {
    // creates the dropdown menu list of ea_name in the INSERT form

    let eaList = document.getElementById('ea_list');
    let eaSelect = document.createElement('select');
    eaSelect.id = "ea_select";

    for (let i = 0; i < queryData.length; i++){
        // iterate through the objects in the list, creating a new option for each object
        let eaOption = document.createElement('option');
        eaOption.value = queryData[i]['ea_id'];
        eaOption.text = queryData[i]['ea_name'];

        // add the new option into a select
        eaSelect.appendChild(eaOption);
    }
    // add the selection (with options) into the INSERT form
    eaList.appendChild(eaSelect);
}

// when the page is loaded, make a table with all the mysql data
window.addEventListener('load', (event) => {
    console.log('page is fully loaded');
    console.log('PIKACHU!')
    let req = new XMLHttpRequest();
    req.open('GET', baseUrl + "/orders", true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', function() {
        if (req.status >= 200 && req.status < 400) {
          let response = JSON.parse(req.responseText);
        //   make a table with all the current mySQL data
          makeHeaderRowOrd("ordersTable");
          makeTableOrd(response.ord, "ordersTable");
          disableInputs();

        // create the dropdown menu for customers and experiences_alpacas
            createCusList(response.cus);
            createEAList(response.ea);
        } else {
          console.log("Error in network request: " + req.statusText);
        }
      });
      req.send();
      event.preventDefault();
    });

// Delete Event Delegation
document.querySelector('#ordersTable').onclick = async (event) => {
  let target = event.target;

  // DELETE
  if (target.className == 'delete') {
      let req = new XMLHttpRequest();
      let data = {};
      data.order_id = target.parentNode.parentNode.firstElementChild.firstElementChild.value;
      req.open('DELETE', baseUrl + "/orders", true);
      req.setRequestHeader('Content-Type', 'application/json');
      req.addEventListener('load',function(){
        if(req.status >= 200 && req.status < 400){
          let response = JSON.parse(req.responseText);
          console.log("deleted correctly");
          // deletes the search results table (if user is adding a row in the total orders after completing a search)
          deleteTableOrd("searchTable");
          // delete the old table
          deleteTableOrd("ordersTable");
          // make a new table
          makeHeaderRowOrd("ordersTable");
          makeTableOrd(response, "ordersTable");
          disableInputs();
        } else {
          console.log("Error in network request: " + req.statusText);
        }});
      req.send(JSON.stringify(data));
      event.preventDefault();
}};

// upon submitting the add order form, a new row will be added to the table
document.getElementById('submitOrd').addEventListener('click', function(event){
    let req = new XMLHttpRequest();
    let data = {};

    data.customer_id = document.getElementById('cus_select').value;
    data.ea_id = document.getElementById('ea_select').value;
    data.ticket_quantity = document.getElementById('ticket_qty').value;
    data.order_date = document.getElementById('order_date').value;

    // deletes the search results table (if user is adding a row in the total orders after completing a search)
    deleteTableOrd("searchTable");

    // Alert user if any of the required data is missing
    if (data.ticket_quantity=='') {
        alert('Ticket quantity cannot be empty!');
        return;
    }

    if (data.order_date=='') {
        alert('Order date cannot be empty!');
        return;
    }

    req.open('POST', baseUrl + "/orders", true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.onload = function () {
        if (req.status >= 200 & req.status < 400) {
            console.log('form data submitted successfully');

            // create the new row
            let response = JSON.parse(req.responseText);
            let tr = makeRowOrd(response[response.length-1], "ordersTable")
            let tbl = document.getElementById('ordersTable')
            tbl.appendChild(tr);
            disableInputs();
        } else {
            console.error();
        }
    }
    req.send(JSON.stringify(data));
    event.preventDefault();

})

const emptySearchResult = () => {
    // triggers when user attempts a search but no results were found
    console.log("started EmptySearchResult")
    let search_text = document.getElementById('search_text');
    let message = document.createElement('h2');
    message.innerHTML = "No search results found";
    search_text.appendChild(message)
}

const validSearchResult = (rowData) => {
    // triggers when user does a search with valid results
    // create the text
    console.log("started validSearchResult");
    let search_text = document.getElementById('search_text');
    let message = document.createElement('h2');
    message.innerHTML = "All Search Results";
    search_text.appendChild(message)

    // create the table with the search results
    makeHeaderRowOrd("searchTable");
    makeTableOrd(rowData, "searchTable");
    disableInputs();
}

// search form - searching
// triggers when the user clicks on the "search" button and inputs characters into the search bar
document.getElementById('submitSearch').addEventListener('click', function(event){
    search_input = document.getElementById('cus_name').value;

    // create an alert if user doesn't input anything in the search box
    if (search_input.length == 0){
        window.alert("Please input text");
        return
    }

    // start POST request
    console.log("search started")
    let req = new XMLHttpRequest();
    let data = {};
    data.search = search_input;

    req.open("POST", baseUrl + '/orders-search', true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.onload = function (){
        if (req.status >= 200 & req.status < 400){
            let response = JSON.parse(req.responseText);

            // if user is doing continuous searches, will delete the current search results table
            deleteTableOrd("searchTable");

            // if there are no results from the search, will display message
            if (response.length < 1) {
                emptySearchResult();
                return
            }

            else {
                validSearchResult(response);
            }
        }
        else{
            console.log("Error in network request: " + req.statusText);
        };
    }
    req.send(JSON.stringify(data));
    event.preventDefault();
});

// search form - clearing results
// triggers when user clicks on "clear search" button
document.getElementById("clearSearch").addEventListener('click', function(event){
    // delete the searchTable
    deleteTableOrd("searchTable");
    event.preventDefault();
})