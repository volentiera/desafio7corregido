const express = require('express')
const morgan = require('morgan');
const routeProducts = require('./routes/productRoutes');
const path = require('path');
const { Server: IOServer } = require('socket.io')
const http = require('http');
const app = express()
const PORT = 8081
const ClienteSql = require('./models/sql')

//const config = require('./config/mariaDB')
const config = require('./config/sqlite3')

const sql = new ClienteSql(config)



const httpServer = http.createServer(app)
const io = new IOServer(httpServer)


app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.use(express.static(__dirname + '/public'))
app.set('views',path.join(__dirname, './public/views'));
app.set('view engine', 'ejs');


app.use('/api/products', routeProducts);
app.get('/', (req , res)=>{
    res.redirect('/api/products')
})
const messages = []

io.on('connection', async (socket) => {
    console.log('New user connected. Socket ID : ', socket.id);

    socket.emit('products', await sql.getProducts());

    socket.on('update', async product => {

    await sql.insertProducts(product)
    io.sockets.emit('products', await sql.getProducts());

    })

    socket.on('set-name', (name) => {
        console.log('set-name', name);
        socket.emit('user-connected', name);
        socket.broadcast.emit('user-connected', name);
    });

    socket.on('new-message', (message) => {
        messages.push(message);
        socket.emit('messages', messages);
        socket.broadcast.emit('messages', messages);
    });

    socket.on('disconnect', () => {
        console.log('User was disconnected');
    });

}
);
const server = httpServer.listen(PORT, () =>
    console.log(
        `Server started on PORT http://localhost:${PORT} at ${new Date().toLocaleString()}`
    )
);

server.on('error', (err) =>{
    console.log('Error en el servidor:', err)
})
