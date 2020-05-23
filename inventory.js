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

    router.get('/', function(req, res){
        let callBackCount = 0;
        let context = {};
        context.jsscripts = ["deleteItem.js"];
        let mysql = req.app.get('mysql');
        getItems(res, mysql, context, complete);
        function complete(){
            callBackCount++;
            if(callBackCount >= 1){
                res.render('inventory', context);
            }
        }
    });

    /*Route to delete item from database */
    // router.delete('/inventory/:item_Num', function(req, res){
    //     let mysql = req.app.get('mysql');
    //     let sql = "DELETE FROM Items WHERE item_Num = ?";
    //     let inserts = [req.params.item_Num];
    //     sql = mysql.pool.query(sql, inserts, function(error, results, fields){
    //         if(error){
    //             console.log(error);
    //             res.write(JSON.stringify(error));
    //             res.status(400);
    //             res.end();
    //         }else{
    //             res.status(202).end();
    //         }
    //     })
    // });

    return router;
}();