module.exports = function(){
    const express = require('express');
    const router = express.Router();

    function getItems(res, mysql, context, complete){
        mysql.pool.query("SELECT * FROM Items", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.items = results;
            complete();
        });
    }

    /*SELECT first_Name, last_Name for drop down menu */
    function getCustomers(res, mysql, context, complete){
        mysql.pool.query("SELECT * FROM Customers",
            function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customers = results;
            complete();
        });
    }

    router.get('/', function(req, res){
        let callBackCount = 0;
        let context = {};
        let mysql = req.app.get('mysql');
        getItems(res, mysql, context, complete);
        getCustomers(res, mysql, context, complete);
        function complete(){
            callBackCount++;
            if(callBackCount >= 2){
                res.render('addOrder.handlebars', context);
            }
        }
    });

    return router;
}();