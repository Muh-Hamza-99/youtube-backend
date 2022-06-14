const JWT = require("jsonwebtoken");

const User = require("./../models/User");

const AppError = require("./../utilities/app-error");
const catchAsync = require("./../utilities/catch-async");

const signToken = id => JWT.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_TOKEN_EXPIRES_IN });

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
    };
    res.cookie("jwt", token, cookieOptions);
    user.password = undefined;
    res.status(statusCode).json({ status: "success", token });
};

const signup = catchAsync(async (req, res, next) => {
    const { username, email, password } = req.body;
    const newUser = await User.create({ username, email, password });
    createSendToken(newUser, 201, res);
});

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) return next(new AppError("Required credentials not provided!", 400));
    const user = await User.findOne({ email }).select("+password");
    if (!user || await user.correctPassword(password, user.password)) return next(new AppError("Invalid credentials provided!", 400));
    createSendToken(user, 201, res);
});

module.exports = {
    signup,
    login,
};