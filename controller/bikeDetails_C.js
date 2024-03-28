let mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const BikeModel = mongoose.model(constants.BikeModel);
const BikeDriverModel = mongoose.model(constants.BikeDriverModel);
const common = require("../service/commonFunction");
let customError = require("../middleware/customerror");
const bcrypt = require("bcrypt");
const DriverDocModel = mongoose.model(constants.DriverDocModel);
const DriverAddressModel = mongoose.model(constants.DriverAddressModel);
const DriverBankDetailsModel = mongoose.model(constants.DriverBankDetailsModel);
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
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
    }
  
  let bikeDetails = {};
    bikeDetails.brandId = req.body.truckBrandId;
    bikeDetails.modelId = req.body.truckModelId;
    bikeDetails.ownerName = req.body.ownerName;
    bikeDetails.vehicleNumber = req.body.vehicleNumber;
    bikeDetails.registrationZone = req.body.registrationZone;
    bikeDetails.vehicleColor = req.body.vehicleColor;
    bikeDetails.registrationDate = req.body.registrationDate;
    bikeDetails.vehicleYear = req.body.vehicleYear;
    bikeDetails.fuelType = req.body.fuelType;
    bikeDetails.vehicleAge = req.body.vehicleAge;
    bikeDetails.chasisNumber = req.body.chasisNumber;
    bikeDetails.insuranceValidity = req.body.insuranceValidity;
    bikeDetails.fitnessValidity = req.body.fitnessValidity;
    bikeDetails.mulkiyaValidity = req.body.mulkiyaValidity;
    bikeDetails.activeStatus = req.body.activeStatus;
    bikeDetails.mulkiyaDocImg = mulkiyaDocImg;
    bikeDetails.vehicleImage = vehicleImage;
    const createDriver = await BikeDriverModel.create(bikeDetails);

    if (!createDriver) {
      const err = new customError(
        global.CONFIGS.api.DriverNotAdded,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }
    const createVehicle = await BikeModel.create(req.body);
    if (!createVehicle) {
      const err = new customError(
        global.CONFIGS.api.vehicleNotAdded,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
    }

    // Create DriverAddressModel and DriverBankDetailsModel with driverId from createDriver
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
      driverId: createDriver._id, // Use _id from createDriver
    });

    if (!createAddress) {
      const err = new customError(
        global.CONFIGS.api.AddressNotAdded,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
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
    });

    if (!createBankDetails) {
      const err = new customError(
        global.CONFIGS.api.BankDetailsNotAdded,
        global.CONFIGS.responseCode.notFound
      );
      return next(err);
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
        message: global.CONFIGS.api.DriverDetailsAdded,
        updateDriver: updateDriver,
      });
    }
  },
  /** */
  // /** */
  // addVehicle: async (req, res, next) => {
  //   let find_Driver = await BikeDriverModel.findOne({
  //     $or: [
  //       { mobile: req.body.mobile },
  //       { licenseNumber: req.body.licenseNumber },
  //       { visaNumber: req.body.visaNumber },
  //       { emiratesId: req.body.emiratesId },
  //     ],
  //   });
  //   let find_vehicle = await BikeModel.findOne({
  //     chasisNumber: req.body.chasisNumber,
  //   });
  //   if (find_vehicle || find_Driver) {
  //     const err = new customError(
  //       global.CONFIGS.api.Driveralreadyadded,
  //       global.CONFIGS.responseCode.alreadyExist
  //     );
  //     return next(err);
  //   }

  //   let mulkiyaDocImg = {};
  //   let vehicleImage = {};
  //   let passportImg = {};
  //   let emiratesIdImg = {};
  //   let licenseImg = {};

  //   // Check if all required files are present
  //   if (
  //     req.files.mulkiyaImgFront &&
  //     req.files.mulkiyaImgBack &&
  //     req.files.vehicleImgFront &&
  //     req.files.vehicleImgBack &&
  //     req.files.vehicleImgLeft &&
  //     req.files.vehicleImgRight &&
  //     req.files.passportImgFront &&
  //     req.files.passportImgBack &&
  //     req.files.emiratesIdImgFront &&
  //     req.files.emiratesIdImgBack &&
  //     req.files.licenseImgFront &&
  //     req.files.licenseImgBack &&
  //     req.files.visaImg &&
  //     req.files.driverImg &&
  //     req.body.brandId &&
  //     req.body.modelId &&
  //     req.body.ownerName &&
  //     req.body.vehicleNumber &&
  //     req.body.registrationZone &&
  //     req.body.vehicleColor &&
  //     req.body.registrationDate &&
  //     req.body.vehicleYear &&
  //     req.body.chasisNumber &&
  //     req.body.bikeInsuranceValidity &&
  //     req.body.fitnessValidity &&
  //     req.body.mulkiyaValidity &&
  //     req.body.vehicleAge &&
  //     req.body.name &&
  //     req.body.email &&
  //     req.body.mobile &&
  //     req.body.nationality &&
  //     req.body.altMobile &&
  //     req.body.passportNumber &&
  //     req.body.passwordassportValidity &&
  //     req.body.visaNumber &&
  //     req.body.visaValidity &&
  //     req.body.emiratesId &&
  //     req.body.emiratesIdValidity &&
  //     req.body.InsuranceComp &&
  //     req.body.insuranceValidity &&
  //     req.body.password &&
  //     req.body.licenseNumber &&
  //     req.body.licenseCity &&
  //     req.body.licenseType &&
  //     req.body.licenseValidity &&
  //     req.body.lHouseNo &&
  //     req.body.lBuildingName &&
  //     req.body.lStreet &&
  //     req.body.lLandmark &&
  //     req.body.hcHouseNo &&
  //     req.body.hcBuildingName &&
  //     req.body.hcStreet &&
  //     req.body.hcLandmark &&
  //     req.body.hcCity &&
  //     req.body.hcState &&
  //     req.body.hcPinCode &&
  //     req.body.ecName &&
  //     req.body.ecRelation &&
  //     req.body.ecMobile &&
  //     req.body.bankName &&
  //     req.body.branchName &&
  //     req.body.accountNumber &&
  //     req.body.accountHolderName &&
  //     req.body.IBAN
  //     /** */
  //     //  && req.body.long &&
  //     //    req.body.lat
  //     /** */
  //   ) {
  //     mulkiyaDocImg.frontImg = `uploads/bike/${req.files.mulkiyaImgFront[0].filename}`;
  //     mulkiyaDocImg.backImg = `uploads/bike/${req.files.mulkiyaImgBack[0].filename}`;
  //     req.body.mulkiyaDocImg = mulkiyaDocImg;

  //     vehicleImage.frontImage = `uploads/bike/${req.files.vehicleImgFront[0].filename}`;
  //     vehicleImage.backImage = `uploads/bike/${req.files.vehicleImgBack[0].filename}`;
  //     vehicleImage.leftImage = `uploads/bike/${req.files.vehicleImgLeft[0].filename}`;
  //     vehicleImage.rightImage = `uploads/bike/${req.files.vehicleImgRight[0].filename}`;
  //     req.body.vehicleImage = vehicleImage;

  //     passportImg.frontImg = `uploads/bike/${req.files.passportImgFront[0].filename}`;
  //     passportImg.backImg = `uploads/bike/${req.files.passportImgBack[0].filename}`;
  //     req.body.passportImg = passportImg;

  //     emiratesIdImg.frontImg = `uploads/bike/${req.files.emiratesIdImgFront[0].filename}`;
  //     emiratesIdImg.backImg = `uploads/bike/${req.files.emiratesIdImgBack[0].filename}`;
  //     req.body.emiratesIdImg = emiratesIdImg;

  //     licenseImg.frontImg = `uploads/bike/${req.files.licenseImgFront[0].filename}`;
  //     licenseImg.backImg = `uploads/bike/${req.files.licenseImgBack[0].filename}`;
  //     req.body.licenseImg = licenseImg;

  //     req.body.visaImg = `uploads/bike/${req.files.visaImg[0].filename}`;

  //     req.body.driverImg = `uploads/bike/${req.files.driverImg[0].filename}`;
  //     /** */
  //     //   req.body.location = {
  //     //     type: "Point",
  //     //     coordinates: [req.body.long, req.body.lat],
  //     //   };
  //     /** */
  //     // Hash password using bcrypt
  //     const salt = await bcrypt.genSaltSync(global.CONFIGS.pass.saltround);
  //     const hash = await bcrypt.hashSync(req.body.password, salt);
  //     req.body.password = hash;
  //   }

  //   const createDriver = await BikeDriverModel.create(req.body);

  //   if (!createDriver) {
  //     const err = new customError(
  //       global.CONFIGS.api.DriverNotAdded,
  //       global.CONFIGS.responseCode.notFound
  //     );
  //     return next(err);
  //   }
  //   const createVehicle = await BikeModel.create(req.body);
  //   if (!createVehicle) {
  //     const err = new customError(
  //       global.CONFIGS.api.vehicleNotAdded,
  //       global.CONFIGS.responseCode.notFound
  //     );
  //     return next(err);
  //   }

  //   // Create DriverAddressModel and DriverBankDetailsModel with driverId from createDriver
  //   const createAddress = await DriverAddressModel.create({
  //     emergencyContact: {
  //       namr: req.body.ecName,
  //       relation: req.body.ecRelation,
  //       mobile: req.body.ecMobile,
  //     },
  //     homeCountryAddress: {
  //       houseNo: req.body.hcHouseNo,
  //       buildingName: req.body.hcBuildingName,
  //       street: req.body.hcStreet,
  //       landmark: req.body.hcLandmark,
  //       city: req.body.hcCity,
  //       state: req.body.hcState,
  //       pinCode: req.body.hcPinCode,
  //     },
  //     localAddress: {
  //       houseNo: req.body.lHouseNo,
  //       buildingName: req.body.lBuildingName,
  //       street: req.body.lStreet,
  //       landmark: req.body.lLandmark,
  //     },
  //     driverId: createDriver._id, // Use _id from createDriver
  //   });

  //   if (!createAddress) {
  //     const err = new customError(
  //       global.CONFIGS.api.AddressNotAdded,
  //       global.CONFIGS.responseCode.notFound
  //     );
  //     return next(err);
  //   }
  //   const createDoc = await DriverDocModel.create({
  //     passportImg: req.body.passportImg,
  //     emiratesIdImg: req.body.emiratesIdImg,
  //     licenseImg: req.body.licenseImg,
  //     visaImg: req.body.visaImg,
  //     driverImg: req.body.driverImg,
  //     driverId: createDriver._id,
  //   });
  //   if (!createDoc) {
  //     const err = new customError(
  //       global.CONFIGS.api.DocNotAdded,
  //       global.CONFIGS.responseCode.notFound
  //     );
  //     return next(err);
  //   }

  //   const createBankDetails = await DriverBankDetailsModel.create({
  //     driverId: createDriver._id, // Use _id from createDriver
  //     IBAN: req.body.IBAN,
  //     accountHolderName: req.body.accountHolderName,
  //     accountNumber: req.body.accountNumber,
  //     branchName: req.body.branchName,
  //     bankName: req.body.bankName,
  //   });

  //   if (!createBankDetails) {
  //     const err = new customError(
  //       global.CONFIGS.api.BankDetailsNotAdded,
  //       global.CONFIGS.responseCode.notFound
  //     );
  //     return next(err);
  //   }
  //   if (createVehicle && createAddress && createBankDetails && createDoc) {
  //     const updateDriver = await BikeDriverModel.updateOne(
  //       { _id: createDriver._id },
  //       {
  //         addressId: createAddress._id,
  //         bankDetailsId: createBankDetails._id,
  //         bikeDetailsId: createVehicle._id,
  //         docId: createDoc._id,
  //       }
  //     );
  //     return res.status(global.CONFIGS.responseCode.success).json({
  //       success: true,
  //       message: global.CONFIGS.api.DriverDetailsAdded,
  //       updateDriver: updateDriver,
  //     });
  //   }
  // },
  // /** */
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

  /** */
  deletevehicle: async (req, res, next) => {
      const { id } = req.params;
      let find_Driver = await BikeDriverModel.findOne({ _id: id });
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

      /* Delete BikeDriver*/
      const deletedDriver = await BikeDriverModel.findByIdAndRemove(id);

      if (!deletedDriver) {
        const err = new customError(
          global.CONFIGS.api.DriverNotfound,
          global.CONFIGS.responseCode.notFound
        );
        return next(err);
      }

      /* Delete Bank Details*/
      const deletedBankDetails = await DriverBankDetailsModel.findByIdAndRemove(
        deletedDriver.bankDetailsId
      );

      if (!deletedBankDetails) {
        const err = new customError(
          global.CONFIGS.api.driverBankDetailsNotfound,
          global.CONFIGS.responseCode.notFound
        );
        return next(err);
      }

      /* Delete Bike Details*/
      const deletedBikeDetails = await BikeModel.findByIdAndRemove(
        deletedDriver.bikeDetailsId
      );

      if (!deletedBikeDetails) {
        const err = new customError(
          global.CONFIGS.api.BikeDetailsNotfound,
          global.CONFIGS.responseCode.notFound
        );
        return next(err);
      }

      /* Delete Driver Documents*/
      const deletedDriverDoc = await DriverDocModel.findByIdAndRemove(
        deletedDriver.docId
      );
      if (!deletedDriverDoc) {
        const err = new customError(
          global.CONFIGS.api.DriverDocNotfound,
          global.CONFIGS.responseCode.notFound
        );
        return next(err);
      }
      /* Delete Driver Address*/
      const deletedDriverAddress = await DriverAddressModel.findByIdAndRemove(
        deletedDriver.addressId
      );
      if (!deletedDriverAddress) {
        const err = new customError(
          global.CONFIGS.api.driverAddressNotfound,
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
