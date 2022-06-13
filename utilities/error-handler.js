const AppError = require("./app-error");

const sendErrorDevelopment = (error, res) => {
    res.status(error.statusCode).json({
        status: error.status,
        error,
        message: error.message,
        stack: error.stack,
    });
};

const sendErrorProduction = (error, res) => {
    if (error.isOperational) {
        res.status(error.statusCode).json({ 
            status: error.status, 
            message: error.message, 
        });
    } else {
        console.log(`Oh no, something went wrong! ${error}`);
        res.status(500).json({ status: "error", message: "Something went very wrong!" });
    };
};

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
};

const handleDuplicateFieldDB = err => {
    const value = err.errmsg.match(/[^\1\\]|\\.)*?\1/);
    const message = `Duplicate field value: ${value}. Please use another value!`
    return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join(". ")}`;
    return new AppError(message, 400);
};

const handleJWTError = () => new AppError("Invalid token. Please log in again!", 401);

const handleJWTExpiredError = () => new AppError("Your token has expired! Please log in again!", 401);

const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if (process.env.NODE_ENV === "development") sendErrorDevelopment(err, res);
    else if (process.env.NODE_ENV === "production") {
        let error = { ...err };
        if (error.name === "CastError") error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldDB(error);
        if (error.name === "ValidationError") error = handleValidationErrorDB(error);
        if (error.name === "JsonWebTokenError") error = handleJWTError();
        if (error.name === "TokenExpiredError") error = handleJWTExpiredError();
        sendErrorProduction(err, res);
    };
};

module.exports = globalErrorHandler;