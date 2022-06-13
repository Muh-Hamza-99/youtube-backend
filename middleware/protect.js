const { promisify } = require("util");

const JWT = require("jsonwebtoken");

const User = require("./../models/User");

const AppError = require("./../utilities/app-error");
const catchAsync = require("./../utilities/catch-async");

const protect = catchAsync(async (req, res, next) => {
    let token;
    const { authorisation } = req.headers;
    if (authorisation && authorisation.startsWith("Bearer")) token = authorisation.split(" ")[1];
    if (!token) return next(new AppError("No/Invalidly formatted token provided!"));
    const decoded = await promisify(JWT.verify)(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return next(new AppError("No user with the ID provided in the token!"));
    req.token = decoded;
    req.user = user;
    next();
});

module.exports = protect;