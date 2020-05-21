module.exports = function(){
    const express = require('express');
    const router = express.Router();

    function getOrders(res, mysql, context, complete){
        mysql.pool.query("SELECT * FROM Orders INNER JOIN Customers ON Orders.fk_customer_Num = Customers.customer_Num;", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.orders = results;
            complete();
        });
    }

    // function getCustomerName(res, mysql, context, complete){
    //     mysql.pool.query("SELECT first_Name FROM Customers WHERE ")
    // }
 

    router.get('/', function(req, res){
        let callBackCount = 0;
        let context = {};
        let mysql = req.app.get('mysql');
        getOrders(res, mysql, context, complete);
        // getCustomerName(res, mysql, context, complete);
        function complete(){
            callBackCount++;
            if(callBackCount >= 1){
                res.render('order', context);
            }
        }
    })

    return router;
}();