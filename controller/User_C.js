var mongoose = require("mongoose");
const constants = require("../models/modelConstants");
const UserModel = mongoose.model(constants.UserModel);

module.exports = {
    UserSingup: async (req, res, next) => {
        console.log(req.body);
        try {
            var createuser = await UserModel.create(req.body);
            res.status(global.CONFIGS.responseCode.success).json({
                success: true,
                message: createuser
            })
            
        } catch (error) {
            console.log(error);
            res.status(global.CONFIGS.responseCode.exception).json({
                success: false,
                message: error.message
            })
        }
    }
}
