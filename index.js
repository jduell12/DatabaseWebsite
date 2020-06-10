const express = require('express');
const app = express();
const port = 8766;
const handlebars = require('express-handlebars').create({defaultLayout: 'index'});
const helpers = require('handlebars-helpers')();
const path = require('path');

const mysql = require('./dbcon.js');
const bodyParser = require('body-parser');

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/', express.static('public'));

//set routes in the form of page_name/api
app.use('/inventory/api', require('./routes/inventory'));
app.use('/addItem/api', require('./routes/addItemRoute'));
app.use('/order/api', require('./routes/order'));
app.use('/addOrder/api', require('./routes/addOrder'));
app.use('/customer/api', require('./routes/customer'));

app.get('/', function(req, res){
    res.render('main');
});

app.get('/inventory', function(req, res){
    res.render('inventory');
});

app.get('/addItem', function(req, res){
    res.render('addItem');
});

app.get('/order', function(req, res){
    res.render('order');
});

app.get('/addOrder', function(req, res){
    res.render('addOrder');
});

app.get('/customer', function(req, res){
    res.render('customer');
});

app.get('/addCustomer.handlebars', function(req, res){
    res.render('addCustomer');
});

app.post('/addCustomer.handlebars', function(req, res, next){
    let context = {};
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
    console.log(`App listening to port ${port}, Ctrl+C to exit`);
});