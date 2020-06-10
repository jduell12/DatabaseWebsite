let express = require('express');
let router = express.Router();
let mysql = require('../dbcon');

router.route('/')
    .get(function(req, res){
        mysql.pool.query("SELECT * FROM Orders INNER JOIN Customers ON Orders.fk_customer_Num = Customers.customer_Num;", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            console.log('in router');
            console.log(results);
            res.json({'payload': results});
        });
    })
    .put(function(req, res){

    })
    .delete(function(req, res){

    })

module.exports = router;

// module.exports = function(){
//     const express = require('express');
//     const router = express.Router();
 

//     router.get('/', function(req, res){
//         let callBackCount = 0;
//         let context = {};
//         context.jsscripts = ["deleteOrder.js"];
//         let mysql = req.app.get('mysql');
//         getOrders(res, mysql, context, complete);
//         function complete(){
//             callBackCount++;
//             if(callBackCount >= 1){
//                 res.render('order', context);
//             }
//         }
//     });

//     /* Route to delete order from database, returns 202 upon success. Ajax will handle this. */
//     router.delete('/:order_Num', function(req, res){
//         let mysql = req.app.get('mysql');
//         let sql = "DELETE FROM Orders WHERE order_Num = ?";
//         let inserts = [req.params.order_Num];
//         sql = mysql.pool.query(sql, inserts, function(error, results, fields){
//             if(error){
//                 res.write(JSON.stringify(error));
//                 res.status(400);
//                 res.end();
//             }else{
//                 res.render('order');
//             }
//         })
//     });

//     return router;
// }();