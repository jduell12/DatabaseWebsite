let tableInfo = {
    'columnOrder':[
        {'id': 'customer_Num', 'readonly': true},
        {'id': 'customer_Name', 'type': 'text'},
        {'id': 'dob', 'type':'date'},
        {'id': 'phone_Num', 'type': 'text'},
        {'id': 'address', 'type': 'text'},
        {'id': 'email', 'type': 'text'},
        {'id': 'payment', 'type': 'text'},
    ],
    'columnHeader': ['Customer Name', 'Date of Birth', 'Phone Number', 'Address', 'Email', 'Payment'],
    'data': [],
    'route': '/inventory/api',
    'callback': {'edit': function(){}}
};

function getAllItems(){
    let getRequest = httpRequest('GET', '/customer/api', {});
    getRequest.then(function(result) {
        updateTable(result);
    }).catch(function(err){
        console.log(err);
    })
};

function updateTable(result){
    let data = JSON.parse(result.responseText).payload;
    tableInfo['data'] = data;
    generateTable(tableInfo);
}

function generateTable(tableData){
    let table = document.getElementById('table-body');
    let header = document.createElement('thead');
    let body = document.createElement('tbody');
    table.innerHTML = "";

    let headerArray = tableData['columnHeader']
    let colomnOrderArray = tableData['columnOrder'];
    let dataArray = tableData['data'];

    headerArray.forEach((item, index) => {
        let column = document.createElement('th');
        column.textContent = tableData['columnHeader'][index];
        header.appendChild(column);
    })

    for(let i = 0; i < dataArray.length; i++){
        let row = document.createElement('tr');
        row.className = 'tr';
        let id = tableData['data'][i][tableData['columnOrder'][0]['id']];
        row.setAttribute('id', id);
        let rowNum = 0;

        for(let j = 0; j < colomnOrderArray.length; j++){
            let key = tableData['columnOrder'][j]['id'];
            let cell = document.createElement('td');
            cell.className = 'td';
            cell.id = key + '-' + id;
            cell.textContent = key == 'actions' ? '': tableData['data'][i][key];

            if(j === 0){
                cell.style.display = "none";
                cell.classList.remove('td');
            } else if(j === 1){
                let name = tableData['data'][i]['first_Name'] + " " + tableData['data'][i]['last_Name'];
                cell.textContent = name;
            }else if (j === 2){
                let dateArray = tableData['data'][i]['dob'].split('-');
                let day = dateArray[2].split('T');

                cell.textContent = dateArray[1] + '-' + day[0] + '-' + dateArray[0];
            } else if(j === 3){
                cell.textContent = tableData['data'][i]['phone_Num'];
            } else if(j === 4){
                cell.textContent = tableData['data'][i]['street'] + " " + tableData['data'][i]['city'] + '\n' + tableData['data'][i]['shipState'] + ", " + tableData['data'][i]['zip'] + " " + tableData['data'][i]['country'];
            } else if (j === 5){
                cell.textContent = tableData['data'][i]['email'];
            }else if (j === colomnOrderArray.length-1){
                cell.textContent = tableData['data'][i]['preferred_Payment_Type'];
            }

            row.appendChild(cell);
        }

        //creates delete button
        let deleteButton = document.createElement('button');
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute('id', 'delete-' + id);
        deleteButton.addEventListener('click', deleteItem.bind(this, id));
        row.appendChild(deleteButton);

        //creates edit button
        let editButton = document.createElement('button');
        editButton.textContent = "Edit";
        editButton.setAttribute('id', 'edit-' + id);
        editButton.addEventListener('click', editItem.bind(this, id, tableInfo['columnOrder'][rowNum]['edit'], tableInfo['columnOrder']), false);
        row.appendChild(editButton);

        //creates hidden update button
        let update = document.createElement('button');
        update.textContent = "Update";
        update.setAttribute('id', 'update-' + id);
        update.addEventListener('click', updateItem.bind(this, id));
        update.style.display = "none";
        row.appendChild(update);

        body.appendChild(row);
        rowNum++;
    }
    table.appendChild(header);
    table.appendChild(body);

    if(!document.getElementById('search')){
        getSearchBar();
    }
}

function editItem(id, callback, rowOrder){

    rowOrder.forEach(item => {
        if(item['id'] !== 'customer_Num'){
            let element = document.getElementById(item['id'] + '-' + id);
            let value = element.textContent || "";
            element.innerHTML = "";

            if(item['id'] === 'dob'){
                let dateArray = value.split('-');
                let date = dateArray[2] + '-' + dateArray[0] + '-' + dateArray[1];
                value = date;
            }

            let input = document.createElement('input');
            input.setAttribute('type', item['type']);
            input.setAttribute('id', item['id'] + '-' + id + '-input');
            input.setAttribute('value', value);
            element.appendChild(input);
        }
    });

    let editButton = document.getElementById('edit-' + id);
    editButton.style.display = 'none';

    let updateButton = document.getElementById('update-' + id);
    updateButton.style.display = 'inline';

 
}

function updateItem(id){
    let context = {};
    context['id'] = id;
    
    for(let i = 0; i < tableInfo['columnOrder'].length; i++){
        let key = tableInfo['columnOrder'][i]['id'];
        if(key !== 'customer_Num'){
            let element = document.getElementById(key + '-' + id + '-input');
            context[key] = element.value; 
        }
    }

    let editButton = document.getElementById('edit-' + id);
    editButton.style.display = 'inline';

    let updateButton = document.getElementById('update-' + id);
    updateButton.style.display = 'none';

    console.log(context);

    // let putRequest = httpRequest('PUT', '/customer/api', context);

    // putRequest.then(function(result){
    //     updateTable(result);
    // }).catch(function(err){
    //     console.log(err);
    // })
}

function deleteItem(id){
    let data = {};
    data.id = id;
    let deleteRequest = httpRequest('DELETE', '/customer/api', data);

    deleteRequest.then(function(result){
        updateTable(result);
    }).catch(function(err){
        console.log(err);
    })

}

function getSearchBar(){
    let tableTitle = document.querySelector('#table-title');
    let tableRows = document.querySelectorAll('.tr');
    let rowLengh = tableRows.length;
    let tableCells = document.querySelectorAll('.td');
    let cellLength = tableCells.length;

    let searchBar = document.createElement('input');
    searchBar.setAttribute('type', 'text');
    searchBar.setAttribute('id', 'search');
    searchBar.placeholder = "Search for Items"

    searchBar.addEventListener('keyup', event => {
        let value = event.target.value;
        value = value.toUpperCase();

        tableRows.forEach(row => {
            let td = row.childNodes;
            let tdArray = Array.from(td);
            let equals = true;

            let newTD = tdArray.filter(cell => {
                if(cell.style.display !== 'none'){
                    if(cell.innerText !== 'Edit'){
                        if(cell.innerText !== 'Delete'){
                            return cell;
                        }
                    }
                } 
            })

            for(let i = 0; i < 4; i++){
                if(newTD[i].innerText.toUpperCase().indexOf(value) > -1){
                    equals = false;
                } 
            }

            if(value === ""){
                row.style.display = "";
            }else if(equals){
                row.style.display ="none";
            }
            
        })
        
        
    })

    tableTitle.appendChild(searchBar);
}

function pageInit(){
    getAllItems();
}

document.addEventListener('DOMContentLoaded', pageInit);