module.exports = function(){
    const express = require('express');
    const router = express.Router();

    
 

    router.get('/', function(req, res){
        let callBackCount = 0;
        let context = {};
        let mysql = req.app.get('mysql');
        addOrder(res, mysql, context, complete);
        function complete(){
            callBackCount++;
            if(callBackCount >= 1){
                res.render('customer', context);
            }
        }
    });

    return router;
}();