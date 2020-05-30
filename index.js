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
app.use('/order.handlebars', require('./order.js'));
app.use('/customer.handlebars', require('./customer.js'));
app.use('/addOrder.handlebars', require('./addOrder.js'))

app.get('/', function(req, res){
    res.render('main');
});

app.get('/inventory.handlebars', function(req, res){
    res.render('inventory');
});

/* Fetches Item Data from Database and Displays on the addItem html page */
app.get('/addItem', function(req, res){
    res.render('addItem');
});

/* Uses the submit button on the addItem page to enter data into database then returns user to inventory.handlebars html page */
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
});


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
        console.log(context);
    });

    res.redirect('/order.handlebars');
});

app.get('/customer.handlebars', function(req, res){
    res.render('customer');
});

app.get('/addCustomer.handlebars', function(req, res){
    res.render('addCustomer');
});

app.post('/addCustomer.handlebars', function(req, res){

});

app.get('/addOrder.handlebars', function(req, res){
    res.render('addOrder');
});

app.post('/addOrder.handlebars', function(req, res){
    
});

app.listen(port, function(){
    console.log(`App listening to port ${port}`);
});