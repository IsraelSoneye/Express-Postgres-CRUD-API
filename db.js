const {Pool} = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'IOS',
    password: 'Choice30',
    port: 5432
});



module.exports = pool;