function pageInit(){
    let submitBtn = document.getElementById('submit');

    submitBtn.addEventListener('click', event => {
        let item_Name = document.getElementById('item_Name');
        let item_Type = document.getElementById('item_Type');
        let item_Price = document.getElementById('price');
        let number_In_Stock = document.getElementById('quantity');
        let data = {};

        data.item_Name = item_Name.value;
        data.item_Type = item_Type.value;
        data.item_Price = item_Price.value;
        data.number_In_Stock = number_In_Stock.value;

        let postRequest = httpRequest('POST', '/addItem/api', data);

        postRequest.then(function(result){
            window.location.replace('inventory');
            
        }).catch(function(err){
            console.log(err);
        })
    })
}

document.addEventListener('DOMContentLoaded', pageInit);



    