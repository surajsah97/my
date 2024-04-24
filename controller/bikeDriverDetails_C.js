let mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const BikeModel = mongoose.model(constants.BikeModel);
const BikeDriverModel = mongoose.model(constants.BikeDriverModel);
const common = require("../service/commonFunction");
let customError = require("../middleware/customerror");
const DriverDocModel = mongoose.model(constants.DriverDocModel);
const DriverAddressModel = mongoose.model(constants.DriverAddressModel);
const DriverBankDetailsModel = mongoose.model(constants.DriverBankDetailsModel);
const DeliveryZoneModel = mongoose.model(constants.DeliveryZoneModel);
const ObjectId = mongoose.Types.ObjectId;
const validationSchema = require("../validation/bikeDetailsValidation");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports = {
  loginBikeDriver: async (req, res, next) => {
    var find_driver = await BikeDriverModel.findOne({
      mobile: req.body.mobile,
    });
    if (!find_driver) {
      const err = new customError(
        global.CONFIGS.api.userNotFound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }

    const match = await bcrypt.compare(req.body.password, find_driver.password);
    if (!match) {
      const err = new customError(
        global.CONFIGS.api.loginFail,
        global.CONFIGS.responseCode.Unauthorized
      );
      return next(err);
    }
    const payload = { mobile: find_driver.mobile, _id: find_driver._id };
    const options = {
      expiresIn: global.CONFIGS.token.apiTokenExpiry,
      issuer: "Dudhu",
    };
    const secret = process.env.SECRETKEY;
    const token = await jwt.sign(payload, secret, options);
    // console.log(token);
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.loginSuccess,
      data: {
        driverId: find_driver._id,
        name: find_driver.name,
        email: find_driver.email,
        mobile: find_driver.mobile,
        driverType: find_driver.driverType,
        activeStatus: find_driver.activeStatus,
        token: token,
      },
    });
  },

  reSendOtp: async (req, res, next) => {
    var find_driver = await BikeDriverModel.findOne({
      mobile: req.body.mobile,
    });
    if (!find_driver) {
      const err = new customError(
        global.CONFIGS.api.userNotFound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    var otp = common.randomNumber();
    var update_driver = await BikeDriverModel.updateOne(
      { _id: find_driver._id },
      {
        Otp: otp,
        OtpsendDate: new Date(),
      }
    );
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.sendOtpSuccess,
      data: {
        Otp: otp,
      },
    });
  },

  forgetPassword: async (req, res, next) => {
    var find_driver = await BikeDriverModel.findOne({
      mobile: req.body.mobile,
    });
    if (!find_driver) {
      const err = new customError(
        global.CONFIGS.api.userNotFound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    var otp = common.randomNumber();
    var update_driver = await BikeDriverModel.updateOne(
      { _id: find_driver._id },
      {
        Otp: otp,
        OtpsendDate: new Date(),
      }
    );
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.sendOtpSuccess,
      data: {
        Otp: otp,
      },
    });
  },

  resetPassword: async (req, res, next) => {
    var find_driver = await BikeDriverModel.findOne({
      mobile: req.body.mobile,
    });
    if (!find_driver) {
      const err = new customError(
        global.CONFIGS.api.userNotFound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    if (find_driver.Otp != req.body.Otp) {
      const err = new customError(
        global.CONFIGS.api.verifyOtpFail,
        global.CONFIGS.responseCode.Unauthorized
      );
      return next(err);
    }
    var timediff = common.datediff(find_driver.OtpsendDate);
    console.log("timediff= ", timediff);
    if (timediff > global.CONFIGS.OtpTimeLimit.limit) {
      const err = new customError(
        global.CONFIGS.api.verifyOtpexp,
        global.CONFIGS.responseCode.Unauthorized
      );
      return next(err);
    }

    const salt = await bcrypt.genSaltSync(global.CONFIGS.pass.saltround);
    const hash = await bcrypt.hashSync(req.body.password, salt);
    var update_driver = await BikeDriverModel.findByIdAndUpdate(
      { _id: find_driver._id },
      { password: hash },
      { new: true }
    );

    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.changePasswordSuccess,
      data: update_driver,
    });
  },

  changePassword: async (req, res, next) => {
    var find_driver = await BikeDriverModel.findOne({
      mobile: req.body.mobile,
    });
    if (!find_driver) {
      const err = new customError(
        global.CONFIGS.api.userNotFound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    const match = await bcrypt.compare(
      req.body.oldPassword,
      find_driver.password
    );
    if (!match) {
      const err = new customError(
        global.CONFIGS.api.matchPasswordFail,
        global.CONFIGS.responseCode.Unauthorized
      );
      return next(err);
    }
    const salt = await bcrypt.genSaltSync(global.CONFIGS.pass.saltround);
    const hash = await bcrypt.hashSync(req.body.newPassword, salt);
    var update_driver = await BikeDriverModel.findByIdAndUpdate(
      { _id: find_driver._id },
      { password: hash },
      { new: true }
    );

    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.changePasswordSuccess,
      data: update_driver,
    });
  },

  /** */
  addVehicle: async (req, res, next) => {
    let find_Driver = await BikeDriverModel.findOne({
      $or: [
        { mobile: req.body.mobile },
        { licenseNumber: req.body.licenseNumber },
        { visaNumber: req.body.visaNumber },
        { emiratesId: req.body.emiratesId },
      ],
    });
    let find_vehicle = await BikeModel.findOne({
      chasisNumber: req.body.chasisNumber,
    });
    if (find_vehicle || find_Driver) {
      const err = new customError(
        global.CONFIGS.api.Driveralreadyadded,
        global.CONFIGS.responseCode.alreadyExist
      );
      return next(err);
    }

    const validationResult = validationSchema.validate(req.body);
    if (validationResult.error) {
      const err = new customError(
        validationResult.error.message,
        global.CONFIGS.responseCode.validationError
      );
      return next(err);
    }

    const fileFields = [
      "mulkiyaImgFront",
      "mulkiyaImgBack",
      "vehicleImgFront",
      "vehicleImgBack",
      "vehicleImgLeft",
      "vehicleImgRight",
      "passportImgFront",
      "passportImgBack",
      "emiratesIdImgFront",
      "emiratesIdImgBack",
      "licenseImgFront",
      "licenseImgBack",
      "visaImg",
      "driverImg",
    ];
    for (const field of fileFields) {
      if (!req.files[field]) {
        const err = new customError(
          `File upload for field '${field}' is missing.`,
          global.CONFIGS.responseCode.validationError
        );
        return next(err);
      }
    }

    let mulkiyaDocImg = {};
    let vehicleImage = {};
    let passportImg = {};
    let emiratesIdImg = {};
    let licenseImg = {};

    if (req.files.mulkiyaImgFront && req.files.mulkiyaImgBack) {
      mulkiyaDocImg.frontImg = `uploads/bike/${req.files.mulkiyaImgFront[0].filename}`;
      mulkiyaDocImg.backImg = `uploads/bike/${req.files.mulkiyaImgBack[0].filename}`;
      req.body.mulkiyaDocImg = mulkiyaDocImg;
    }

    if (
      req.files.vehicleImgFront &&
      req.files.vehicleImgBack &&
      req.files.vehicleImgLeft &&
      req.files.vehicleImgRight
    ) {
      vehicleImage.frontImage = `uploads/bike/${req.files.vehicleImgFront[0].filename}`;
      vehicleImage.backImage = `uploads/bike/${req.files.vehicleImgBack[0].filename}`;
      vehicleImage.leftImage = `uploads/bike/${req.files.vehicleImgLeft[0].filename}`;
      vehicleImage.rightImage = `uploads/bike/${req.files.vehicleImgRight[0].filename}`;
      req.body.vehicleImage = vehicleImage;
    }

    if (req.files.passportImgFront && req.files.passportImgBack) {
      passportImg.frontImg = `uploads/bike/${req.files.passportImgFront[0].filename}`;
      passportImg.backImg = `uploads/bike/${req.files.passportImgBack[0].filename}`;
      req.body.passportImg = passportImg;
    }

    if (req.files.emiratesIdImgFront && req.files.emiratesIdImgBack) {
      emiratesIdImg.frontImg = `uploads/bike/${req.files.emiratesIdImgFront[0].filename}`;
      emiratesIdImg.backImg = `uploads/bike/${req.files.emiratesIdImgBack[0].filename}`;
      req.body.emiratesIdImg = emiratesIdImg;
    }

    if (req.files.licenseImgFront && req.files.licenseImgBack) {
      licenseImg.frontImg = `uploads/bike/${req.files.licenseImgFront[0].filename}`;
      licenseImg.backImg = `uploads/bike/${req.files.licenseImgBack[0].filename}`;
      req.body.licenseImg = licenseImg;
    }

    if (req.files.visaImg) {
      req.body.visaImg = `uploads/bike/${req.files.visaImg[0].filename}`;
    }

    if (req.files.driverImg) {
      req.body.driverImg = `uploads/bike/${req.files.driverImg[0].filename}`;
    }

    /** */
    // req.body.location = {
    //   type: "Point",
    //   coordinates: [req.body.lat, req.body.long],
    // };
    /** */
    // Hash password using bcrypt
    const salt = await bcrypt.genSaltSync(global.CONFIGS.pass.saltround);
    const hash = await bcrypt.hashSync(req.body.password, salt);
    req.body.password = hash;

    let bikeDRiverDetails = {};
    bikeDRiverDetails.name = req.body.name;
    bikeDRiverDetails.email = req.body.email;
    bikeDRiverDetails.password = req.body.password;
    bikeDRiverDetails.mobile = req.body.mobile;
    bikeDRiverDetails.altMobile = req.body.altMobile;
    bikeDRiverDetails.nationality = req.body.nationality;
    bikeDRiverDetails.passportNumber = req.body.passportNumber;
    bikeDRiverDetails.passportValidity = req.body.passportValidity;
    bikeDRiverDetails.visaNumber = req.body.visaNumber;
    bikeDRiverDetails.visaValidity = req.body.visaValidity;
    bikeDRiverDetails.emiratesId = req.body.emiratesId;
    bikeDRiverDetails.emiratesIdValidity = req.body.emiratesIdValidity;
    bikeDRiverDetails.InsuranceComp = req.body.InsuranceComp;
    bikeDRiverDetails.insuranceValidity = req.body.insuranceValidity;
    bikeDRiverDetails.licenseNumber = req.body.licenseNumber;
    bikeDRiverDetails.licenseCity = req.body.licenseCity;
    bikeDRiverDetails.licenseType = req.body.licenseType;
    bikeDRiverDetails.licenseValidity = req.body.licenseValidity;
    bikeDRiverDetails.docId = req.body.docId;
    bikeDRiverDetails.bikeDetailsId = req.body.bikeDetailsId;
    bikeDRiverDetails.addressId = req.body.addressId;
    bikeDRiverDetails.deliveryZoneId = req.body.deliveryZoneId;
    bikeDRiverDetails.bankDetailsId = req.body.bankDetailsId;
    bikeDRiverDetails.docId = req.body.docId;
    bikeDRiverDetails.isVerified = req.body.isVerified;
    bikeDRiverDetails.driverType = req.body.driverType;
    // bikeDRiverDetails.location = req.body.location;
    // bikeDRiverDetails.lat = req.body.lat;
    // bikeDRiverDetails.long = req.body.long;
    bikeDRiverDetails.activeStatus = req.body.activeStatus;
    const createDriver = await BikeDriverModel.create(bikeDRiverDetails);

    if (!createDriver) {
      const err = new customError(
        global.CONFIGS.api.DriverNotAdded,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    let bikeDetails = {};
    bikeDetails.brandId = req.body.brandId;
    bikeDetails.modelId = req.body.modelId;
    bikeDetails.ownerName = req.body.ownerName;
    bikeDetails.vehicleNumber = req.body.vehicleNumber;
    bikeDetails.registrationZone = req.body.registrationZone;
    bikeDetails.vehicleColor = req.body.vehicleColor;
    bikeDetails.registrationDate = req.body.registrationDate;
    bikeDetails.vehicleYear = req.body.vehicleYear;
    bikeDetails.fuelType = req.body.fuelType;
    bikeDetails.vehicleAge = req.body.vehicleAge;
    bikeDetails.chasisNumber = req.body.chasisNumber;
    bikeDetails.bikeInsuranceValidity = req.body.bikeInsuranceValidity;
    bikeDetails.fitnessValidity = req.body.fitnessValidity;
    bikeDetails.mulkiyaValidity = req.body.mulkiyaValidity;
    bikeDetails.activeStatus = req.body.activeStatus;
    bikeDetails.mulkiyaDocImg = mulkiyaDocImg;
    bikeDetails.vehicleImage = vehicleImage;
    const createVehicle = await BikeModel.create(bikeDetails);
    if (!createVehicle) {
      const err = new customError(
        global.CONFIGS.api.vehicleNotAdded,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }

    const createAddress = await DriverAddressModel.create({
      emergencyContact: {
        name: req.body.ecName,
        relation: req.body.ecRelation,
        mobile: req.body.ecMobile,
      },
      homeCountryAddress: {
        houseNo: req.body.hcHouseNo,
        buildingName: req.body.hcBuildingName,
        street: req.body.hcStreet,
        landmark: req.body.hcLandmark,
        city: req.body.hcCity,
        state: req.body.hcState,
        pinCode: req.body.hcPinCode,
      },
      localAddress: {
        houseNo: req.body.lHouseNo,
        buildingName: req.body.lBuildingName,
        street: req.body.lStreet,
        landmark: req.body.lLandmark,
      },

      activeStatus:req.body.activeStatus,
      // location:req.body.location,
      // lat:req.body.lat,
      // long:req.body.long,
      driverId: createDriver._id, // Use _id from createDriver
    });

    if (!createAddress) {
      const err = new customError(
        global.CONFIGS.api.AddressNotAdded,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    console.log("..........111111111");
    const createDoc = await DriverDocModel.create({
      passportImg: passportImg,
      emiratesIdImg: emiratesIdImg,
      licenseImg: licenseImg,
      visaImg: req.body.visaImg,
      driverImg: req.body.driverImg,
      activeStatus: req.body.activeStatus,
      driverId: createDriver._id,
    });
    console.log("..........2222222222");
    if (!createDoc) {
      const err = new customError(
        global.CONFIGS.api.DocNotAdded,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }

    const createBankDetails = await DriverBankDetailsModel.create({
      driverId: createDriver._id, // Use _id from createDriver
      IBAN: req.body.IBAN,
      accountHolderName: req.body.accountHolderName,
      accountNumber: req.body.accountNumber,
      branchName: req.body.branchName,
      bankName: req.body.bankName,
      activeStatus: req.body.activeStatus,
    });
    console.log("..........33333333");

    if (!createBankDetails) {
      const err = new customError(
        global.CONFIGS.api.BankDetailsNotAdded,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    if (createVehicle && createAddress && createBankDetails && createDoc) {
      const updateDriver = await BikeDriverModel.findByIdAndUpdate(
        { _id: createDriver._id },
        {
          bikeDetailsId: createVehicle._id,
          addressId: createAddress._id,
          bankDetailsId: createBankDetails._id,
          docId: createDoc._id,
        },
        { new: true }
      );
      return res.status(global.CONFIGS.responseCode.success).json({
        success: true,
        message: global.CONFIGS.api.DriverDetailsAdded,
        bikeDriver: updateDriver,
      });
    }
  },
  /** */
  updateVehicle: async (req, res, next) => {
    try {
      /**Update BikeDriver */
      let find_Driver = await BikeDriverModel.findOne({
        _id: req.params.id,
      });
      if (!find_Driver) {
        const err = new customError(
          global.CONFIGS.api.DriverNotfound,
          global.CONFIGS.responseCode.notFound
        );
        return next(err);
      }
      console.log(find_Driver, "......find_Driver");

      let find_BankDetails = await DriverBankDetailsModel.findOne({
        _id: find_Driver.bankDetailsId,
      });
      if (!find_BankDetails) {
        const err = new customError(
          global.CONFIGS.api.driverBankDetailsNotfound,
          global.CONFIGS.responseCode.notFound
        );
        return next(err);
      }
      console.log(find_BankDetails, "......find_BankDetails");

      let find_address = await DriverAddressModel.findOne({
        _id: find_Driver.addressId,
      });
      if (!find_address) {
        const err = new customError(
          global.CONFIGS.api.driverAddressNotfound,
          global.CONFIGS.responseCode.notFound
        );
        return next(err);
      }
      console.log(find_address, "......find_address");

      let find_vehicle = await BikeModel.findOne({
        _id: find_Driver.bikeDetailsId,
      });
      if (!find_vehicle) {
        const err = new customError(
          global.CONFIGS.api.BikeDetailsNotfound,
          global.CONFIGS.responseCode.notFound
        );
        return next(err);
      }
      console.log(find_vehicle, "......find_vehicle");

      let find_driverdoc = await DriverDocModel.findOne({
        _id: find_Driver.docId,
      });
      if (!find_driverdoc) {
        const err = new customError(
          global.CONFIGS.api.DriverDocNotfound,
          global.CONFIGS.responseCode.notFound
        );
        return next(err);
      }
      console.log(find_driverdoc, "......find_driverdoc");

      let find_Exist_Driver = await BikeDriverModel.findOne({
        $or: [
          { mobile: req.body.mobile },
          { licenseNumber: req.body.licenseNumber },
          { visaNumber: req.body.visaNumber },
          { emiratesId: req.body.emiratesId },
        ],
        _id: { $nin: [req.params.id] },
      });
      console.log(find_Exist_Driver, "......find_Exist_Driver");

      if (find_Exist_Driver) {
        const err = new customError(
          global.CONFIGS.api.Driveralreadyadded,
          global.CONFIGS.responseCode.alreadyExist
        );
        return next(err);
      }

      let findExistVehicle = await BikeModel.findOne({
        chasisNumber: req.body.chasisNumber,
        _id: { $nin: [find_Driver.bikeDetailsId] },
      });
      if (findExistVehicle) {
        const err = new customError(
          global.CONFIGS.api.BikeDetailsalreadyAdded,
          global.CONFIGS.responseCode.alreadyExist
        );
        return next(err);
      }
      const updatedDriver = await BikeDriverModel.findByIdAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true }
      );
      if (!updatedDriver) {
        const err = new customError(
          global.CONFIGS.api.DriverNotfound,
          global.CONFIGS.responseCode.notFound
        );
        return next(err);
      }
      console.log(updatedDriver, "......updatedDriver");

      /*  Update Bank Details*/
      const updatedBankDetails = await DriverBankDetailsModel.findByIdAndUpdate(
        { _id: updatedDriver.bankDetailsId },
        req.body,
        { new: true }
      );
      if (!updatedBankDetails) {
        const err = new customError(
          global.CONFIGS.api.driverBankDetailsNotfound,
          global.CONFIGS.responseCode.notFound
        );
        return next(err);
      }

      /* Update Driver Documents*/
      const updatedDriverDoc = await DriverDocModel.findByIdAndUpdate(
        { _id: updatedDriver.docId },
        {
          $set: {
            passportImg: req.body.passportImg,
            emiratesIdImg: req.body.emiratesIdImg,
            licenseImg: req.body.licenseImg,
            visaImg: req.body.visaImg,
            driverImg: req.body.driverImg,
          },
        },
        { new: true }
      );
      if (!updatedDriverDoc) {
        const err = new customError(
          global.CONFIGS.api.DriverDocNotfound,
          global.CONFIGS.responseCode.notFound
        );
        return next(err);
      }
      /* Update Driver Address*/
      const updateDriverAddress = await DriverAddressModel.findByIdAndUpdate(
        { _id: updatedDriver.addressId },
        {
          $set: {
            emergencyContact: {
              name: req.body.ecName,
              relation: req.body.ecRelation,
              mobile: req.body.ecMobile,
            },
            homeCountryAddress: {
              houseNo: req.body.hcHouseNo,
              buildingName: req.body.hcBuildingName,
              street: req.body.hcStreet,
              landmark: req.body.hcLandmark,
              city: req.body.hcCity,
              state: req.body.hcState,
              pinCode: req.body.hcPinCode,
            },
            localAddress: {
              houseNo: req.body.lHouseNo,
              buildingName: req.body.lBuildingName,
              street: req.body.lStreet,
              landmark: req.body.lLandmark,
            },
          },
        },
        { new: true }
      );
      if (!updateDriverAddress) {
        const err = new customError(
          global.CONFIGS.api.driverAddressNotfound,
          global.CONFIGS.responseCode.notFound
        );
        return next(err);
      }
      /* Update Bike Details*/
      const updateBikeDetails = await BikeModel.findByIdAndUpdate(
        { _id: updatedDriver.bikeDetailsId },
        {
          $set: {
            brandId: req.body.brandId,
            modelId: req.body.modelId,
            ownerName: req.body.ownerName,
            vehicleNumber: req.body.vehicleNumber,
            registrationZone: req.body.registrationZone,
            registrationDate: req.body.registrationDate,
            vehicleColor: req.body.vehicleColor,
            vehicleYear: req.body.vehicleYear,
            vehicleAge: req.body.vehicleAge,
            chasisNumber: req.body.chasisNumber,
            bikeInsuranceValidity: req.body.bikeInsuranceValidity,
            fitnessValidity: req.body.fitnessValidity,
            mulkiyaValidity: req.body.mulkiyaValidity,
            mulkiyaDocImg: req.body.mulkiyaDocImg,
            vehicleImage: req.body.vehicleImage,
          },
        },
        { new: true }
      );
      if (!updateBikeDetails) {
        const err = new customError(
          global.CONFIGS.api.BikeDetailsNotfound,
          global.CONFIGS.responseCode.notFound
        );
        return next(err);
      }
      if (
        updateDriverAddress &&
        updatedBankDetails &&
        updatedDriverDoc &&
        updateBikeDetails
      ) {
        return res.status(global.CONFIGS.responseCode.success).json({
          success: true,
          message: global.CONFIGS.api.DriverDetailsUpdated,
        });
      } else {
        throw new Error("Failed to update driver");
      }
    } catch (error) {
      // Handle errors
      return next(error);
    }
  },
  updateBikeDriverLocation: async (req, res, next) => {
    let find_Driver = await BikeDriverModel.findById(req.params.id);
    if (!find_Driver) {
      const err = new customError(
        global.CONFIGS.api.DriverNotfound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    console.log(find_Driver, "......find_Driver");
    req.body.location = {
      type: "Point",
      coordinates: [req.body.lat, req.body.long],
    };
    find_Driver = await BikeDriverModel.findByIdAndUpdate(
      { _id: req.params.id },
      {
        lat: req.body.lat,
        long: req.body.long,
        location: req.body.location,
      },
      { new: true }
    );

    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.DriverDetailsUpdated,
      updateDriverLocation: find_Driver,
    });
  },

  /** */
  deletevehicle: async (req, res, next) => {
    /* Delete BikeDriver*/
    const deletedDriver = await BikeDriverModel.findByIdAndDelete({
      _id: req.params.id,
    });

    if (!deletedDriver) {
      const err = new customError(
        global.CONFIGS.api.DriverNotfound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }

    console.log(deletedDriver, "delelted driver....");

    /* Delete Bike Details*/
    const deletedBikeDetails = await BikeModel.findByIdAndDelete(
      deletedDriver.bikeDetailsId
    );

    if (!deletedBikeDetails) {
      const err = new customError(
        global.CONFIGS.api.BikeDetailsNotfound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }

    /* Delete Driver Address*/
    const deletedDriverAddress = await DriverAddressModel.findByIdAndDelete(
      deletedDriver.addressId
    );
    if (!deletedDriverAddress) {
      const err = new customError(
        global.CONFIGS.api.driverAddressNotfound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }

    /* Delete Driver Documents*/
    const deletedDriverDoc = await DriverDocModel.findByIdAndDelete(
      deletedDriver.docId
    );
    if (!deletedDriverDoc) {
      const err = new customError(
        global.CONFIGS.api.DriverDocNotfound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }

    /* Delete Bank Details*/
    const deletedBankDetails = await DriverBankDetailsModel.findByIdAndDelete(
      deletedDriver.bankDetailsId
    );

    if (!deletedBankDetails) {
      const err = new customError(
        global.CONFIGS.api.driverBankDetailsNotfound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }

    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.DriverDetailsDeleted,
    });
  },

  /** */

  /**get single vehicleDetails by user */

  getVehicleSingleFront: async (req, res, next) => {
    // console.log(req.body);
    let find_user = await BikeDriverModel.aggregate([
      {
        $match: { activeStatus: "1", _id: new ObjectId(req.query.id) },
      },
      /**driverbankdetails */
      {
        $lookup: {
          from: "driverbankdetails",
          localField: "bankDetailsId",
          foreignField: "_id",
          as: "driverbankdetails",
        },
      },
      { $unwind: "$driverbankdetails" },
      { $unset: "bankDetailsId" },
      /**bikedetails */
      {
        $lookup: {
          from: "bikedetails",
          localField: "bikeDetailsId",
          foreignField: "_id",
          as: "bikedetails",
        },
      },
      { $unwind: "$bikedetails" },
      { $unset: "bikeDetailsId" },
      { $unset: "bikedetails.mulkiyaDocImg._id" },
      { $unset: "bikedetails.vehicleImage._id" },

      /**fetch bikeMrand into bikedetails */

      {
        $lookup: {
          from: "bikebrand",
          localField: "bikedetails.brandId",
          foreignField: "_id",
          as: "bikebrandName",
        },
      },
      { $unwind: "$bikebrandName" },
      { $unset: "bikedetails.brandId" },

      /**fetch bikeModel into bikedetails */
      /**bikemodel */
      {
        $lookup: {
          from: "bikemodel",
          localField: "bikedetails.modelId",
          foreignField: "_id",
          as: "bikemodelName",
        },
      },
      { $unwind: "$bikemodelName" },
      { $unset: "bikedetails.modelId" },
      /**driveraddress */

      {
        $lookup: {
          from: "driveraddress",
          localField: "addressId",
          foreignField: "_id",
          as: "driveraddress",
        },
      },
      { $unwind: "$driveraddress" },
      { $unset: "addressId" },
      { $unset: "driveraddress.localAddress._id" },
      { $unset: "driveraddress.homeCountryAddress._id" },
      { $unset: "driveraddress.emergencyContact._id" },
      /**driverdoc */
      {
        $lookup: {
          from: "driverdoc",
          localField: "docId",
          foreignField: "_id",
          as: "driverdoc",
        },
      },
      { $unwind: "$driverdoc" },
      { $unset: "docId" },
      { $unset: "driverdoc.passportImg._id" },
      { $unset: "driverdoc.emiratesIdImg._id" },
      { $unset: "driverdoc.licenseImg._id" },
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $project: {
          _id: "$_id",
          /**bikedriverdetails */
          name: "$name",
          email: "$email",
          mobile: "$mobile",
          nationality: "$nationality",
          altMobile: "$altMobile",
          passportNumber: "$passportNumber",
          passwordassportValidity: "$passwordassportValidity",
          visaNumber: "$visaNumber",
          visaValidity: "$visaValidity",
          emiratesId: "$emiratesId",
          emiratesIdValidity: "$emiratesIdValidity",
          InsuranceComp: "$InsuranceComp",
          insuranceValidity: "$insuranceValidity",
          password: "$password",
          licenseNumber: "$licenseNumber",
          licenseCity: "$licenseCity",
          licenseType: "$licenseType",
          licenseValidity: "$licenseValidity",
          isVerified: "$isVerified",
          driverType: "$driverType",
          activeStatus: "$activeStatus",
          /**driveraddress */
          localAddress: "$driveraddress.localAddress",
          homeCountryAddress: "$driveraddress.homeCountryAddress",
          emergencyContact: "$driveraddress.emergencyContact",
          /**driverbankdetails */
          bankName: "$driverbankdetails.bankName",
          branchName: "$driverbankdetails.branchName",
          accountNumber: "$driverbankdetails.accountNumber",
          accountHolderName: "$driverbankdetails.accountHolderName",
          IBAN: "$driverbankdetails.IBAN",
          /**driverdoc */
          passportImg: "$driverdoc.passportImg",
          emiratesIdImg: "$driverdoc.emiratesIdImg",
          licenseImg: "$driverdoc.licenseImg",
          visaImg: "$driverdoc.visaImg",
          driverImg: "$driverdoc.driverImg",
          /**bikedetails */
          ownerName: "$bikedetails.ownerName",
          vehicleNumber: "$bikedetails.vehicleNumber",
          registrationZone: "$bikedetails.registrationZone",
          registrationDate: "$bikedetails.registrationDate",
          vehicleColor: "$bikedetails.vehicleColor",
          vehicleYear: "$bikedetails.vehicleYear",
          vehicleAge: "$bikedetails.vehicleAge",
          chasisNumber: "$bikedetails.chasisNumber",
          bikeInsuranceValidity: "$bikedetails.bikeInsuranceValidity",
          fitnessValidity: "$bikedetails.fitnessValidity",
          mulkiyaValidity: "$bikedetails.mulkiyaValidity",
          mulkiyaDocImg: "$bikedetails.mulkiyaDocImg",
          vehicleImage: "$bikedetails.vehicleImage",
          bikeActiveStatus: "$bikedetails.activeStatus",
          bikeBrand: "$bikebrandName.bikeBrand",
          bikeModel: "$bikemodelName.bikeModel",
        },
      },
    ]);
    // return res.send(find_user)
    if (find_user.length == 0) {
      const err = new customError(
        global.CONFIGS.api.getUserDetailsFail,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }

    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.getUserDetailsSuccess,
      // totalPage: totalPage,
      data: find_user,
    });
  },
  /** */
  /**get single vehicleDetails by Admin */

  getVehicleSingleAdmin: async (req, res, next) => {
    // console.log(req.body);
    let find_user = await BikeDriverModel.aggregate([
      {
        $match: { _id: new ObjectId(req.query.id) },
      },
      /**driverbankdetails */
      {
        $lookup: {
          from: "driverbankdetails",
          localField: "bankDetailsId",
          foreignField: "_id",
          as: "driverbankdetails",
        },
      },
      { $unwind: "$driverbankdetails" },
      { $unset: "bankDetailsId" },
      /**bikedetails */
      {
        $lookup: {
          from: "bikedetails",
          localField: "bikeDetailsId",
          foreignField: "_id",
          as: "bikedetails",
        },
      },
      { $unwind: "$bikedetails" },
      { $unset: "bikeDetailsId" },
      { $unset: "bikedetails.mulkiyaDocImg._id" },
      { $unset: "bikedetails.vehicleImage._id" },

      /**fetch bikeMrand into bikedetails */

      {
        $lookup: {
          from: "bikebrand",
          localField: "bikedetails.brandId",
          foreignField: "_id",
          as: "bikebrandName",
        },
      },
      { $unwind: "$bikebrandName" },
      { $unset: "bikedetails.brandId" },

      /**fetch bikeModel into bikedetails */
      /**bikemodel */
      {
        $lookup: {
          from: "bikemodel",
          localField: "bikedetails.modelId",
          foreignField: "_id",
          as: "bikemodelName",
        },
      },
      { $unwind: "$bikemodelName" },
      { $unset: "bikedetails.modelId" },
      /**driveraddress */

      {
        $lookup: {
          from: "driveraddress",
          localField: "addressId",
          foreignField: "_id",
          as: "driveraddress",
        },
      },
      { $unwind: "$driveraddress" },
      { $unset: "addressId" },
      { $unset: "driveraddress.localAddress._id" },
      { $unset: "driveraddress.homeCountryAddress._id" },
      { $unset: "driveraddress.emergencyContact._id" },
      /**driverdoc */
      {
        $lookup: {
          from: "driverdoc",
          localField: "docId",
          foreignField: "_id",
          as: "driverdoc",
        },
      },
      { $unwind: "$driverdoc" },
      { $unset: "docId" },
      { $unset: "driverdoc.passportImg._id" },
      { $unset: "driverdoc.emiratesIdImg._id" },
      { $unset: "driverdoc.licenseImg._id" },
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $project: {
          _id: "$_id",
          /**bikedriverdetails */
          name: "$name",
          email: "$email",
          mobile: "$mobile",
          nationality: "$nationality",
          altMobile: "$altMobile",
          passportNumber: "$passportNumber",
          passwordassportValidity: "$passwordassportValidity",
          visaNumber: "$visaNumber",
          visaValidity: "$visaValidity",
          emiratesId: "$emiratesId",
          emiratesIdValidity: "$emiratesIdValidity",
          InsuranceComp: "$InsuranceComp",
          insuranceValidity: "$insuranceValidity",
          password: "$password",
          licenseNumber: "$licenseNumber",
          licenseCity: "$licenseCity",
          licenseType: "$licenseType",
          licenseValidity: "$licenseValidity",
          isVerified: "$isVerified",
          driverType: "$driverType",
          activeStatus: "$activeStatus",
          /**driveraddress */
          localAddress: "$driveraddress.localAddress",
          homeCountryAddress: "$driveraddress.homeCountryAddress",
          emergencyContact: "$driveraddress.emergencyContact",
          /**driverbankdetails */
          bankName: "$driverbankdetails.bankName",
          branchName: "$driverbankdetails.branchName",
          accountNumber: "$driverbankdetails.accountNumber",
          accountHolderName: "$driverbankdetails.accountHolderName",
          IBAN: "$driverbankdetails.IBAN",
          /**driverdoc */
          passportImg: "$driverdoc.passportImg",
          emiratesIdImg: "$driverdoc.emiratesIdImg",
          licenseImg: "$driverdoc.licenseImg",
          visaImg: "$driverdoc.visaImg",
          driverImg: "$driverdoc.driverImg",
          /**bikedetails */
          ownerName: "$bikedetails.ownerName",
          vehicleNumber: "$bikedetails.vehicleNumber",
          registrationZone: "$bikedetails.registrationZone",
          registrationDate: "$bikedetails.registrationDate",
          vehicleColor: "$bikedetails.vehicleColor",
          vehicleYear: "$bikedetails.vehicleYear",
          vehicleAge: "$bikedetails.vehicleAge",
          chasisNumber: "$bikedetails.chasisNumber",
          bikeInsuranceValidity: "$bikedetails.bikeInsuranceValidity",
          fitnessValidity: "$bikedetails.fitnessValidity",
          mulkiyaValidity: "$bikedetails.mulkiyaValidity",
          mulkiyaDocImg: "$bikedetails.mulkiyaDocImg",
          vehicleImage: "$bikedetails.vehicleImage",
          bikeActiveStatus: "$bikedetails.activeStatus",
          bikeBrand: "$bikebrandName.bikeBrand",
          bikeModel: "$bikemodelName.bikeModel",
        },
      },
    ]);
    // return res.send(find_user)
    if (find_user.length == 0) {
      const err = new customError(
        global.CONFIGS.api.getUserDetailsFail,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }

    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.getUserDetailsSuccess,
      // totalPage: totalPage,
      data: find_user,
    });
  },
  /** */

  VehicleListFront: async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 20; // docs in single page
    const pageNo = parseInt(req.query.pageNo) || 1; //  page number
    const skip = (pageNo - 1) * limit;
    // console.log(skip, "...skip");
    let bikeDriverList = await BikeDriverModel.aggregate([
      {
        $match: { activeStatus: "1" },
      },
      /**driverbankdetails */
      {
        $lookup: {
          from: "driverbankdetails",
          localField: "bankDetailsId",
          foreignField: "_id",
          as: "driverbankdetails",
        },
      },
      { $unwind: "$driverbankdetails" },
      { $unset: "bankDetailsId" },
      /**bikedetails */
      {
        $lookup: {
          from: "bikedetails",
          localField: "bikeDetailsId",
          foreignField: "_id",
          as: "bikedetails",
        },
      },
      { $unwind: "$bikedetails" },
      { $unset: "bikeDetailsId" },
      { $unset: "bikedetails.mulkiyaDocImg._id" },
      { $unset: "bikedetails.vehicleImage._id" },

      /**fetch bikeMrand into bikedetails */

      {
        $lookup: {
          from: "bikebrand",
          localField: "bikedetails.brandId",
          foreignField: "_id",
          as: "bikebrandName",
        },
      },
      { $unwind: "$bikebrandName" },
      { $unset: "bikedetails.brandId" },

      /**fetch bikeModel into bikedetails */
      /**bikemodel */
      {
        $lookup: {
          from: "bikemodel",
          localField: "bikedetails.modelId",
          foreignField: "_id",
          as: "bikemodelName",
        },
      },
      { $unwind: "$bikemodelName" },
      { $unset: "bikedetails.modelId" },
      /**driveraddress */

      {
        $lookup: {
          from: "driveraddress",
          localField: "addressId",
          foreignField: "_id",
          as: "driveraddress",
        },
      },
      { $unwind: "$driveraddress" },
      { $unset: "addressId" },
      { $unset: "driveraddress.localAddress._id" },
      { $unset: "driveraddress.homeCountryAddress._id" },
      { $unset: "driveraddress.emergencyContact._id" },
      /**driverdoc */
      {
        $lookup: {
          from: "driverdoc",
          localField: "docId",
          foreignField: "_id",
          as: "driverdoc",
        },
      },
      { $unwind: "$driverdoc" },
      { $unset: "docId" },
      { $unset: "driverdoc.passportImg._id" },
      { $unset: "driverdoc.emiratesIdImg._id" },
      { $unset: "driverdoc.licenseImg._id" },
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $project: {
          _id: "$_id",
          /**bikedriverdetails */
          name: "$name",
          email: "$email",
          mobile: "$mobile",
          nationality: "$nationality",
          altMobile: "$altMobile",
          passportNumber: "$passportNumber",
          passwordassportValidity: "$passwordassportValidity",
          visaNumber: "$visaNumber",
          visaValidity: "$visaValidity",
          emiratesId: "$emiratesId",
          emiratesIdValidity: "$emiratesIdValidity",
          InsuranceComp: "$InsuranceComp",
          insuranceValidity: "$insuranceValidity",
          password: "$password",
          licenseNumber: "$licenseNumber",
          licenseCity: "$licenseCity",
          licenseType: "$licenseType",
          licenseValidity: "$licenseValidity",
          isVerified: "$isVerified",
          driverType: "$driverType",
          activeStatus: "$activeStatus",
          /**driveraddress */
          localAddress: "$driveraddress.localAddress",
          homeCountryAddress: "$driveraddress.homeCountryAddress",
          emergencyContact: "$driveraddress.emergencyContact",
          /**driverbankdetails */
          bankName: "$driverbankdetails.bankName",
          branchName: "$driverbankdetails.branchName",
          accountNumber: "$driverbankdetails.accountNumber",
          accountHolderName: "$driverbankdetails.accountHolderName",
          IBAN: "$driverbankdetails.IBAN",
          /**driverdoc */
          passportImg: "$driverdoc.passportImg",
          emiratesIdImg: "$driverdoc.emiratesIdImg",
          licenseImg: "$driverdoc.licenseImg",
          visaImg: "$driverdoc.visaImg",
          driverImg: "$driverdoc.driverImg",
          /**bikedetails */
          ownerName: "$bikedetails.ownerName",
          vehicleNumber: "$bikedetails.vehicleNumber",
          registrationZone: "$bikedetails.registrationZone",
          registrationDate: "$bikedetails.registrationDate",
          vehicleColor: "$bikedetails.vehicleColor",
          vehicleYear: "$bikedetails.vehicleYear",
          vehicleAge: "$bikedetails.vehicleAge",
          chasisNumber: "$bikedetails.chasisNumber",
          bikeInsuranceValidity: "$bikedetails.bikeInsuranceValidity",
          fitnessValidity: "$bikedetails.fitnessValidity",
          mulkiyaValidity: "$bikedetails.mulkiyaValidity",
          mulkiyaDocImg: "$bikedetails.mulkiyaDocImg",
          vehicleImage: "$bikedetails.vehicleImage",
          bikeActiveStatus: "$bikedetails.activeStatus",
          bikeBrand: "$bikebrandName.bikeBrand",
          bikeModel: "$bikemodelName.bikeModel",
        },
      },
      {
        $facet: {
          metadata: [{ $count: "total" }, { $addFields: { page: pageNo } }],
          data: [{ $skip: skip }, { $limit: limit }], // add projection here wish you re-shape the docs
        },
      },
    ]);
    if (bikeDriverList[0].data.length == 0) {
      const err = new customError(
        global.CONFIGS.api.ProductNotfound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    const totalPage = Math.ceil(
      parseInt(bikeDriverList[0].metadata[0].total) / limit
    );
    const total = parseInt(bikeDriverList[0].metadata[0].total);
    const dataPerPage = total - skip > limit ? limit : total - skip;
    const totalLeftdata = total - skip - dataPerPage;
    const rangeStart = skip === 0 ? 1 : skip + 1;
    const rangeEnd = pageNo === totalPage ? total : skip + dataPerPage;
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.getProductSuccess,
      rangers: `Showing ${rangeStart} – ${rangeEnd} of ${total} totalData`,
      totalData: total,
      totalPage: totalPage,
      totalLeftdata: totalLeftdata,
      dataPerPage,
      allOrder: bikeDriverList[0].data,
    });
  },

  vehicleListAdmin: async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 20; // docs in single page
    const pageNo = parseInt(req.query.pageNo) || 1; //  page number
    const skip = (pageNo - 1) * limit;
    // console.log(skip, "...skip");
    let bikeDriverList = await BikeDriverModel.aggregate([
      /**driverbankdetails */
      {
        $lookup: {
          from: "driverbankdetails",
          localField: "bankDetailsId",
          foreignField: "_id",
          as: "driverbankdetails",
        },
      },
      { $unwind: "$driverbankdetails" },
      { $unset: "bankDetailsId" },
      /**bikedetails */
      {
        $lookup: {
          from: "bikedetails",
          localField: "bikeDetailsId",
          foreignField: "_id",
          as: "bikedetails",
        },
      },
      { $unwind: "$bikedetails" },
      { $unset: "bikeDetailsId" },
      { $unset: "bikedetails.mulkiyaDocImg._id" },
      { $unset: "bikedetails.vehicleImage._id" },

      /**fetch bikeMrand into bikedetails */

      {
        $lookup: {
          from: "bikebrand",
          localField: "bikedetails.brandId",
          foreignField: "_id",
          as: "bikebrandName",
        },
      },
      { $unwind: "$bikebrandName" },
      { $unset: "bikedetails.brandId" },

      /**fetch bikeModel into bikedetails */
      /**bikemodel */
      {
        $lookup: {
          from: "bikemodel",
          localField: "bikedetails.modelId",
          foreignField: "_id",
          as: "bikemodelName",
        },
      },
      { $unwind: "$bikemodelName" },
      { $unset: "bikedetails.modelId" },
      /**driveraddress */

      {
        $lookup: {
          from: "driveraddress",
          localField: "addressId",
          foreignField: "_id",
          as: "driveraddress",
        },
      },
      { $unwind: "$driveraddress" },
      { $unset: "addressId" },
      { $unset: "driveraddress.localAddress._id" },
      { $unset: "driveraddress.homeCountryAddress._id" },
      { $unset: "driveraddress.emergencyContact._id" },
      /**driverdoc */
      {
        $lookup: {
          from: "driverdoc",
          localField: "docId",
          foreignField: "_id",
          as: "driverdoc",
        },
      },
      { $unwind: "$driverdoc" },
      { $unset: "docId" },
      { $unset: "driverdoc.passportImg._id" },
      { $unset: "driverdoc.emiratesIdImg._id" },
      { $unset: "driverdoc.licenseImg._id" },
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $project: {
          _id: 1,
          // _id: "$_id",
          /**bikedriverdetails */
          name: 1,
          email: 1,
          // email: "$email",
          mobile: 1,
          // mobile: "$mobile",
          nationality: "$nationality",
          altMobile: 1,
          // altMobile: "$altMobile",
          passportNumber: "$passportNumber",
          passwordassportValidity: "$passwordassportValidity",
          visaNumber: "$visaNumber",
          visaValidity: "$visaValidity",
          emiratesId: "$emiratesId",
          emiratesIdValidity: "$emiratesIdValidity",
          InsuranceComp: "$InsuranceComp",
          insuranceValidity: "$insuranceValidity",
          password: "$password",
          licenseNumber: "$licenseNumber",
          licenseCity: "$licenseCity",
          licenseType: "$licenseType",
          licenseValidity: "$licenseValidity",
          isVerified: "$isVerified",
          driverType: "$driverType",
          activeStatus: "$activeStatus",
          /**driveraddress */
          localAddress: "$driveraddress.localAddress",
          homeCountryAddress: "$driveraddress.homeCountryAddress",
          emergencyContact: "$driveraddress.emergencyContact",
          /**driverbankdetails */
          bankName: "$driverbankdetails.bankName",
          branchName: "$driverbankdetails.branchName",
          accountNumber: "$driverbankdetails.accountNumber",
          accountHolderName: "$driverbankdetails.accountHolderName",
          IBAN: "$driverbankdetails.IBAN",
          /**driverdoc */
          passportImg: "$driverdoc.passportImg",
          emiratesIdImg: "$driverdoc.emiratesIdImg",
          licenseImg: "$driverdoc.licenseImg",
          visaImg: "$driverdoc.visaImg",
          driverImg: "$driverdoc.driverImg",
          /**bikedetails */
          ownerName: "$bikedetails.ownerName",
          vehicleNumber: "$bikedetails.vehicleNumber",
          registrationZone: "$bikedetails.registrationZone",
          registrationDate: "$bikedetails.registrationDate",
          vehicleColor: "$bikedetails.vehicleColor",
          vehicleYear: "$bikedetails.vehicleYear",
          vehicleAge: "$bikedetails.vehicleAge",
          chasisNumber: "$bikedetails.chasisNumber",
          bikeInsuranceValidity: "$bikedetails.bikeInsuranceValidity",
          fitnessValidity: "$bikedetails.fitnessValidity",
          mulkiyaValidity: "$bikedetails.mulkiyaValidity",
          mulkiyaDocImg: "$bikedetails.mulkiyaDocImg",
          vehicleImage: "$bikedetails.vehicleImage",
          bikeActiveStatus: "$bikedetails.activeStatus",
          bikeBrand: "$bikebrandName.bikeBrand",
          bikeModel: "$bikemodelName.bikeModel",
        },
      },
      {
        $facet: {
          metadata: [{ $count: "total" }, { $addFields: { page: pageNo } }],
          data: [{ $skip: skip }, { $limit: limit }], // add projection here wish you re-shape the docs
        },
      },
    ]);
    if (bikeDriverList[0].data.length == 0) {
      const err = new customError(
        global.CONFIGS.api.ProductNotfound,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    const totalPage = Math.ceil(
      parseInt(bikeDriverList[0].metadata[0].total) / limit
    );
    const total = parseInt(bikeDriverList[0].metadata[0].total);
    const dataPerPage = total - skip > limit ? limit : total - skip;
    const totalLeftdata = total - skip - dataPerPage;
    const rangeStart = skip === 0 ? 1 : skip + 1;
    const rangeEnd = pageNo === totalPage ? total : skip + dataPerPage;
    return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: global.CONFIGS.api.getProductSuccess,
      rangers: `Showing ${rangeStart} – ${rangeEnd} of ${total} totalData`,
      totalData: total,
      totalPage: totalPage,
      totalLeftdata: totalLeftdata,
      dataPerPage,
      allOrder: bikeDriverList[0].data,
    });
  },
};
