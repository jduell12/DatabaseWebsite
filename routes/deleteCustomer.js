function deleteCustomer(customer_Num){
    $.ajax({
        url: '/customer.handlebars/' + customer_Num,
        type: 'DELETE',
        success: function(result){
            window.location.reload();
        }
    })
};