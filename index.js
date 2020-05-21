const express = require('express');
const app = express();
const port = 3000;
const handlebars = require('express-handlebars').create({
    defaultLayout: 'index',
});

const mysql = require('./dbcon.js');
const bodyParser = require('body-parser');

app.set('view engine', 'handlebars');
app.engine('handlebars', handlebars.engine);
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: true}));
app.set('mysql', mysql);
app.use('/', require('./main.js'));
app.use('/inventory.handlebars', require('./inventory.js'));
app.use('/order.handlebars', require('./order.js'));
// app.use('/customer.handlebars', require('./customer.js'));
// app.use('/addCustomer.handlebars', require('./addC.js'));
// app.use('/addOrder.handlebars', require('./addO.js'));

app.get('/', function(req, res){
    res.render('main');
});

app.get('/inventory.handlebars', function(req, res){
    res.render('inventory');
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

app.get('/addOrder.handlebars', function(req, res){
    res.render('addOrder');
})

app.listen(port, function(){
    console.log(`App listening to port ${port}`);
});