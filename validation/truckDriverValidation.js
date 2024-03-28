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

module.exports = validationSchema;