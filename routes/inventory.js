let express = require('express');
let router = express.Router();
let mysql = require('../dbcon');

router.route('/')
    .get(function(req, res){
        mysql.pool.query("SELECT * FROM Items", function(error, results){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            res.json({'payload': results});
        })
    })
    .put(function(req, res){
        mysql.pool.query('UPDATE Items SET item_Type = ?, item_Name = ?, item_Price = ?, number_Items_In_Stock = ? WHERE item_Num = ?;', [req.body.item_Type, req.body.item_Name, req.body.item_Price, req.body.number_Items_In_Stock, req.body.id], function(err){
            if(err){
                res.write(JSON.stringify(err));
                res.end();
            }
            mysql.pool.query("SELECT * FROM Items",function(err, results){
                if(err){
                    res.write(JSON.stringify(err));
                    res.end();
                }
                res.json({'payload': results});
            })
        });
    })
    .delete(function(req, res){

        mysql.pool.query('DELETE FROM Items WHERE item_Num = ?;', [req.body.id], function(err){
            if(err){
                res.write(JSON.stringify(err));
                res.end();
            }
            mysql.pool.query("SELECT * FROM Items", function(error, results){
                if(error){
                    res.write(JSON.stringify(error));
                    res.end();
                }
                res.json({'payload': results});
            })
        })

    })

module.exports = router;