module.exports = function(){
    const express = require('express');
    const router = express.Router();

        /* Returns one item from database */
        // function getItems(res, mysql, context, item_Num, complete){
        //     let sql = "SELECT item_Num, item_Type, item_Name, item_Price, number_Items_In_Stock FROM Items WHERE item_Num = ?";
        //     let inserts = [item_Num];
        //     mysql.pool.query(sql, inserts, function(error, results, fields){
        //         if(error){
        //             res.write(JSON.stringify(error));
        //             res.end();
        //         }
        //         context.items = results;
        //         console.log(context);
        //         complete();
        //     });
        // }

    //  /* Displays all items. Requires web based javascript to delete items with Ajax */
    router.get('/', function(req, res){
        let callBackCount = 0;
        let context = {};
        context.jsscripts = ["editItem.js"];
        let mysql = req.app.get('mysql');
        // getItems(res, mysql, context, complete);
        // function complete(){
        //     callBackCount++;
        //     if(callBackCount >= 1){
        //         res.render('editItem.handlebars', context);
        //     }
        // }
    });

    return router;
}();