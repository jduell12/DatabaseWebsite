let mysql = require('mysql');
let pool = mysql.createPool({
    host: 'classmysql.engr.oregonstate.edu',
    user: 'cs340_duellje',
    password: '8766',
    database: 'cs340_duellje'
});

module.exports.pool = pool;