let express = require('express');
let router = express.Router();
let mysql = require('../dbcon');

router.route('/')
    .get(function(req, res){
        mysql.pool.query("SELECT * from Customers INNER JOIN Billing_Addresses ON Customers.customer_Num = fk_billing_customer_Num INNER JOIN Shipping_Addresses ON Customers.customer_Num = Shipping_Addresses.fk_shipping_customer_Num;", function(err, results){
            if(err){
                res.write(JSON.stringify(err));
                res.end();
            }
            console.log(results);
            res.json({'payload': results});
        }) 
    })
    .put(function(req, res){
        mysql.pool.query("UPDATE Customers SET first_Name = ?, last_Name = ?, phone_Num = ?, email = ?, preferred_Payment_Type = ?, dob=? WHERE customer_Num = ?;", [req.body.first_Name, req.body.last_Name, req.body.phone_Num, req.body.email, req.body.payment, req.body.dob, req.body.id], function(err, results){
            if(err){
                res.write(JSON.stringify(err));
                res.end();
            }
            mysql.pool.query("SELECT * from Customers INNER JOIN Billing_Addresses ON Customers.customer_Num = fk_billing_customer_Num INNER JOIN Shipping_Addresses ON Customers.customer_Num = Shipping_Addresses.fk_shipping_customer_Num;", function(err, results){
                if(err){
                    res.write(JSON.stringify(err));
                    res.end();
                }
                res.json({'payload': results});
            }) 
        })
        
    })
    .delete(function(req, res){
        mysql.pool.query("DELETE FROM Customers WHERE customer_Num = ?;", [req.body.id], function(err, res){
            if(err){
                res.write(JSON.stringify(err));
                res.end();
            }
        })
        mysql.pool.query("SELECT * from Customers INNER JOIN Billing_Addresses ON Customers.customer_Num = fk_billing_customer_Num INNER JOIN Shipping_Addresses ON Customers.customer_Num = Shipping_Addresses.fk_shipping_customer_Num;", function(err, results){
            if(err){
                res.write(JSON.stringify(err));
                res.end();
            }
            res.json({'payload': results});
        }) 
    })  

module.exports = router;
