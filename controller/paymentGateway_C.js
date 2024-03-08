const common = require("../service/commonFunction");
var customError = require("../middleware/customerror");

module.exports={
processPayment:async(req,res,next)=>{

const { amount, paymentId } = req.body;




 return res.status(global.CONFIGS.responseCode.success).json({
      success: true,
      message: "Payment processed successfullY",
      //message: global.CONFIGS.api.getProductSuccess,
      data    
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