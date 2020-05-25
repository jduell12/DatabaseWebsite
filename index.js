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
    res.redirect('/');
});



app.get('/order.handlebars', function(req, res){
    res.render('order');
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