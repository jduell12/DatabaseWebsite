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

    /* Displays all items. Requires web based javascript to delete items with Ajax */
    router.get('/', function(req, res){
        let callBackCount = 0;
        let context = {};
        context.jsscripts = ["deleteItem.js", "editItem.js"];
        let mysql = req.app.get('mysql');
        getItems(res, mysql, context, complete);
        function complete(){
            callBackCount++;
            if(callBackCount >= 1){
                res.render('inventory', context);
            }
        }
    });

    /* The URI update data is sent to in order to update an item */
    router.put('/:item_Num', function(req, res){
        let context = {};
        console.log(req.params.item_Num);
        context = req.params;
        res.render('editItem', context);
        // let mysql = req.app.get('mysql');
        // let sql = "UPDATE Items SET item_Type=?, item_Name=?, item_Price=?, number_Items_In_Stock=? WHERE item_Num=?";
        // let inserts = [req.body.item_Type, req.body.item_Name, req.body.item_Price, req.body.number_Items_In_Stock, req.params.item_Num];
        // sql = mysql.pool.query(sql,inserts,function(error,results,fields){
        //     if(error){
        //         res.write(JSON.stringify(error));
        //         res.end();
        //     }else{
        //         res.status(200);
        //         res.end();
        //     }
        // });
    });


    /* Route to delete item from database, returns 202 upon success. Ajax will handle this. */
    router.delete('/:item_Num', function(req, res){
        let mysql = req.app.get('mysql');
        let sql = "DELETE FROM Items WHERE item_Num = ?";
        let inserts = [req.params.item_Num];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    });

    return router;
}();