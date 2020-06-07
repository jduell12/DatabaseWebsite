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
        context.jsscripts = ["deleteItem.js", "editItem.js", "mySearchFunction.js"];
        let mysql = req.app.get('mysql');
        getItems(res, mysql, context, complete);
        function complete(){
            callBackCount++;
            if(callBackCount >= 1){
                res.render('inventory', context);
            }
        }
    });

    router.put('/:item_Num', function(req, res){
        let context = {};
        let callBackCount = 0;
        let itemNum = req.params.item_Num;
        let mysql = req.app.get('mysql');
        let sql = 'SELECT * FROM Items WHERE item_Num = ?';

        console.log(`itemNum: ${itemNum}`);

        mysql.pool.query(sql, itemNum, function(err, results, fields){
            if(err){
                res.write(JSON.stringify.err);
                res.end();
            }
            context.item = results;
            console.log(`in router put`);
            console.log(context);

            res.render('inventory.handlebars', context);
        })
    })


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
                res.render('inventory');
            }
        })
    });

    return router;
}();