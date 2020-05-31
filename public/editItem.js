function editItem(item_Num){
    $.ajax({
        url: '/inventory.handlebars/' + item_Num,
        type: 'PUT',
        data: $('#editItem').serialize(),
        success: function(result){
           window.location.replace("editItem");
        }
    })
};

// function updateItem(item_Num){
//     $.ajax({
//         url: '/editItem/' + item_Num,
//         type: 'PUT',
//         data: $('#updateItem').serialize(),
//         success: function(result){
//             window.location.replace("../inventory");
//         }
//     })
// };