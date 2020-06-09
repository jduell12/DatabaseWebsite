let tableInfo = {
    'columnOrder':[
        {'id': 'item_Num', 'readonly': true},
        {'id': 'item_Name', 'type': 'text'},
        {'id': 'item_Type', 'type':'text'},
        {'id': 'item_Price', 'type': 'number'},
        {'id': 'number_Items_In_Stock', 'type': 'number'},
    ],
    'columnHeader': ['Item', 'Type', 'Price', 'Number in Stock'],
    'data': [],
    'route': '/inventory/api',
    'callback': {'edit': function(){}}
};

function getAllItems(){
    let getRequest = httpRequest('GET', '/inventory/api', {});
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
        let id = tableData['data'][i][tableData['columnOrder'][0]['id']];
        row.setAttribute('id', id);
        let rowNum = 0;

        for(let j = 0; j < colomnOrderArray.length; j++){
            let key = tableData['columnOrder'][j]['id'];
            let cell = document.createElement('td');
            cell.id = key + '-' + id;
            cell.textContent = key == 'actions' ? '': tableData['data'][i][key];

            if(j == 0){
                cell.style.display = "none";
            }
            row.appendChild(cell);
        }

        //creates delete button
        let deleteButton = document.createElement('button');
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener('click', deleteItem.bind(this, id, tableInfo['columnOrder'][rowNum]['delete'], tableInfo['columnOrder']), false);
        row.appendChild(deleteButton);

        //creates edit button
        let editButton = document.createElement('button');
        editButton.textContent = "Edit";
        editButton.setAttribute('id', 'edit');
        editButton.addEventListener('click', editItem.bind(this, id, tableInfo['columnOrder'][rowNum]['edit'], tableInfo['columnOrder']), false);
        row.appendChild(editButton);

        //creates hidden update button
        let update = document.createElement('button');
        update.textContent = "Update";
        update.setAttribute('id', 'update');
        update.addEventListener('click', updateItem.bind(this, id));
        update.style.display = "none";
        row.appendChild(update);

        body.appendChild(row);
        rowNum++;
    }
    table.appendChild(header);
    table.appendChild(body);

    // console.log(table);
}

function editItem(id, callback, rowOrder){

    rowOrder.forEach(item => {
        if(item['id'] !== 'item_Num'){
            let element = document.getElementById(item['id'] + '-' + id);
            let value = element.textContent || "";
            element.innerHTML = "";

            let input = document.createElement('input');
            input.setAttribute('type', item['type']);
            input.setAttribute('id', item['id'] + '-' + id + '-input');
            input.setAttribute('value', value);
            element.appendChild(input);
        }
    });

    let editButton = document.getElementById('edit');
    editButton.style.display = 'none';

    let updateButton = document.getElementById('update');
    updateButton.style.display = 'inline';

 
}

function updateItem(id){
    let context = {};
    context['id'] = id;
    
    for(let i = 0; i < tableInfo['columnOrder'].length; i++){
        let key = tableInfo['columnOrder'][i]['id'];
        if(key !== 'item_Num'){
            let element = document.getElementById(key + '-' + id + '-input');
            context[key] = element.value; 
        }
    }

    let putRequest = httpRequest('PUT', '/inventory/api', context);

    putRequest.then(function(result){
        updateTable(result);
    }).catch(function(err){
        console.log(err);
    })
}

function deleteItem(id, route, callback){
    let deleteRequest = httpRequest('DELETE', route, {'id': id});
    deleteRequest.then(callback);
}

function pageInit(){
    getAllItems();
}

document.addEventListener('DOMContentLoaded', pageInit);