var createError = require("http-errors");
var express = require("express");
const cors = require("cors");
var path = require("path");
const cookieParser = require("cookie-parser");
var morgan = require("morgan");
var customError = require("./middleware/customerror");
var globalError = require("./controller/error_C");

require("dotenv").config({
  path: `./env-files/.env.${process.env.NODE_ENV}`,
});

// profiling for the servers
console.log("current env:", process.env.ENV);
global.APPDIR = path.resolve(__dirname).toString();
global.CONFIGS = require("./configs/config.json");

// connect mongodb
require("./models/dbConnections");

var app = express();
app.set("view engine", "ejs");
var morgan = require("morgan");
app.use(morgan("tiny"));
// app.use(express.json());
app.use(express.json({limit: '50mb'}));
// app.use(express.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: false },{limit: '50mb'}));
app.use(express.static(path.join(__dirname, "public")));

console.log("here");

// request cros
// app.use(function (req, res, next) {

//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
//     res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,authToken,Authorization,Content-Type,Accept");
//     res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//     next();
// });

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://dhudu.ae",
    "https://admin.dhudu.ae",
  ],
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(cookieParser());

console.log("version", process.env.VERSION);

app.use(
  "/v" + process.env.VERSION + "/front/user/",
  require("./route/frontRoute/User_RF")
);
app.use(
  "/v" + process.env.VERSION + "/front/trialusers/",
  require("./route/frontRoute/TrialUsers_RF")
);
app.use(
  "/v" + process.env.VERSION + "/admin/trialuserslist/",
  require("./route/adminRoute/TrialUsers_RA")
);
app.use(
  "/v" + process.env.VERSION + "/admin/user/",
  require("./route/adminRoute/User_RA")
);

app.use(
  "/v" + process.env.VERSION + "/front/catsubcat/",
  require("./route/frontRoute/catSubcat_RF")
);
app.use(
  "/v" + process.env.VERSION + "/admin/catsubcat/",
  require("./route/adminRoute/catSubcat_RA")
);

app.use(
  "/v" + process.env.VERSION + "/front/product/",
  require("./route/frontRoute/product_RF")
);
app.use(
  "/v" + process.env.VERSION + "/admin/product/",
  require("./route/adminRoute/product_RA")
);
app.use(
  "/v" + process.env.VERSION + "/admin/vat/",
  require("./route/adminRoute/Vat_RA")
);
app.use(
  "/v" + process.env.VERSION + "/front/vat/",
  require("./route/frontRoute/Vat_RF")
);

app.use(
  "/v" + process.env.VERSION + "/front/subplan/",
  require("./route/frontRoute/subscriptionPlan_RF")
);
app.use(
  "/v" + process.env.VERSION + "/admin/subplan/",
  require("./route/adminRoute/subscriptionPlan_RA")
);
app.use(
  "/v" + process.env.VERSION + "/front/subscription/",
  require("./route/frontRoute/subscription_RF")
);
app.use(
  "/v" + process.env.VERSION + "/admin/subscription/",
  require("./route/adminRoute/subscription_RA")
);

app.use(
  "/v" + process.env.VERSION + "/front/subscriptionCheckout/",
  require("./route/frontRoute/subscriptionCheckOut_RF")
);

app.use(
  "/v" + process.env.VERSION + "/front/productcheckout/",
  require("./route/frontRoute/productCheckout_RF")
);

app.use(
  "/v" + process.env.VERSION + "/front/productorder/",
  require("./route/frontRoute/ProductOrder_RF")
);
app.use(
  "/v" + process.env.VERSION + "/admin/productorder/",
  require("./route/adminRoute/ProductOrder_RA")
);

app.use(
  "/v" + process.env.VERSION + "/admin/adminauth/",
  require("./route/adminRoute/admin_RA")
);

app.use(
  "/v" + process.env.VERSION + "/admin/truckbrand/",
  require("./route/adminRoute/TruckBrand_RA")
);
app.use(
  "/v" + process.env.VERSION + "/front/truckbrand/",
  require("./route/frontRoute/TruckBrand_RF")
);
app.use(
  "/v" + process.env.VERSION + "/admin/truckmodel/",
  require("./route/adminRoute/TruckModel_RA")
);
app.use(
  "/v" + process.env.VERSION + "/front/truckmodel/",
  require("./route/frontRoute/TruckModel_RF")
);
app.use(
  "/v" + process.env.VERSION + "/admin/truckdetail/",
  require("./route/adminRoute/TruckDetails_RA")
);
app.use(
  "/v" + process.env.VERSION + "/front/truckdetail/",
  require("./route/frontRoute/TruckDetails_RF")
);
app.use(
  "/v" + process.env.VERSION + "/admin/bikebrand/",
  require("./route/adminRoute/BikeBrand_RA")
);
app.use(
  "/v" + process.env.VERSION + "/front/bikebrand/",
  require("./route/frontRoute/BikeBrand_RF")
);
app.use(
  "/v" + process.env.VERSION + "/admin/bikemodel/",
  require("./route/adminRoute/BikeModel_RA")
);
app.use(
  "/v" + process.env.VERSION + "/front/bikemodel/",
  require("./route/frontRoute/BikeModel_RF")
);

app.use(
  "/v" + process.env.VERSION + "/admin/notification/",
  require("./route/adminRoute/notification_RA")
);

app.use(
  "/v" + process.env.VERSION + "/admin/bikedriver/",
  require("./route/adminRoute/BikeDriverDetails_RA")
);

app.use(
  "/v" + process.env.VERSION + "/front/bikedriver/",
  require("./route/frontRoute/BikeDriverDetails_RF")
);

app.use(
  "/v" + process.env.VERSION + "/admin/truckdriver/",
  require("./route/adminRoute/TruckDriverDetails_RA")
);
app.use(
  "/v" + process.env.VERSION + "/front/truckdriver/",
  require("./route/frontRoute/TruckDriverDetails_RF")
);
app.use(
  "/v" + process.env.VERSION + "/admin/assigntruckfordriver/",
  require("./route/adminRoute/AssignTruckForDriver_RA")
);

app.use(
  "/v" + process.env.VERSION + "/front/useraddress/",
  require("./route/frontRoute/UserAddress_RF")
);
app.use(
  "/v" + process.env.VERSION + "/admin/deliveryaddress/",
  require("./route/adminRoute/deliveryLocation_RA")
);
app.use(
  "/v" + process.env.VERSION + "/front/deliveryaddress/",
  require("./route/frontRoute/deliveryLocation_RF")
);
app.use(
  "/v" + process.env.VERSION + "/admin/deliveryzone/",
  require("./route/adminRoute/deliveryZone_RA")
);
app.use(
  "/v" + process.env.VERSION + "/truckdriver/deliveryzone/",
  require("./route/frontRoute/deliveryZone_RF")
);

app.use(
  "/v" + process.env.VERSION + "/admin/assignzoneforassigntruck/",
  require("./route/adminRoute/AssignZoneForAssignTruck_RA")
);
app.use(
  "/v" + process.env.VERSION + "/front/assigntruck/assignzoneforassigntruck/",
  require("./route/truckDriverRoute/AssignZoneForAssignTruck_TD")
);
app.use(
  "/v" + process.env.VERSION + "/admin/assignuseraddressforbikedriver/",
  require("./route/adminRoute/addAssignUserAddressForBikeDriver_RA")
);
app.use(
  "/v" + process.env.VERSION + "/front/truckdriver/assigntruckfordriver/",
  require("./route/truckDriverRoute/AssignTruckForDriver_TD")
);

app.use(
  "/v" + process.env.VERSION + "/front/cart/",
  require("./route/frontRoute/cart_RF")
);
app.use(
  "/v" + process.env.VERSION + "/admin/cart/",
  require("./route/adminRoute/cart_RA")
);
app.use(
  "/v" + process.env.VERSION + "/front/payment/",
  require("./route/frontRoute/paymentGateway_RF")
);

app.all("*", (req, res, next) => {
  const err = new customError(
    `can't find this(${req.originalUrl}) URL on server`,
    404
  );
  next(err);
});

app.use(globalError);

module.exports = app;
