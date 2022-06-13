const JWT = require("jsonwebtoken");

const User = require("./../models/User");

const AppError = require("./../utilities/app-error");
const catchAsync = require("./../utilities/catch-async");

const signToken = id => JWT.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_TOKEN_EXPIRES_IN });

const signup = catchAsync(async (req, res, next) => {
    const { username, email, password } = req.body;
    const newUser = await User.create({ username, email, password });
    const token = signToken(newUser._id);
    res.status(201).json({ status: "success", token });
});

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) return next(new AppError("Required credentials not provided!", 400));
    const user = await User.findOne({ email }).select("+password");
    if (!user || await user.correctPassword(password, user.password)) next(new AppError("Invalid credentials provided!", 400));
    const token = signToken(user._id);
    res.status(200).json({ status: "success", token });
});

module.exports = {
    signup,
    login,
};