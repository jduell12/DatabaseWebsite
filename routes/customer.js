let express = require('express');
let router = express.Router();
let mysql = require('../dbcon');

router.route('/')
    .get(function(req, res){

    })
    .post(function(req, res){
        
    })
    .delete(function(req, res){

    })

module.exports = router;

// module.exports = function(){
//     const express = require('express');
//     const router = express.Router();

//     /*SELECT * FROM Orders INNER JOIN Customers ON Orders.fk_customer_Num = Customers.customer_Num; */
//     function getCustomers(res, mysql, context, complete){
//         mysql.pool.query("SELECT FORMAT(getdate(), 'MMM dd yyyy') as dob")
//         mysql.pool.query("SELECT * from Customers INNER JOIN Billing_Addresses ON Customers.customer_Num = fk_billing_customer_Num INNER JOIN Shipping_Addresses ON Customers.customer_Num = Shipping_Addresses.fk_shipping_customer_Num;", 
//             function(error, results, fields){
//             if(error){
//                 res.write(JSON.stringify(error));
//                 res.end();
//             }
//             context.customers = results;
//             complete();
//         });
//     }

//     /* Displays all people. Requires web based javascript to delete users with Ajax */
//     router.get('/', function(req, res){
//         let callBackCount = 0;
//         let context = {};
//         context.jsscripts = ["deleteCustomer.js"];
//         let mysql = req.app.get('mysql');
//         getCustomers(res, mysql, context, complete);
//         function complete(){
//             callBackCount++;
//             if(callBackCount >= 1){
//                 res.render('customer', context);
//             }
//         }
//     });

//     /* Route to delete customer from database, returns 202 upon success. Ajax will handle this. */
//     router.delete('/:customer_Num', function(req, res){
//         let mysql = req.app.get('mysql');
//         let sql = "DELETE FROM Customers WHERE customer_Num = ?";
//         let inserts = [req.params.customer_Num];
//         sql = mysql.pool.query(sql, inserts, function(error, results, fields){
//             if(error){
//                 res.write(JSON.stringify(error));
//                 res.status(400);
//                 res.end();
//             }else{
//                 res.status(202).end();
//             }
//         })
//         res.render('customer.handlebars');
//     });

//     return router;
// }();