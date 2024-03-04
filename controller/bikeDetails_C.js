var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const BikeModel = mongoose.model(constants.BikeModel);
const BikeDriverModel = mongoose.model(constants.BikeDriverModel);
const common = require("../service/commonFunction");
var customError = require("../middleware/customerror");
const bcrypt = require("bcrypt");
const DriverDocModel = mongoose.model(constants.DriverDocModel);
const DriverAddressModel = mongoose.model(constants.DriverAddressModel);
const DriverBankDetailsModel = mongoose.model(constants.DriverBankDetailsModel);
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
  /** */
  addVehicle: async (req, res, next) => {
    console.log(req.files, "....files");
    console.log(req.body, ".....body");
    var find_Driver = await BikeDriverModel.findOne({
      $or: [
        { mobile: req.body.mobile },
        { licenseNumber: req.body.licenseNumber },
        { visaNumber: req.body.visaNumber },
        { emiratesId: req.body.emiratesId },
      ],
    });
    var find_vehicle = await BikeModel.findOne({
      chasisNumber: req.body.chasisNumber,
    });
    if (find_vehicle || find_Driver) {
      const err = new customError(
        global.CONFIGS.api.Productalreadyadded,
        global.CONFIGS.responseCode.alreadyExist
      );
      return next(err);
    }

    let mulkiyaDocImg = {};
    let vehicleImage = {};
    let passportImg = {};
    let emiratesIdImg = {};
    let licenseImg = {};

    // Check if all required files are present
    if (
      req.files.mulkiyaImgFront &&
      req.files.mulkiyaImgBack &&
      req.files.vehicleImgFront &&
      req.files.vehicleImgBack &&
      req.files.vehicleImgLeft &&
      req.files.vehicleImgRight &&
      req.files.passportImgFront &&
      req.files.passportImgBack &&
      req.files.emiratesIdImgFront &&
      req.files.emiratesIdImgBack &&
      req.files.licenseImgFront &&
      req.files.licenseImgBack &&
      req.files.visaImg &&
      req.files.driverImg &&
      req.body.brandId &&
      req.body.modelId &&
      req.body.ownerName &&
      req.body.vehicleNumber &&
      req.body.registrationZone &&
      req.body.vehicleColor &&
      req.body.registrationDate &&
      req.body.vehicleYear &&
      req.body.chasisNumber &&
      req.body.bikeInsuranceValidity &&
      req.body.fitnessValidity &&
      req.body.mulkiyaValidity &&
      req.body.vehicleAge &&
      req.body.name &&
      req.body.email &&
      req.body.mobile &&
      req.body.nationality &&
      req.body.altMobile &&
      req.body.passportNumber &&
      req.body.passwordassportValidity &&
      req.body.visaNumber &&
      req.body.visaValidity &&
      req.body.emiratesId &&
      req.body.emiratesIdValidity &&
      req.body.InsuranceComp &&
      req.body.insuranceValidity &&
      req.body.password &&
      req.body.licenseNumber &&
      req.body.licenseCity &&
      req.body.licenseType &&
      req.body.licenseValidity &&
      req.body.lHouseNo &&
      req.body.lBuildingName &&
      req.body.lStreet &&
      req.body.lLandmark &&
      req.body.hcHouseNo &&
      req.body.hcBuildingName &&
      req.body.hcStreet &&
      req.body.hcLandmark &&
      req.body.hcCity &&
      req.body.hcState &&
      req.body.hcPinCode &&
      req.body.ecName &&
      req.body.ecRelation &&
      req.body.ecMobile &&
      req.body.bankName &&
      req.body.branchName &&
      req.body.accountNumber &&
      req.body.accountHolderName &&
      req.body.IBAN
      /** */
      //  && req.body.long &&
      //    req.body.lat
      /** */
    ) {
      mulkiyaDocImg.frontImg = `uploads/bike/${req.files.mulkiyaImgFront[0].filename}`;
      mulkiyaDocImg.backImg = `uploads/bike/${req.files.mulkiyaImgBack[0].filename}`;
      req.body.mulkiyaDocImg = mulkiyaDocImg;

      vehicleImage.frontImage = `uploads/bike/${req.files.vehicleImgFront[0].filename}`;
      vehicleImage.backImage = `uploads/bike/${req.files.vehicleImgBack[0].filename}`;
      vehicleImage.leftImage = `uploads/bike/${req.files.vehicleImgLeft[0].filename}`;
      vehicleImage.rightImage = `uploads/bike/${req.files.vehicleImgRight[0].filename}`;
      req.body.vehicleImage = vehicleImage;

      passportImg.frontImg = `uploads/bike/${req.files.passportImgFront[0].filename}`;
      passportImg.backImg = `uploads/bike/${req.files.passportImgBack[0].filename}`;
      req.body.passportImg = passportImg;

      emiratesIdImg.frontImg = `uploads/bike/${req.files.emiratesIdImgFront[0].filename}`;
      emiratesIdImg.backImg = `uploads/bike/${req.files.emiratesIdImgBack[0].filename}`;
      req.body.emiratesIdImg = emiratesIdImg;

      licenseImg.frontImg = `uploads/bike/${req.files.licenseImgFront[0].filename}`;
      licenseImg.backImg = `uploads/bike/${req.files.licenseImgBack[0].filename}`;
      req.body.licenseImg = licenseImg;

      req.body.visaImg = `uploads/bike/${req.files.visaImg[0].filename}`;

      req.body.driverImg = `uploads/bike/${req.files.driverImg[0].filename}`;
      /** */
      //   req.body.location = {
      //     type: "Point",
      //     coordinates: [req.body.long, req.body.lat],
      //   };
      /** */
      // Hash password using bcrypt
      const salt = await bcrypt.genSaltSync(global.CONFIGS.pass.saltround);
      const hash = await bcrypt.hashSync(req.body.password, salt);
      req.body.password = hash;

      try {
        const createDriver = await BikeDriverModel.create(req.body);
        if (!createDriver) {
          throw new Error("Failed to create driver");
        }
        const createVehicle = await BikeModel.create(req.body);
        if (!createVehicle) {
          throw new Error("Failed to create Vehicle");
        }

        // Create DriverAddressModel and DriverBankDetailsModel with driverId from createDriver
        const createAddress = await DriverAddressModel.create({
          emergencyContact: {
            namr: req.body.ecName,
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
          driverId: createDriver._id, // Use _id from createDriver
        });

        if (!createAddress) {
          throw new Error("Failed to create address");
        }
        const createDoc = await DriverDocModel.create({
          passportImg: req.body.passportImg,
          emiratesIdImg: req.body.emiratesIdImg,
          licenseImg: req.body.licenseImg,
          visaImg: req.body.visaImg,
          driverImg: req.body.driverImg,
          driverId: createDriver._id,
        });
        if (!createDoc) {
          throw new Error("Failed to create driver document");
        }

        const createBankDetails = await DriverBankDetailsModel.create({
          driverId: createDriver._id, // Use _id from createDriver
          IBAN: req.body.IBAN,
          accountHolderName: req.body.accountHolderName,
          accountNumber: req.body.accountNumber,
          branchName: req.body.branchName,
          bankName: req.body.bankName,
        });

        if (!createBankDetails) {
          throw new Error("Failed to create bank details");
        }
        if (createVehicle && createAddress && createBankDetails && createDoc) {
          const updateDriver = await BikeDriverModel.updateOne(
            { _id: createDriver._id },
            {
              addressId: createAddress._id,
              bankDetailsId: createBankDetails._id,
              bikeDetailsId: createVehicle._id,
              docId: createDoc._id,
            }
          );
          return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.Productadded,
            updateDriver: updateDriver,
          });
        }
      } catch (error) {
        // Handle errors
        return next(error);
      }
    } else {
      // If any of the required files are missing, return an error response
      const err = new customError(
        global.CONFIGS.api.RequiredFilesMissing,
        global.CONFIGS.responseCode.badRequest
      );
      return next(err);
    }
  },

  /** */
  updateVehicle: async (req, res, next) => {
    try {
      const { id } = req.params;
      console.log({ _id: id });

      /**Update BikeDriver */
      const updatedDriver = await BikeDriverModel.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
      );
      if (!updatedDriver) {
        throw new Error("Driver not found");
      }

      /*  Update Bank Details*/
      const updatedBankDetails = await DriverBankDetailsModel.findByIdAndUpdate(
        updatedDriver.bankDetailsId,
        req.body,
        { new: true }
      );
      if (!updatedBankDetails) {
        throw new Error("Bank details not found");
      }

      /* Update Driver Documents*/
      const updatedDriverDoc = await DriverDocModel.findByIdAndUpdate(
        updatedDriver.docId,
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
        throw new Error("Driver documents not found");
      }
      /* Update Driver Address*/
      const updateDriverAddress = await DriverAddressModel.findByIdAndUpdate(
        updatedDriver.addressId,
        {
          $set: {
            emergencyContact: {
              namr: req.body.ecName,
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
        throw new Error("Driver address not found");
      }
      /* Update Bike Details*/
      const updateBikeDetails = await BikeModel.findByIdAndUpdate(
        updatedDriver.bikeDetailsId,
        {
          $set: {
            brandId: req.body.brandId,
            modelId: req.body.modelId,
            ownerName: req.body.ownerName,
            vehicleNumber: req.body.vehicleNumber,
            registrationZone: req.body.registrationZone,
            vehicleColor: req.body.vehicleColor,
            registrationDate: req.body.registrationDate,
            vehicleYear: req.body.vehicleYear,
            chasisNumber: req.body.chasisNumber,
            bikeInsuranceValidity: req.body.bikeInsuranceValidity,
            fitnessValidity: req.body.fitnessValidity,
            mulkiyaValidity: req.body.mulkiyaValidity,
            vehicleAge: req.body.vehicleAge,
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            nationality: req.body.nationality,
            altMobile: req.body.altMobile,
            passportNumber: req.body.passportNumber,
            passportValidity: req.body.passportValidity,
            visaNumber: req.body.visaNumber,
            visaValidity: req.body.visaValidity,
            emiratesId: req.body.emiratesId,
            emiratesIdValidity: req.body.emiratesIdValidity,
            InsuranceComp: req.body.InsuranceComp,
            insuranceValidity: req.body.insuranceValidity,
            licenseNumber: req.body.licenseNumber,
            licenseCity: req.body.licenseCity,
            licenseType: req.body.licenseType,
            licenseValidity: req.body.licenseValidity,
          },
        },
        { new: true }
      );
      if (!updateBikeDetails) {
        throw new Error("Bike Details  not found");
      }
      if (
        updateDriverAddress &&
        updatedBankDetails &&
        updatedDriverDoc &&
        updateBikeDetails
      ) {
        return res.status(global.CONFIGS.responseCode.success).json({
          success: true,
          message: global.CONFIGS.api.ProductUpdated,
        });
      } else {
        throw new Error("Failed to update driver");
      }
    } catch (error) {
      // Handle errors
      return next(error);
    }
  },

  /** */
  deletevehicle: async (req, res, next) => {
    try {
      const { id } = req.params;

      /* Delete BikeDriver*/
      const deletedDriver = await BikeDriverModel.findByIdAndRemove(id);
      if (!deletedDriver) {
        throw new Error("Driver not found");
      }

      /* Delete Bank Details*/
      const deletedBankDetails = await DriverBankDetailsModel.findByIdAndRemove(
        deletedDriver.bankDetailsId
      );
      if (!deletedBankDetails) {
        throw new Error("Bank details not found");
      }

      /* Delete Driver Documents*/
      const deletedDriverDoc = await DriverDocModel.findByIdAndRemove(
        deletedDriver.docId
      );
      if (!deletedDriverDoc) {
        throw new Error("Driver documents not found");
      }

      /* Delete Driver Address*/
      const deletedDriverAddress = await DriverAddressModel.findByIdAndRemove(
        deletedDriver.addressId
      );
      if (!deletedDriverAddress) {
        throw new Error("Driver address not found");
      }

      /* Delete Bike Details*/
      const deletedBikeDetails = await BikeModel.findByIdAndRemove(
        deletedDriver.bikeDetailsId
      );
      if (!deletedBikeDetails) {
        throw new Error("Bike Details not found");
      }

      return res.status(global.CONFIGS.responseCode.success).json({
        success: true,
        message: global.CONFIGS.api.ProductDelete,
        deleteBikeDetails: deletedBikeDetails,
        deleteBikedriver: deletedDriver,
      });
    } catch (error) {
      // Handle errors
      return next(error);
    }
  },

  /** */

  /**get single vehicleDetails */

  getVehicleSingleFront: async (req, res, next) => {
    // console.log(req.body);
    var find_user = await BikeDriverModel.aggregate([
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

  VehicleListFront: async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 20; // docs in single page
    const pageNo = parseInt(req.query.pageNo) || 1; //  page number
    const skip = (pageNo - 1) * limit;
    // console.log(skip, "...skip");
    var bikeDriverList = await BikeDriverModel.aggregate([
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
    var bikeDriverList = await BikeDriverModel.aggregate([
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




/**
{
    "success": true,
    "message": "Get trialUsersList by_Admin Successfully.",
    "rangers": "Showing 1 – 3 of 3 totalData",
    "totalData": 3,
    "totalPage": 1,
    "totalLeftdata": 0,
    "dataPerPage": 3,
    "data": [
        {
            "_id": "65e17c27ea7a990da2d2ab23",
            "orderId": "3abf969c-e5c4-4bf5-96f3-0d7bcf12e4fb",
            "userDetails": {
                "_id": "65dddfc76b9372995c94d73a",
                "mobile": 9007790518,
                "Otp": 774441,
                "OtpsendDate": "2024-02-27T13:12:39.777Z",
                "isVerified": true,
                "userType": "Guest",
                "activeStatus": "1",
                "createdAt": "2024-02-27T13:12:39.782Z",
                "updatedAt": "2024-02-29T07:12:37.373Z",
                "email": "irshad@gmail.com",
                "name": "md irshad",
                "password": "$2b$10$BtZnsmQ4gcx3s7LIwH9xLefHa9nU/9hyyWqy4oVbp6k8jcpcEmoDi",
                "trialActive": true,
                "trialQuantity": 0
            },
            "useraddressDetails": {
                "_id": "65df15c1201b187c5b2701f2",
                "houseNo": "123",
                "buildingName": "testBuilding",
                "city": "testcity",
                "landmark": "testLandmark",
                "country": "india",
                "userId": "65dddfc76b9372995c94d73a",
                "activeStatus": "1",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        77.367874,
                        28.606436
                    ]
                },
                "lat": 28.606436,
                "long": 77.367874,
                "createdAt": "2024-02-28T11:15:13.826Z",
                "updatedAt": "2024-02-28T11:15:13.826Z"
            },
            "product": [
                {
                    "_id": "65d7472faca6a847be7a4df9",
                    "quantity": 3,
                    "productName": "Bourn_Vita",
                    "productImage": "uploads/products/apple.jpg",
                    "productPrice": 45,
                    "productUOM": "bv",
                    "productDes": "this is healthy and good for health",
                    "categoryName": "milk",
                    "subategoryName": "Barista Milk"
                },
                {
                    "_id": "65d720a5405b87fd6e0a7b7e",
                    "quantity": 4,
                    "productName": "corn_Flakes",
                    "productImage": "uploads/products/apple4.jpg",
                    "productPrice": 45,
                    "productUOM": "cf",
                    "productDes": "this is healthy and good for health",
                    "categoryName": "Dairy",
                    "subategoryName": "Barista Milk"
                }
            ]
        },
        {
            "_id": "65e17e87ea7a990da2d2ab4a",
            "orderId": "3abf969c-e5c4-4bf5-96f3-0d7bcf12e4fb",
            "userDetails": {
                "_id": "65c36c691efdab762398183c",
                "mobile": 1234567890,
                "Otp": 464998,
                "OtpsendDate": "2024-02-07T11:41:29.063Z",
                "isVerified": true,
                "userType": "Admin",
                "activeStatus": "1",
                "createdAt": "2024-02-07T11:41:29.077Z",
                "updatedAt": "2024-02-09T13:08:23.017Z",
                "DOB": "1999-08-11T18:30:00.000Z",
                "email": "admin.dhudu@gmail.com",
                "name": "Dhudu Admin",
                "password": "$2b$10$KwkI7.AeSk1KvSzSVtFXHOdbEeTFthHnkmGukbRZBobV7HV50ibte",
                "userImage": "uploads/user/winter-hat_3662360.png"
            },
            "useraddressDetails": {
                "_id": "65e17d7cea7a990da2d2ab3a",
                "houseNo": "111",
                "buildingName": "testBuilding1",
                "city": "testcity1",
                "landmark": "testLandmark1",
                "country": "india",
                "userId": "65c36c691efdab762398183c",
                "activeStatus": "1",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        77,
                        30
                    ]
                },
                "lat": 30,
                "long": 77,
                "createdAt": "2024-03-01T07:02:20.641Z",
                "updatedAt": "2024-03-01T07:04:36.207Z"
            },
            "product": [
                {
                    "_id": "65d7472faca6a847be7a4df9",
                    "quantity": 2,
                    "productName": "Bourn_Vita",
                    "productImage": "uploads/products/apple.jpg",
                    "productPrice": 45,
                    "productUOM": "bv",
                    "productDes": "this is healthy and good for health",
                    "categoryName": "milk",
                    "subategoryName": "Barista Milk"
                },
                {
                    "_id": "65d720a5405b87fd6e0a7b7e",
                    "quantity": 3,
                    "productName": "corn_Flakes",
                    "productImage": "uploads/products/apple4.jpg",
                    "productPrice": 45,
                    "productUOM": "cf",
                    "productDes": "this is healthy and good for health",
                    "categoryName": "Dairy",
                    "subategoryName": "Barista Milk"
                }
            ]
        },
        {
            "_id": "65e17fddea7a990da2d2ab65",
            "orderId": "3abf969c-e5c4-4bf5-96f3-0d7bcf12e4fb",
            "userDetails": {
                "_id": "65c36efb1985ce5ebbdb2b8d",
                "mobile": 8521661104,
                "Otp": 897073,
                "OtpsendDate": "2024-02-07T11:52:27.420Z",
                "isVerified": false,
                "userType": "User",
                "activeStatus": "1",
                "createdAt": "2024-02-07T11:52:27.431Z",
                "updatedAt": "2024-02-07T11:52:27.431Z"
            },
            "useraddressDetails": {
                "_id": "65e17ef5ea7a990da2d2ab51",
                "houseNo": "2222222",
                "buildingName": "testBuilding2",
                "city": "testcity2",
                "landmark": "testLandmark2",
                "country": "india",
                "userId": "65c36efb1985ce5ebbdb2b8d",
                "activeStatus": "1",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        75.5,
                        31
                    ]
                },
                "lat": 31,
                "long": 75.5,
                "createdAt": "2024-03-01T07:08:37.867Z",
                "updatedAt": "2024-03-01T07:08:37.867Z"
            },
            "product": [
                {
                    "_id": "65d7285ecf03ebe77eebfdd9",
                    "quantity": 6,
                    "productName": "Oat",
                    "productImage": "uploads/products/apple4.jpg",
                    "productPrice": 45,
                    "productUOM": "lt",
                    "productDes": "this is healthy and good for health",
                    "categoryName": "Plant Milk",
                    "subategoryName": "Barista Milk"
                },
                {
                    "_id": "65d720a5405b87fd6e0a7b7e",
                    "quantity": 9,
                    "productName": "corn_Flakes",
                    "productImage": "uploads/products/apple4.jpg",
                    "productPrice": 45,
                    "productUOM": "cf",
                    "productDes": "this is healthy and good for health",
                    "categoryName": "Dairy",
                    "subategoryName": "Barista Milk"
                }
            ]
        }
    ]
}


 */