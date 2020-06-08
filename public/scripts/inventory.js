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

function httpRequest(method, route, data){
    return new Promise(function(resolve, reject){
        let req = new XMLHttpRequest();
        req.open(method, route, true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.send(JSON.stringify(data));
        event.preventDefault();
        req.addEventListener('load', function(){
            if(req.status >= 200 && req.status < 400){
                resolve(req);
            }else {
                reject(req);
            }
        })
    })
}

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

    console.log(`tableInfo`);
    console.log(tableData);

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
            rowNum++;

        }
        
        body.appendChild(row);
    }
    table.appendChild(header);
    table.appendChild(body);

    // console.log(table);
}

function editItem(id, callback, rowOrder){
    for(let i = 0; i < rowOrder.legnth; i++){
        if(!rowOrder[i]['readonly']){
            let key = rowOrder[i]['id'];
            let element = document.getElementById(`${key}-${id}`);
            let value = element.textContent || '';
            element.innerHTML = "";

            if(key != 'actions'){
                let input = document.createElement('input');
                input.setAttribute('type', rowOrder[i]['type']);
                input.setAttribute('value', rowOrder[i]['type'][value]);
                input.setAttribute('id', `${key}-${id}-input`);
                element.appendChild(input);
            } else {
                let button = document.createElement('button');
                button.textContent = 'Update';
                button.addEventListener('click', callback.bind(this, id), false);
                element.appendChild(button);
            }
        }
    }
}

function deleteItem(id, route, callback){
    let deleteRequest = httpRequest('DELETE', route, {'id': id});
    deleteRequest.then(callback);
}

function updateInventory(id){
    let data = {};
    data['id'] = id;
    for(let i = 0; i < tableInfo['columnOrder'].length; i++){
        let key = tableInfo['columnOrder'][i]['id'];
        let isReadOnly = tableInfo['columnOrder'][i]['readonly'];

        if(key != actions && !isReadOnly){
            let element = document.getElementById(`${key}-${id}-input`);
            data[key] = element.value;
        }
    }
    let putRequest = httpRequest('PUT', '/inventory/api', data);
    putRequest.then(function(result){
        updateTable(result);
    }).catch(function(err){
        console.log(`Err: ${err}`);
    })
}

function pageInit(){
    getAllItems();
}

document.addEventListener('DOMContentLoaded', pageInit);