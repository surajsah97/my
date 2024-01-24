var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const DriverModel = mongoose.model(constants.DriverModel);
const DriverDocModel = mongoose.model(constants.DriverDocModel);
const DriverAddressModel = mongoose.model(constants.DriverAddressModel);
const DriverBankDetailsModel = mongoose.model(constants.DriverBankDetailsModel);
const ObjectId = mongoose.Types.ObjectId;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const common = require("../service/commonFunction");
var customError = require('../middleware/customerror');


module.exports = {

    addDriver: async (req, res, next) => {

        var find_Driver = await DriverModel.findOne({
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
        var passportImg = {};
        var emiratesIdImg = {};
        var licenseImg = {};
        if (req.files.passportImgFront && req.files.passportImgBack) {
            passportImg.frontImg = `uploads/driver/${req.files.passportImgFront[0].filename}`
            passportImg.backImg = `uploads/driver/${req.files.passportImgBack[0].filename}`
            req.body.passportImg = passportImg;
        }
        if (req.files.emiratesIdImgFront && req.files.emiratesIdImgBack) {
            emiratesIdImg.frontImg = `uploads/driver/${req.files.emiratesIdImgFront[0].filename}`
            emiratesIdImg.backImg = `uploads/driver/${req.files.emiratesIdImgBack[0].filename}`
            req.body.emiratesIdImg = emiratesIdImg;
        }
        if (req.files.licenseImgFront && req.files.licenseImgBack) {
            licenseImg.frontImg = `uploads/driver/${req.files.licenseImgFront[0].filename}`
            licenseImg.backImg = `uploads/driver/${req.files.licenseImgBack[0].filename}`
            req.body.licenseImg = licenseImg;
        }
        if (req.files.visaImg) {
            req.body.visaImg = `uploads/driver/${req.files.visaImg[0].filename}`
        }
        if (req.files.driverImg) {
            req.body.driverImg = `uploads/driver/${req.files.driverImg[0].filename}`
        }
        
        
        const salt = await bcrypt.genSaltSync(global.CONFIGS.pass.saltround);
        const hash = await bcrypt.hashSync(req.body.password, salt);
        req.body.password = hash;

        var create_driver = await DriverModel.create(req.body);
        if (create_driver) {
            req.body.driverId = create_driver._id;
            var create_doc = await DriverDocModel.create(req.body);
            var create_bankDetails = await DriverBankDetailsModel.create(req.body);
            var localAddress = {
                houseNo: req.body.lHouseNo,
                buildingName: req.body.lBuildingName,
                street: req.body.lStreet,
                landmark: req.body.lLandmark,
            };
            var homeCountryAddress= {
                houseNo: req.body.hcHouseNo,
                buildingName: req.body.hcBuildingName,
                street: req.body.hcStreet,
                landmark: req.body.hcLandmark,
                city: req.body.hcCity,
                state: req.body.hcState,
                pinCode: req.body.hcPinCode,
            }
            var emergencyContact= {
                namr: req.body.ecName,
                relation: req.body.ecRelation,
                mobile: req.body.ecMobile
            }
            var create_address = await DriverAddressModel.create({ emergencyContact: emergencyContact, homeCountryAddress: homeCountryAddress, localAddress: localAddress, driverId: create_driver._id });
            if (create_address && create_bankDetails && create_doc) {
                var update_driver = await DriverModel.updateOne({ _id: create_driver._id }, { addressId: create_address._id, bankDetailsId: create_bankDetails._id, docId: create_doc._id, });
                return res.status(global.CONFIGS.responseCode.success).json({
                    success: true,
                    message: global.CONFIGS.api.Productadded,
                    // data: create_vehicle
                })
            }
        }
        
    },

    login: async (req, res, next) => {
 
        var find_user = await DriverModel.findOne({ mobile: req.body.mobile });
        if (!find_user) {
            const err = new customError(global.CONFIGS.api.userNotFound, global.CONFIGS.responseCode.notFoud);
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
        var find_user = await DriverModel.findOne({ mobile: req.body.mobile });
        if (!find_user) {
            const err = new customError(global.CONFIGS.api.userNotFound, global.CONFIGS.responseCode.notFoud);
            return next(err);

        }
        var otp = common.randomNumber();
        var update_user = await DriverModel.updateOne({ _id: find_user._id }, {
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
        var find_user = await DriverModel.findOne({ mobile: req.body.mobile });
        if (!find_user) {
            const err = new customError(global.CONFIGS.api.userNotFound, global.CONFIGS.responseCode.notFoud);
            return next(err);
        }
        var otp = common.randomNumber();
        var update_user = await DriverModel.updateOne({ _id: find_user._id }, {
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
        var find_user = await DriverModel.findOne({ mobile: req.body.mobile });
        if (!find_user) {
            const err = new customError(global.CONFIGS.api.userNotFound, global.CONFIGS.responseCode.notFoud);
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
        var update_user = await DriverModel.updateOne({ _id: find_user._id }, { password: hash });

        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.changePasswordSuccess,
        })
    },

    changePass: async (req, res, next) => {
        var find_user = await DriverModel.findOne({ mobile: req.body.mobile });
        if (!find_user) {
            const err = new customError(global.CONFIGS.api.userNotFound, global.CONFIGS.responseCode.notFoud);
            return next(err);
        }
        const match = await bcrypt.compare(req.body.oldPassword, find_user.password);
        if (!match) {
            const err = new customError(global.CONFIGS.api.matchPasswordFail, global.CONFIGS.responseCode.Unauthorized);
            return next(err);
        }
        const salt = await bcrypt.genSaltSync(global.CONFIGS.pass.saltround);
        const hash = await bcrypt.hashSync(req.body.newPassword, salt);
        var update_user = await DriverModel.updateOne({ _id: find_user._id }, { password: hash });

        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.changePasswordSuccess,
        })
    },

    

    getDriverProfile: async (req, res, next) => {
        // console.log(req.body);
        var find_user = await DriverModel.aggregate([
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
            const err = new customError(global.CONFIGS.api.getUserDetailsFail, global.CONFIGS.responseCode.notFoud);
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

    getDriverAdmin: async (req, res, next) => {
        const limit = parseInt(req.query.limit) || 20; // docs in single page
        const pageNo = parseInt(req.query.pageNo) || 1; //  page number
        const skip = (pageNo - 1) * limit;

        var find_user = await DriverModel.aggregate([
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
            const err = new customError(global.CONFIGS.api.getUserDetailsFail, global.CONFIGS.responseCode.notFoud);
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

    driverDelete: async (req, res, next) => {
        var delete_doc = await DriverAddressModel.deleteOne({ driverId: req.params.id });
        var delete_bank_details = await DriverBankDetailsModel.deleteOne({ driverId: req.params.id });
        var delete_address = await DriverDocModel.deleteOne({ driverId: req.params.id });
        var delete_driver = await DriverModel.deleteOne({ _id: req.params.id });
        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.categoryDelete,
        })
    },

}
