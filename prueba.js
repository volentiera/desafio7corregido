

const ClienteSql = require('./models/sql')
//const config = require('./config/mariaDB')
const config = require('./config/sqlite3')

const sql = new ClienteSql(config)


sql.createTable()
    .then(()=>{
        console.log("tabla creada")
    const products = [
        { name: 'Botines Addidas', price: 25000, image: 'https://i.postimg.cc/LXXXXXmB/botines-Addidas.jpg' },
        { name: 'Raqueta Tennis', price: 25000, image: 'https://i.postimg.cc/BtWQMBHM/raqueta-Head.jpg' }
    ]
    return sql.insertProducts(products)
    })
    .then(()=>{
        return sql.getProducts()
    })
    .then((x)=>{
        console.log(x)
    })
    .catch((err)=>{
        console.log(err)
        throw err
    })
    .finally(()=>{
        sql.close()
    })