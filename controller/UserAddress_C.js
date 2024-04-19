var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const common = require("../service/commonFunction");
const UserAddressModel = mongoose.model(constants.UserAddressModel);
var customError = require("../middleware/customerror");
const NodeGeocoder = require("node-geocoder");
const DeliveryLocationModel = mongoose.model(constants.DeliveryLocationModel);
const ObjectId = mongoose.Types.ObjectId;

const options = {
  provider: "google",

  // Optional depending on the providers
  // fetch: customFetchImplementation,
  apiKey: process.env.GOOGLEAPIKEY, // for Mapquest, OpenCage, Google Premier
  formatter: null, // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);

module.exports = {
  googlemap: async (req, res, next) => {
    // 25.122962889246118, 55.420197803529156
    const data = await geocoder.reverse({
      lat: req.query.lat,
      lon: req.query.lon,
    });
    // return res.status(200).json( data );
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.addAddressSucess,
      data: data,
    });
    // if (data) {
    //   const data1 = await geocoder.geocode("Academic City");
    //   return res.status(200).json({ data, data1 });
    // }
  },

  addAddress: async (req, res, next) => {
    var matchedLocation = await common.deliveryRange(req.body.location);
    console.log(matchedLocation,"........matchedLocation");

    if (matchedLocation === false) {
      const err = new customError(
        global.CONFIGS.api.deliveryRangeNotFound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    const deliveryLocation = await DeliveryLocationModel.findOne(
    {location:req.body.location},
    );
    console.log(deliveryLocation,".....deliveryLocation")
    console.log(deliveryLocation._id,".....deliveryLocationId")

    var find_address = await UserAddressModel.findOne({
      userId: req.body.userId,
    });
    if (find_address) {
      const err = new customError(
        global.CONFIGS.api.addressalreadyadded,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    req.body.deliveryLocationId = deliveryLocation._id;
    req.body.location = {
      type: "Point",
      coordinates: [req.body.long, req.body.lat],
    };
    var createAddress = await UserAddressModel.create(req.body);
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.addAddressSucess,
      data: createAddress,
    });
  },

  updateAddress: async (req, res, next) => {
    var find_address = await UserAddressModel.findOne({ _id: req.params.id });
    if (!find_address) {
      const err = new customError(
        global.CONFIGS.api.addressNotFound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    var matchedLocation = await common.deliveryRange(req.body.location);
    if (matchedLocation === false) {
      const err = new customError(
        global.CONFIGS.api.deliveryRangeNotFound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
     const deliveryLocation = await DeliveryLocationModel.findOne(
    {location:req.body.location},
    );
    console.log(deliveryLocation,".....deliveryLocation");
    console.log(deliveryLocation._id,".....deliveryLocationId");
    req.body.deliveryLocationId = deliveryLocation._id;
    
    req.body.location = {
      type: "Point",
      coordinates: [req.body.long, req.body.lat],
    };
    

    const updateAddress = await UserAddressModel.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      {new:true}
    );
    // Academic City 65defa05d8757e41baaa0752
    // Al Badda 65defa13d8757e41baaa0755
    // Al Barsha 65defa30d8757e41baaa075e
    // Al Barari 65defa2ad8757e41baaa075b
    // Abu Hail 65def9ebd8757e41baaa074f
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.updateAddressSucess,
      data: updateAddress,
    });
  },
  getAddress: async (req, res, next) => {
    // console.log(req.body);
    var find_user = await UserAddressModel.aggregate([
      {
        $match: { activeStatus: "1", userId: new ObjectId(req.query.userId) },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "users",
        },
      },
      { $unwind: "$users" },
      { $unset: "userId" },
      {
        $project: {
          _id: "$_id",
          houseNo: "$houseNo",
          buildingName: "$buildingName",
          address: "$address",
          city: "$city",
          landmark: "$landmark",
          country: "$country",
          activeStatus: "$activeStatus",
          location: "$location",
          lat: "$lat",
          long: "$long",
          name: "$users.name",
          mobile: "$users.mobile",
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ]);
    // return res.send(find_user)
    if (find_user.length == 0) {
      const err = new customError(
        global.CONFIGS.api.getAddressDetailsFail,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    // var totalPage = Math.ceil(parseInt(find_user[0].metadata[0].total) / limit);
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.getAddressDetailsSuccess,
      // totalPage: totalPage,
      data: find_user,
    });
  },
  deleteaddress: async (req, res, next) => {
    var find_address = await UserAddressModel.findOne({ _id: req.params.id });
    if (!find_address) {
      const err = new customError(
        global.CONFIGS.api.addressNotFound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    var createAddress = await UserAddressModel.deleteOne({
      _id: req.params.id,
    });
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.deleteAddressSucess,
      // data: createAddress,
    });
  },
};
