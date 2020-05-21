module.exports = function(){
    const express = require('express');
    const router = express.Router();

    function getItems(res, mysql, context, complete){
        mysql.pool.query("SELECT * FROM Items", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.results = results;
            complete();
        });
    }

    router.get('/', function(req, res){
        let callBackCount = 0;
        let context = {};
        let mysql = req.app.get('mysql');
        getItems(res, mysql, context, complete);
        function complete(){
            callBackCount++;
            if(callBackCount >= 1){
                res.render('main', context);
            }
        }
    })

    return router;
}();