function editItem(item_Num){
    $.ajax({
        url: '/inventory.handlebars/' + item_Num,
        type: 'PUT',
        data: $('#editItem').serialize(),
        success: function(result){
           window.location.replace("../inventory.handlebars" + item_Num);
        }
    })
};