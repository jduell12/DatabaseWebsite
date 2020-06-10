let express = require('express');
let router = express.Router();
let mysql = require('../dbcon');

router.route('/')
    .get(function(req, res){
        mysql.pool.query("SELECT * FROM Customers;", function(err, results){
            if(err){
                res.write(JSON.stringify(err));
                res.end()
            }
            res.json({'payload': results});
        })
    })
    .post(function(req, res){
        mysql.pool.query("SELECT preferred_Payment_Type, customer_Num FROM Customers WHERE first_Name = ? AND last_Name = ?;", [req.body.first_Name, req.body.last_Name], function(err, result){
            if(err){
                res.write(JSON.stringify(err));
                res.end();
            }
            let payment = JSON.stringify(result[0]['preferred_Payment_Type']);
            let customerNum = JSON.stringify(result[0]['customer_Num']);
        
            
            mysql.pool.query("INERT INTO ORDERS VALUES (NULL, ?, ?, 0, 0, ?);", [req.body.date, payment, customerNum], function(err, result){
                if(err){
                    res.write(JSON.stringify(err));
                    res.end();
                }
            })
        })
    })

module.exports = router;

// module.exports = function(){
//     const express = require('express');
//     const router = express.Router();

//     function getItems(res, mysql, context, complete){
//         mysql.pool.query("SELECT * FROM Items", function(error, results, fields){
//             if(error){
//                 res.write(JSON.stringify(error));
//                 res.end();
//             }
//             context.items = results;
//             complete();
//         });
//     }

//     router.get('/', function(req, res){
//         let callBackCount = 0;
//         let context = {};
//         let mysql = req.app.get('mysql');
//         getItems(res, mysql, context, complete);
//         function complete(){
//             callBackCount++;
//             if(callBackCount >= 1){
//                 res.render('addOrder.handlebars', context);
//             }
//         }
//     });

//     return router;
// }();