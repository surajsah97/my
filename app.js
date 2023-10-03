var createError = require('http-errors');
var express = require('express');
var path = require('path');
var morgan = require('morgan');

require('dotenv').config({
    path: `./env-files/${process.env.ENV || 'dev'}.env`,
});

// profiling for the servers
console.log('current env:', process.env.ENV);
global.APPDIR = path.resolve(__dirname).toString();
global.CONFIGS = require('./configs/config.json');

// connect mongodb
require('./models/dbConnections');

var app = express();
var morgan = require('morgan')
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

console.log("here")

// request cros
app.use(function (req, res, next) {
    
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,authToken,Authorization,Content-Type,Accept");
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});

console.log("version", process.env.VERSION)

app.use('/v' + process.env.VERSION + '/user/', require('./route/User_R'));
app.use('/v' + process.env.VERSION + '/catSubcat/', require('./route/catSubcat_R'));
app.use('/v' + process.env.VERSION + '/product/', require('./route/product_R'));

module.exports = app;
