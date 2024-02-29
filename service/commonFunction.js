const moment = require("moment");
var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const DeliveryLocationModel = mongoose.model(constants.DeliveryLocationModel);

const randomNumber = () => {
  const randomNumber = Math.floor(100000 + Math.random() * 900000);
  return randomNumber;
};

const datediff = (date) => {
  var oldDate = moment(date);
  console.log(oldDate);
  var newDate = moment(new Date());
  console.log(newDate);
  var minutes = parseInt(
    moment.duration(newDate.diff(oldDate)).asMinutes() + 1
  );
  return minutes;
};


const deliveryRange = async (key) => {
  const deliveryLocation = await DeliveryLocationModel.find({},{location:1});
//   console.log(deliveryLocation,"....normal")
  const filterlocation = deliveryLocation.some((item) => item.location === key);
  return filterlocation;
// console.log(filterlocation,"......filter")
};
// deliveryRange();

module.exports = {
  randomNumber,
  datediff,
  deliveryRange,
};
