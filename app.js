var createError = require('http-errors');
var express = require('express');
const cors = require("cors");
var path = require('path');
const cookieParser = require("cookie-parser");
var morgan = require('morgan');
var customError = require('./middleware/customerror');
var globalError = require('./controller/error_C')

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
// app.use(function (req, res, next) {
    
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
//     res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,authToken,Authorization,Content-Type,Accept");
//     res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//     next();
// });

const corsOptions = {
    origin: ["*"],
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(cookieParser());

console.log("version", process.env.VERSION)

app.use('/v' + process.env.VERSION + '/front/user/', require('./route/frontRoute/User_RF'));
app.use('/v' + process.env.VERSION + '/admin/user/', require('./route/adminRoute/User_RA'));

app.use('/v' + process.env.VERSION + '/front/catsubcat/', require('./route/frontRoute/catSubcat_RF'));
app.use('/v' + process.env.VERSION + '/admin/catsubcat/', require('./route/adminRoute/catSubcat_RA'));

app.use('/v' + process.env.VERSION + '/front/product/', require('./route/frontRoute/product_RF'));
app.use('/v' + process.env.VERSION + '/admin/product/', require('./route/adminRoute/product_RA'));

app.use('/v' + process.env.VERSION + '/front/subplan/', require('./route/frontRoute/subscriptionPlan_RF'));
app.use('/v' + process.env.VERSION + '/admin/subplan/', require('./route/adminRoute/subscriptionPlan_RA'));

app.use('/v' + process.env.VERSION + '/front/checkout/', require('./route/frontRoute/checkOut_RF'));
// app.use('/v' + process.env.VERSION + '/front/checkout/', require('./route/frontRoute/checkOut_RF'));

// app.use('/v' + process.env.VERSION + '/front/checkout/', require('./route/frontRoute/checkOut_RF'));
app.use('/v' + process.env.VERSION + '/admin/adminauth/', require('./route/adminRoute/admin_RA'));

app.use('/v' + process.env.VERSION + '/admin/truckbrand/', require('./route/adminRoute/TruckBrand_RA'));
app.use('/v' + process.env.VERSION + '/admin/truckmodel/', require('./route/adminRoute/TruckModel_RA'));

app.use('/v' + process.env.VERSION + '/admin/bikebrand/', require('./route/adminRoute/BikeBrand_RA'));
app.use('/v' + process.env.VERSION + '/admin/bikemodel/', require('./route/adminRoute/BikeModel_RA'));

app.use('/v' + process.env.VERSION + '/admin/notification/', require('./route/adminRoute/notification_RA'));

app.use('/v' + process.env.VERSION + '/admin/bike/', require('./route/adminRoute/BikeDetails_RA'));

app.use('/v' + process.env.VERSION + '/admin/driver/', require('./route/adminRoute/Driver_RA'));
app.use('/v' + process.env.VERSION + '/front/driver/', require('./route/frontRoute/Driver_RF'));

app.all('*', (req, res, next) => {
    const err = new customError(`can't find this(${req.originalUrl}) URL on server`, 404);
    next(err);
})

app.use(globalError);

module.exports = app;
