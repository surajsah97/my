const common = require("../service/commonFunction");
var customError = require("../middleware/customerror");

module.exports={
processPayment:async(req,res,next)=>{
    var data = {
      authKey: process.env.PAYMENTAUTHKEY,
      storeId: process.env.PAYMENTSTOREID
 }
 return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: "Paymentgateway auth successfullY",
      data:data    
    });
},

refundPayment:async(req,res,next)=>{


 return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: "Payment refunded successfully",
      //message: global.CONFIGS.api.getProductSuccess,
      data    
    });
}
};