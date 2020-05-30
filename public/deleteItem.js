function deleteItem(item_Num){
    $.ajax({
        url: '/inventory.handlebars/' + item_Num,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};