function deleteOrder(order_Num){
    $.ajax({
        url: '/order.handlebars/' + order_Num,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};