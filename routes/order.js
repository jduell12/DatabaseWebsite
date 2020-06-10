let express = require('express');
let router = express.Router();
let mysql = require('../dbcon');

router.route('/')
    .get(function(req, res){
        mysql.pool.query("SELECT * FROM Orders INNER JOIN Customers ON Orders.fk_customer_Num = Customers.customer_Num;", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            res.json({'payload': results});
        });
    })
    .put(function(req, res){
        mysql.pool.query('UPDATE Orders SET order_Date = ?, payment_Type = ?, order_Complete = ?, order_Shipped = ? WHERE order_Num = ?;', [req.body.order_Date, req.body.payment_Type, req.body.order_Complete, req.body.order_Shipped, req.body.id], function(err, results){
            if(err){
                res.write(JSON.stringify(err));
                res.end();
            }
        })
        mysql.pool.query("SELECT * FROM Orders INNER JOIN Customers ON Orders.fk_customer_Num = Customers.customer_Num;", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            res.json({'payload': results});
        });
    })
    .delete(function(req, res){
        mysql.pool.query("DELETE FROM Orders WHERE order_Num = ?;", [req.body.id], function(err){
            if(err){
                res.write(JSON.stringify(err));
                res.end();
            }
        })
        mysql.pool.query("SELECT * FROM Orders INNER JOIN Customers ON Orders.fk_customer_Num = Customers.customer_Num;", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            res.json({'payload': results});
        });
    })

module.exports = router;