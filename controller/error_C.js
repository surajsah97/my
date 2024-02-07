module.exports = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = false;
    return res.status(error.statusCode).json({
        success: error.status,
        message: error.message
    });

}