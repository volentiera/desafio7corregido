
const {Router} = require('express');
const router = Router();

const ClienteSql = require('../models/sql')
//const config = require('../config/mariaDB')
const config = require('../config/sqlite3')

const sql = new ClienteSql(config)


const jsScript = 'public/main.js';





router.get('/', async (req, res) => {
    const products = await sql.getProducts()
    res.render('index', { products , jsScript });
});




module.exports = router;