const express = require('express');
const app = express();
const port = 8766;
const handlebars = require('express-handlebars').create({defaultLayout: 'index'});

const mysql = require('./dbcon.js');
const bodyParser = require('body-parser');

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: true}));
app.set('mysql', mysql);
app.use('/', express.static('public'));
app.use('/inventory.handlebars', require('./inventory.js'));
app.use('/editItem.handlebars', require('./edit.js'));
app.use('/order.handlebars', require('./order.js'));
app.use('/customer.handlebars', require('./customer.js'));
app.use('/addOrder.handlebars', require('./addOrder.js'))
// app.use('/orderItems.handlebars', require('./orderItems.js'));

app.get('/', function(req, res){
    res.render('main');
});

app.get('/inventory.handlebars', function(req, res){
    res.render('inventory');
});

app.get('/addItem', function(req, res){
    res.render('addItem');
});

app.post('/addItem', function(req, res, next){
    if(req.body['Submit']){
        mysql.pool.query("INSERT INTO Items VALUES (NULL, ?, ?, ?, ?);", [req.body.itemType, req.body.itemName, req.body.price, req.body.quantity], function(err){
            if (err) {
                next(err);
                return;
            }
        });
    }
    res.redirect('/inventory.handlebars');
    res.redirect('/inventory.handlebars');
});

app.get('/editItem', function(req, res){
    res.render('editItem');
});

// app.post('/editItem', function(req, res, next){
//     res.render('inventory');
// });

app.get('/order.handlebars', function(req, res){
    res.render('order');
});

app.post('/addOrder.handlebars', function(req, res, next){
    let context = {};
    
    //gets customer name and id from html and inserts new order in Orders table
    mysql.pool.query("SELECT customer_Num, preferred_Payment_Type FROM Customers WHERE first_name = ? AND last_Name = ?;", [req.body.firstName, req.body.lastName], function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }

        context = results;
        let custId = context[0].customer_Num;
        let payment = context[0].preferred_Payment_Type;
        
        mysql.pool.query("INSERT INTO Orders VALUES (NULL, ?, ?, 0, 0, ?);", [req.body.oDate, payment, custId], function(err){
            if (err) {
                next(err);
                return;
            }
        });

    });

    //gets item price that was selected from html form and creates new order item in Order_Items table
    
    mysql.pool.query("SELECT item_Price FROM Items WHERE item_Num = ?;", [req.body.item_Num], function(err, results, fields){
        if(err){
            res.write(JSON.stringify(err));
            res.end();
        }

        context = results;
        let itemPrice = context[0].item_Price;
        let sellingPrice = itemPrice;

        
        //gets order Num from order created above
        mysql.pool.query("SELECT order_Num from Orders ORDER BY order_Num DESC LIMIT 1;", function(err, results, fields){
            if(err){
                next(err);
                return;
            }

            context = results;
            let order_Num = context[0].order_Num + 1;

            if(req.body.discount !== 0){
                let percent = parseInt(req.body.discount[0])/100;
                sellingPrice = (sellingPrice - (sellingPrice * percent));
                sellingPrice = sellingPrice.toFixed(2);
            }

            //inserts order items into order_items table
            mysql.pool.query("INSERT INTO Order_Items VALUES(NULL, ?, ?, ?, 0, NULL, ?, ?);",[req.body.quant[0], req.body.discount[0], sellingPrice, order_Num, req.body.itemNum], function(err){
                if(err){
                    next(err);
                    return;
                }
            })
        })
    });

    res.redirect('/order.handlebars');
});

// app.get('/orderItems.handlebars', function(req, res){
//     res.render('orderItems');
// })

app.get('/customer.handlebars', function(req, res){
    res.render('customer');
});

app.get('/addCustomer.handlebars', function(req, res){
    res.render('addCustomer');
});

app.post('/addCustomer.handlebars', function(req, res, next){
    let context = {};
    console.log(req.body);

    //adds new customer to customer table
    if(req.body['submitBilling']){
        if(req.body['payment'] == 'Paypal'){
            mysql.pool.query("INSERT INTO Customers VALUES (NULL, ?, ?, ?, ?, ?, ?, ?);", [req.body.firstName, req.body.lastName, req.body.phone, 1, req.body.email, req.body.payment, req.body.dob], function(err){
                if(err){
                    next(err);
                    return;
                }
        
                mysql.pool.query("SELECT customer_Num FROM Customers ORDER BY customer_Num DESC LIMIT 1;", function(err, results, fields){
                    if(err){
                        next(err);
                        return;
                    }
                    context = results; 
                    let customerNum = context[0].customer_Num

                    mysql.pool.query("INSERT INTO PayPal VALUES(?, ?);", [req.body.email, customerNum], function(err){
                        if(err){
                            next(err);
                            return;
                        }
                    });
        
                    mysql.pool.query("INSERT INTO Billing_Addresses VALUES(NULL, ?, ?, ?, ?, ?, ?);", [req.body.address, req.body.city, req.body.state, req.body.zip, req.body.country, customerNum ], function(err){
                        if(err){
                            next(err);
                            return;
                        }
                    });

                    mysql.pool.query("INSERT INTO Shipping_Addresses VALUES(NULL, ?, ?, ?, ?, ?, ?);", [req.body.address, req.body.city, req.body.state, req.body.zip, req.body.country, customerNum], function(err){
                        if(err){
                            next(err);
                            return;
                        }
                    });
                });
               });
        } else /*payment is credit*/{
            mysql.pool.query("INSERT INTO Customers VALUES (NULL, ?, ?, ?, ?, ?, ?, ?);", [req.body.firstName, req.body.lastName, req.body.phone, 1, req.body.email, req.body.payment, req.body.dob], function(err){
                if(err){
                    next(err);
                    return;
                }
        
                mysql.pool.query("SELECT customer_Num FROM Customers ORDER BY customer_Num DESC LIMIT 1;", function(err, results, fields){
                    if(err){
                        next(err);
                        return;
                    }
                    context = results; 
                    let customerNum = context[0].customer_Num

                    let expDate = req.body.expmonth + '-'  + req.body.expyear;
                    console.log(expDate);

                    mysql.pool.query("INSERT INTO CreditCards VALUES(?, ?, ?, ?);", [req.body.cardnumber, expDate, req.body.cvv, customerNum], function(err){
                        if(err){
                            next(err);
                            return;
                        }
                    });
        
                    mysql.pool.query("INSERT INTO Billing_Addresses VALUES(NULL, ?, ?, ?, ?, ?, ?);", [req.body.address, req.body.city, req.body.state, req.body.zip, req.body.country, customerNum ], function(err){
                        if(err){
                            next(err);
                            return;
                        }
                    });

                    mysql.pool.query("INSERT INTO Shipping_Addresses VALUES(NULL, ?, ?, ?, ?, ?, ?);", [req.body.address, req.body.city, req.body.state, req.body.zip, req.body.country, customerNum], function(err){
                        if(err){
                            next(err);
                            return;
                        }
                    });
                });
               });
        }
     
    }else /* different shipping address than billing address */ {
        if(req.body['payment'] == 'Paypal'){
            mysql.pool.query("INSERT INTO Customers VALUES (NULL, ?, ?, ?, ?, ?, ?, ?);", [req.body.firstName, req.body.lastName, req.body.phone, 1, req.body.email, req.body.payment, req.body.dob], function(err){
                if(err){
                    next(err);
                    return;
                }
        
                mysql.pool.query("SELECT customer_Num FROM Customers ORDER BY customer_Num DESC LIMIT 1;", function(err, results, fields){
                    if(err){
                        next(err);
                        return;
                    }
                    context = results; 
                    let customerNum = context[0].customer_Num

                    mysql.pool.query("INSERT INTO PayPal VALUES(?, ?);", [req.body.email, customerNum], function(err){
                        if(err){
                            next(err);
                            return;
                        }
                    });
        
                    mysql.pool.query("INSERT INTO Billing_Addresses VALUES(NULL, ?, ?, ?, ?, ?, ?);", [req.body.address, req.body.city, req.body.state, req.body.zip, req.body.country, customerNum ], function(err){
                        if(err){
                            next(err);
                            return;
                        }
                    });

                    mysql.pool.query("INSERT INTO Shipping_Addresses VALUES(NULL, ?, ?, ?, ?, ?, ?);", [req.body.shippingAddress, req.body.shippingCity, req.body.shippingState, req.body.shippingZip, req.body.shippingCountry, customerNum], function(err){
                        if(err){
                            next(err);
                            return;
                        }
                    });
                });
               });
        } else /*payment is credit*/{
            mysql.pool.query("INSERT INTO Customers VALUES (NULL, ?, ?, ?, ?, ?, ?, ?);", [req.body.firstName, req.body.lastName, req.body.phone, 1, req.body.email, req.body.payment, req.body.dob], function(err){
                if(err){
                    next(err);
                    return;
                }
        
                mysql.pool.query("SELECT customer_Num FROM Customers ORDER BY customer_Num DESC LIMIT 1;", function(err, results, fields){
                    if(err){
                        next(err);
                        return;
                    }
                    context = results; 
                    let customerNum = context[0].customer_Num

                    let expDate = req.body.expmonth + '-'  + req.body.expyear;
                    console.log(expDate);

                    mysql.pool.query("INSERT INTO CreditCards VALUES(?, ?, ?, ?);", [req.body.cardnumber, expDate, req.body.cvv, customerNum], function(err){
                        if(err){
                            next(err);
                            return;
                        }
                    });
        
                    mysql.pool.query("INSERT INTO Billing_Addresses VALUES(NULL, ?, ?, ?, ?, ?, ?);", [req.body.address, req.body.city, req.body.state, req.body.zip, req.body.country, customerNum ], function(err){
                        if(err){
                            next(err);
                            return;
                        }
                    });

                    mysql.pool.query("INSERT INTO Shipping_Addresses VALUES(NULL, ?, ?, ?, ?, ?, ?);", [req.body.shippingAddress, req.body.shippingCity, req.body.shippingState, req.body.shippingZip, req.body.shippingCountry, customerNum], function(err){
                        if(err){
                            next(err);
                            return;
                        }
                    });
                });
               });
        }
    }

    res.redirect('/');
});

app.get('/addOrder.handlebars', function(req, res){
    res.render('addOrder');
});

app.post('/addOrder.handlebars', function(req, res){
    
});

app.listen(port, function(){
    console.log(`App listening to port ${port}`);
});