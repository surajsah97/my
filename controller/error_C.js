  const customError = require("../middleware/customerror");


  module.exports = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = false;
    
  if (error.name === "CastError") {
    const message = `Resource not found. Invalid: ${error.path}`;
    error = new customError(message, 400);
  }

  // Mongoose duplicate key error for register user
  if (error.code === 11000) {
    const message = `Duplicate ${Object.keys(error.keyValue)} Entered`;
    error = new customError(message, 400);
  }

   // Wrong JWT error
  if (error.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, Try again `;
    error = new customError(message, 400);
  }

  // JWT EXPIRE error
  if (error.name === "TokenExpiredError") {
    const message = `Json Web Token is Expired, Try again `;
    error = new customError(message, 400);
  }
 

    return res.status(error.statusCode).json({
        success: error.status,
        message: error.message
    });

}