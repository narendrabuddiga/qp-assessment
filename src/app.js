require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { promisify } = require('util')
const app = express();
const config = require('./config/config');
const port = config.PORT || 8000;
const router = require('./routes/index');
const initialize = require('./db/initialize');


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', router);

//Allowing access headers and requests
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "HEAD, OPTIONS, GET, POST, PUT, PATCH, DELETE, CONNECT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

//set get request and message at root
app.get('/health', (req, res) => {
    res.send('Server is Up And Running.')
})

const startServer = async () => {
    await promisify(app.listen).bind(app)(port);
    //await initialize.startConnections();
    console.log(`App is Running at Port ${port}`)
}

startServer();