let tableInfo = {
    'columnOrder':[
        {'id': 'item_Num', 'readonly': true},
        {'id': 'item_Name', 'type': 'text'},
        {'id': 'item_Type', 'type':'text'},
        {'id': 'item_Price', 'type': 'number'},
        {'id': 'number_Items_In_Stock', 'type': 'number'},
        {'id': 'discount', 'type':'number'},
    ],
    'columnHeader': ['Item', 'Type', 'Price', 'Quantity', 'Discount'],
    'data': [],
    'route': '/addOrder/api',
    'callback': {'edit': function(){}}
};

function getCustomers(){
    let customer = document.getElementById('customer');
    let getCustomerRequest = httpRequest('GET', '/addOrder/api', {});
    getCustomerRequest.then(res => {
        let data = JSON.parse(res.responseText).payload;
        data.forEach(person => {
            let firstName = person['first_Name'];
            let lastName = person['last_Name'];
            let dob = person['dob'];
            let date = dob.split('T');
            let customerName = `${firstName} ${lastName} : Date of Birth:${date[0]}`;

            let option = document.createElement('option');
            option.text = customerName;
            customer.add(option);
        })
        getAllItems();
    })
    .catch(err => {
        console.log(err)
    });
}

function getAllItems(){
    let getRequest = httpRequest('GET', '/inventory/api', {});
    getRequest.then(function(result) {
        updateTable(result);
    }).catch(function(err){
        console.log(err);
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

            if(j == 0){
                let key = tableData['columnOrder'][j]['id']; 
                let cell = document.createElement('td');
                cell.className = 'td';
                cell.id = key + '-' + id;
                cell.textContent = key == 'actions' ? '': tableData['data'][i][key];
                cell.style.display = "none";
                cell.classList.remove('td');
                row.appendChild(cell);
            }else if(j === 4){
                let key = tableData['columnHeader'][j-1]; 
                let cell = document.createElement('td');
                cell.className = 'td';
                cell.setAttribute('type', 'number');
                cell.id = key + '-' + id;
                let quantInput = document.createElement('select');
                for(let i = 0; i < 100; i++){
                    let option = document.createElement('option');
                    option.value = i;
                    option.text = i;
                    quantInput.add(option);
                }
                cell.appendChild(quantInput)
                row.appendChild(cell);
            } else if(j === 5){
                let key = tableData['columnHeader'][j-1]; 
                let cell = document.createElement('td');
                cell.className = 'td';
                cell.setAttribute('type', 'number');
                cell.id = key + '-' + id;
                let discount = document.createElement('select');
                for(let i = 0; i < 100; i++){
                    let option = document.createElement('option');
                    option.value = i;
                    option.text = i;
                    discount.add(option);
                }
                cell.appendChild(discount);
                row.appendChild(cell);
            }else {
                let key = tableData['columnOrder'][j]['id']; 
                let cell = document.createElement('td');
                cell.className = 'td';
                cell.id = key + '-' + id;
                cell.textContent = key == 'actions' ? '': tableData['data'][i][key];
                row.appendChild(cell);
            } 
            
        }

        let checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.className = 'checkbox';
        checkbox.value = id;
        row.appendChild(checkbox);

        body.appendChild(row);
        rowNum++;
    }
    table.appendChild(header);
    table.appendChild(body);
}

function pageInit(){
    let submitBtn = document.getElementById('submit');

    submitBtn.addEventListener('click', event => {
        event.preventDefault();
        let data = {};
        data.items = [];

        let date = document.getElementById('date');
        let orderDate = date.value;
        let customer = document.getElementById('customer');
        let customerString = customer.value;
        let customerArray = customerString.split(':');
        let customerName = customerArray[0].split(" ");
        let firstName = customerName[0];
        let lastName = customerName[1];
        let dob = customerArray[2];

        let dateComp = dob.split("-");
        let array = [];
        dateComp.forEach(item => {
            array.push(parseInt(item));
        })
        let dateOfBirth = array[0] + '-' + array[1] + '-' + array[2];

        data.order_Date = orderDate;
        data.first_Name = firstName;
        data.last_Name = lastName;
        data.dob = dateOfBirth;

        let checkboxes = document.querySelectorAll('.checkbox');
        let checkArray = Array.from(checkboxes);
        let itemsBought = checkArray.filter(box => {
            if(box.checked){
                return box
            }
        })

        itemsBought.forEach(item => {
            let rowId = item.value;
            let itemChecked = [];
            let row = document.getElementById(rowId);
            let rowChildren = row.childNodes;

            rowChildren.forEach(child => {
                if(child.id === 'Quantity-'+rowId){
                    itemChecked.push(rowId);
                    itemChecked.push(child.firstChild.value);
                }else if(child.id === 'Discount-'+rowId){
                    itemChecked.push(child.firstChild.value);
                }
            })
            data.items.push(itemChecked);
        })

        let postRequest = httpRequest('POST', '/addOrder/api', data);

        postRequest.then(function(result){
            window.location.replace('order');
            
        }).catch(function(err){
            console.log(err);
        })
    })

    
    getCustomers();
}

document.addEventListener('DOMContentLoaded', pageInit);



    