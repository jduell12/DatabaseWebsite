let express = require('express');
let router = express.Router();
let mysql = require('../dbcon');

router.route('/')
    .get(function(req, res){

    })
    .post(function(req,res){
        mysql.pool.query("INSERT INTO Items VALUES (NULL, ?, ?, ?, ?);", [req.body.item_Type, req.body.item_Name, req.body.item_Price, req.body.number_In_Stock], function(err, result){
            if (err) {
                res.write(JSON.stringify(err));
                res.end();
            }
            res.json({'payload': result});
        });
    })

module.exports = router;