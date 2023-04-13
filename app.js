const app = require("express")();
const cors = require('cors');
require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

app.use(cors());

let port = process.env.PORT || 6000;

const HOST = process.env.HOST || '0.0.0.0';

mongoose.Promise = global.Promise;

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database', error)
    }else {
        return console.log('Successfully connected to database')
    }
});

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.send("Welcome to API!");
});


let v1 = require('./api/routes');

app.use('/api', v1.router);

app.use(function(req, res) {
    res.status(404).send({ url: req.originalUrl + ' not found' })
});

app.listen(port,HOST, () => {
    console.log(`API server started on: http://${HOST}:${port}/`);
});