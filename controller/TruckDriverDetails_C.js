var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const TruckDriverModel = mongoose.model(constants.TruckDriverModel);
const TruckDriverDocModel = mongoose.model(constants.TruckDriverDocModel);
const TruckDriverAddressModel = mongoose.model(constants.TruckDriverAddressModel);
const TruckDriverBankDetailsModel = mongoose.model(constants.TruckDriverBankDetailsModel);
const ObjectId = mongoose.Types.ObjectId;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const common = require("../service/commonFunction");
var customError = require('../middleware/customerror');
const Joi = require('joi');

const validationSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    mobile: Joi.number().required(),
    altMobile: Joi.number().required(),
    password: Joi.string().required(),
    nationality: Joi.string().required(),
    passportNumber: Joi.string().required(),
    passportValidity: Joi.string().required(),
    visaNumber: Joi.number().required(),
    visaValidity: Joi.string().required(),
    emiratesId: Joi.string().required(),
    emiratesIdValidity: Joi.string().required(),
    InsuranceComp: Joi.string().required(),
    insuranceValidity: Joi.string().required(),
    licenseNumber: Joi.string().required(),
    licenseCity: Joi.string().required(),
    licenseType: Joi.string().required(),
    licenseValidity: Joi.string().required(),
    lHouseNo: Joi.string().required(),
    lBuildingName: Joi.string().required(),
    lStreet: Joi.string().required(),
    lLandmark: Joi.string().required(),
    hcHouseNo: Joi.string().required(),
    hcBuildingName: Joi.string().required(),
    hcStreet: Joi.string().required(),
    hcLandmark: Joi.string().required(),
    hcCity: Joi.string().required(),
    hcState: Joi.string().required(),
    hcPinCode: Joi.string().required(),
    ecName: Joi.string().required(),
    ecRelation: Joi.string().required(),
    ecMobile: Joi.number().required(),
    bankName: Joi.string().required(),
    branchName: Joi.string().required(),
    accountNumber: Joi.string().required(),
    accountHolderName: Joi.string().required(),
    IBAN: Joi.string().required(),
    
});


module.exports = {

    addTruckDriver: async (req, res, next) => {
         const validationResult = validationSchema.validate(req.body);
        if (validationResult.error) {
            const err = new customError(validationResult.error.message, global.CONFIGS.responseCode.validationError);
            return next(err);
        }

        const fileFields = [
            'passportImgFront',
            'passportImgBack',
            'emiratesIdImgFront',
            'emiratesIdImgBack',
            'licenseImgFront',
            'licenseImgBack',
            'visaImg',
            'driverImg'
        ];
        for (const field of fileFields) {
            if (!req.files[field]) {
                const err = new customError(`File upload for field '${field}' is missing.`, global.CONFIGS.responseCode.validationError);
                return next(err);
            }
        }


        const find_Driver = await TruckDriverModel.findOne({
            $or: [
                { mobile: req.body.mobile },
                { licenseNumber: req.body.licenseNumber },
                { visaNumber: req.body.visaNumber },
                { emiratesId: req.body.emiratesId }
            ]
        });
        console.log(find_Driver)
        if (find_Driver) {
            const err = new customError(global.CONFIGS.api.Productalreadyadded, global.CONFIGS.responseCode.alreadyExist);
            return next(err);
        }
        // console.log(req.files)
        const passportImg = {};
        const emiratesIdImg = {};
        const licenseImg = {};
        if (req.files.passportImgFront && req.files.passportImgBack) {
            passportImg.frontImg = `uploads/truckdriver/${req.files.passportImgFront[0].filename}`
            passportImg.backImg = `uploads/truckdriver/${req.files.passportImgBack[0].filename}`
            req.body.passportImg = passportImg;
        }
        if (req.files.emiratesIdImgFront && req.files.emiratesIdImgBack) {
            emiratesIdImg.frontImg = `uploads/truckdriver/${req.files.emiratesIdImgFront[0].filename}`
            emiratesIdImg.backImg = `uploads/truckdriver/${req.files.emiratesIdImgBack[0].filename}`
            req.body.emiratesIdImg = emiratesIdImg;
        }
        if (req.files.licenseImgFront && req.files.licenseImgBack) {
            licenseImg.frontImg = `uploads/truckdriver/${req.files.licenseImgFront[0].filename}`
            licenseImg.backImg = `uploads/truckdriver/${req.files.licenseImgBack[0].filename}`
            req.body.licenseImg = licenseImg;
        }
        if (req.files.visaImg) {
            req.body.visaImg = `uploads/truckdriver/${req.files.visaImg[0].filename}`
        }
        if (req.files.driverImg) {
            req.body.driverImg = `uploads/truckdriver/${req.files.driverImg[0].filename}`
        }
        const salt = await bcrypt.genSaltSync(global.CONFIGS.pass.saltround);
        const hash = await bcrypt.hashSync(req.body.password, salt);
        req.body.password = hash;

        let truckDRiverDetails={};
        truckDRiverDetails.name = req.body.name;
        truckDRiverDetails.email = req.body.email;
        truckDRiverDetails.password = req.body.password;
        truckDRiverDetails.mobile = req.body.mobile;
        truckDRiverDetails.altMobile = req.body.altMobile;
        truckDRiverDetails.nationality = req.body.nationality;
        truckDRiverDetails.passportNumber = req.body.passportNumber;
        truckDRiverDetails.passportValidity = req.body.passportValidity;
        truckDRiverDetails.visaNumber = req.body.visaNumber;
        truckDRiverDetails.visaValidity = req.body.visaValidity;
        truckDRiverDetails.emiratesId = req.body.emiratesId;
        truckDRiverDetails.emiratesIdValidity = req.body.emiratesIdValidity;
        truckDRiverDetails.InsuranceComp = req.body.InsuranceComp;
        truckDRiverDetails.insuranceValidity = req.body.insuranceValidity;
        truckDRiverDetails.licenseNumber = req.body.licenseNumber;
        truckDRiverDetails.licenseCity = req.body.licenseCity;
        truckDRiverDetails.licenseType = req.body.licenseType;
        truckDRiverDetails.licenseValidity = req.body.licenseValidity;
        truckDRiverDetails.addressId = req.body.addressId;
        truckDRiverDetails.bankDetailsId = req.body.bankDetailsId;
        truckDRiverDetails.docId = req.body.docId;
        truckDRiverDetails.isVerified = req.body.isVerified;
        truckDRiverDetails.driverType = req.body.driverType;
        truckDRiverDetails.activeStatus = req.body.activeStatus;
        const create_driver = await TruckDriverModel.create(truckDRiverDetails);
        if (create_driver) {
            req.body.driverId = create_driver._id;
            let driverDoc={};
            driverDoc.passportImg=passportImg;
            driverDoc.emiratesIdImg=emiratesIdImg;
            driverDoc.licenseImg=licenseImg;
            driverDoc.driverImg=req.body.driverImg;
            driverDoc.visaImg=req.body.visaImg;
            driverDoc.driverId=req.body.driverId;
            driverDoc.activeStatus=req.body.activeStatus;
            
            const create_doc = await TruckDriverDocModel.create(driverDoc);
            const create_bankDetails = await TruckDriverBankDetailsModel.create(req.body);

            const localAddress = {
                houseNo: req.body.lHouseNo,
                buildingName: req.body.lBuildingName,
                street: req.body.lStreet,
                landmark: req.body.lLandmark,
            };
            const homeCountryAddress= {
                houseNo: req.body.hcHouseNo,
                buildingName: req.body.hcBuildingName,
                street: req.body.hcStreet,
                landmark: req.body.hcLandmark,
                city: req.body.hcCity,
                state: req.body.hcState,
                pinCode: req.body.hcPinCode,
            }
            const emergencyContact= {
                name: req.body.ecName,
                relation: req.body.ecRelation,
                mobile: req.body.ecMobile
            }
            const create_address = await TruckDriverAddressModel.create({ emergencyContact: emergencyContact, homeCountryAddress: homeCountryAddress, localAddress: localAddress, driverId: create_driver._id });
            if (create_address && create_bankDetails && create_doc) {
                var update_driver = await TruckDriverModel.updateOne({ _id: create_driver._id }, { addressId: create_address._id, bankDetailsId: create_bankDetails._id, docId: create_doc._id, });
                return res.status(global.CONFIGS.responseCode.success).json({
                    success: true,
                    message: global.CONFIGS.api.Productadded,
                    // data: create_vehicle
                })
            }
        }
        
    },

    login: async (req, res, next) => {
        var find_user = await TruckDriverModel.findOne({ mobile: req.body.mobile });
        if (!find_user) {
            const err = new customError(global.CONFIGS.api.userNotFound, global.CONFIGS.responseCode.notFound);
            return next(err);
        }

        const match = await bcrypt.compare(req.body.password, find_user.password);
        if (!match) {
            const err = new customError(global.CONFIGS.api.loginFail, global.CONFIGS.responseCode.Unauthorized);
            return next(err);
        }
        const payload = { mobile: find_user.mobile, _id: find_user._id };
        const options = {
            expiresIn: global.CONFIGS.token.apiTokenExpiry,
            issuer: "Dudhu",
        };
        const secret = process.env.SECRETKEY;
        const token = await jwt.sign(payload, secret, options);

        console.log(token)
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.loginSuccess,
            data: {
                "driverId": find_user._id,
                "name": find_user.name,
                "email": find_user.email,
                "mobile": find_user.mobile,
                "driverType": find_user.driverType,
                "activeStatus": find_user.activeStatus,
                "token": token
            },
        })
    },

    reSendOtp: async (req, res, next) => {
        var find_user = await TruckDriverModel.findOne({ mobile: req.body.mobile });
        if (!find_user) {
            const err = new customError(global.CONFIGS.api.userNotFound, global.CONFIGS.responseCode.notFound);
            return next(err);

        }
        var otp = common.randomNumber();
        var update_user = await TruckDriverModel.updateOne({ _id: find_user._id }, {
            Otp: otp,
            OtpsendDate: new Date(),
        });
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.sendOtpSuccess,
            data: {
                "Otp": otp
            },
        })
    },

    forgetPass: async (req, res, next) => {
        var find_user = await TruckDriverModel.findOne({ mobile: req.body.mobile });
        if (!find_user) {
            const err = new customError(global.CONFIGS.api.userNotFound, global.CONFIGS.responseCode.notFound);
            return next(err);
        }
        var otp = common.randomNumber();
        var update_user = await TruckDriverModel.updateOne({ _id: find_user._id }, {
            Otp: otp,
            OtpsendDate: new Date(),
        });
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.sendOtpSuccess,
            data: {
                "Otp": otp
            },
        })
    },

    resetPass: async (req, res, next) => {
        var find_user = await TruckDriverModel.findOne({ mobile: req.body.mobile });
        if (!find_user) {
            const err = new customError(global.CONFIGS.api.userNotFound, global.CONFIGS.responseCode.notFound);
            return next(err);
        }
        if (find_user.Otp != req.body.Otp) {
            const err = new customError(global.CONFIGS.api.verifyOtpFail, global.CONFIGS.responseCode.Unauthorized);
            return next(err);
        }
        var timediff = common.datediff(find_user.OtpsendDate);
        console.log("timediff= ", timediff);
        if (timediff > global.CONFIGS.OtpTimeLimit.limit) {
            const err = new customError(global.CONFIGS.api.verifyOtpexp, global.CONFIGS.responseCode.Unauthorized);
            return next(err);
        }

        const salt = await bcrypt.genSaltSync(global.CONFIGS.pass.saltround);
        const hash = await bcrypt.hashSync(req.body.password, salt);
        var update_user = await TruckDriverModel.updateOne({ _id: find_user._id }, { password: hash });

        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.changePasswordSuccess,
        })
    },

    changePass: async (req, res, next) => {
        var find_user = await TruckDriverModel.findOne({ mobile: req.body.mobile });
        if (!find_user) {
            const err = new customError(global.CONFIGS.api.userNotFound, global.CONFIGS.responseCode.notFound);
            return next(err);
        }
        const match = await bcrypt.compare(req.body.oldPassword, find_user.password);
        if (!match) {
            const err = new customError(global.CONFIGS.api.matchPasswordFail, global.CONFIGS.responseCode.Unauthorized);
            return next(err);
        }
        const salt = await bcrypt.genSaltSync(global.CONFIGS.pass.saltround);
        const hash = await bcrypt.hashSync(req.body.newPassword, salt);
        var update_user = await TruckDriverModel.updateOne({ _id: find_user._id }, { password: hash });

        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.changePasswordSuccess,
        })
    },

    getDriverProfile: async (req, res, next) => { 
        // console.log(req.body);
        var find_user = await TruckDriverModel.aggregate([
            {
                $match: { activeStatus: "1", _id: new ObjectId(req.query.driverId) }
            },
            {
                $lookup:
                {
                    from: "driverbankdetails",
                    localField: "bankDetailsId",
                    foreignField: "_id",
                    as: "driverbankdetails"
                }
            },
            { $unwind: '$driverbankdetails' },
            { $unset: 'bankDetailsId' },
            {
                $lookup:
                {
                    from: "driveraddress",
                    localField: "addressId",
                    foreignField: "_id",
                    as: "driveraddress"
                }
            },
            { $unwind: '$driveraddress' },
            { $unset: 'addressId' },
            {
                $lookup:
                {
                    from: "driverdoc",
                    localField: "docId",
                    foreignField: "_id",
                    as: "driverdoc"
                }
            },
            { $unwind: '$driverdoc' },
            { $unset: 'docId' },
            {
                $sort: {
                    _id: -1
                }
            },
            // {
            //     '$facet': {
            //         metadata: [{ $count: "total" }, { $addFields: { page: pageNo } }],
            //         data: [{ $skip: skip }, { $limit: limit }] // add projection here wish you re-shape the docs
            //     }
            // }

        ]);
        // return res.send(find_user)
        if (find_user.length == 0) {
            const err = new customError(global.CONFIGS.api.getUserDetailsFail, global.CONFIGS.responseCode.notFound);
            return next(err);
        }
        // var totalPage = Math.ceil(parseInt(find_user[0].metadata[0].total) / limit);
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.getUserDetailsSuccess,
            // totalPage: totalPage,
            data: find_user
        })


    },

    getTruckDriverListAdmin: async (req, res, next) => {
        const limit = parseInt(req.query.limit) || 20; // docs in single page
        const pageNo = parseInt(req.query.pageNo) || 1; //  page number
        const skip = (pageNo - 1) * limit;

        var find_user = await TruckDriverModel.aggregate([
            {
                $match: { activeStatus: "1", driverType : req.query.driverType }
            },
            {
                $lookup:
                {
                    from: "driverbankdetails",
                    localField: "bankDetailsId",
                    foreignField: "_id",
                    as: "driverbankdetails"
                }
            },
            { $unwind: '$driverbankdetails' },
            { $unset: 'bankDetailsId' },
            {
                $lookup:
                {
                    from: "driveraddress",
                    localField: "addressId",
                    foreignField: "_id",
                    as: "driveraddress"
                }
            },
            { $unwind: '$driveraddress' },
            { $unset: 'addressId' },
            {
                $lookup:
                {
                    from: "driverdoc",
                    localField: "docId",
                    foreignField: "_id",
                    as: "driverdoc"
                }
            },
            { $unwind: '$driverdoc' },
            { $unset: 'docId' },
            {
                $sort: {
                    _id: -1
                }
            },
            {
                '$facet': {
                    metadata: [{ $count: "total" }, { $addFields: { page: pageNo } }],
                    data: [{ $skip: skip }, { $limit: limit }] // add projection here wish you re-shape the docs
                }
            }

        ]);
        // return res.send(find_user)
        if (find_user[0].data.length == 0) {
            const err = new customError(global.CONFIGS.api.getUserDetailsFail, global.CONFIGS.responseCode.notFound);
            return next(err);
        }
        var totalPage = Math.ceil(parseInt(find_user[0].metadata[0].total) / limit);
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.getUserDetailsSuccess,
            totalPage: totalPage,
            data: find_user[0].data
        })

    },

    truckDriverDelete: async (req, res, next) => {
        var delete_doc = await TruckDriverAddressModel.deleteOne({ driverId: req.params.id });
        var delete_bank_details = await TruckDriverBankDetailsModel.deleteOne({ driverId: req.params.id });
        var delete_address = await TruckDriverDocModel.deleteOne({ driverId: req.params.id });
        var delete_driver = await TruckDriverModel.deleteOne({ _id: req.params.id });
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.categoryDelete,
        })
    },

}
