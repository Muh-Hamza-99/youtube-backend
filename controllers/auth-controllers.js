const crypto = require("crypto");

const JWT = require("jsonwebtoken");

const User = require("./../models/User");

const AppError = require("./../utilities/app-error");
const catchAsync = require("./../utilities/catch-async");
const sendEmail = require("./../utilities/send-email");

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

const updatePassword = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { password, passwordCurrent } = req.body;
    const user = await User.findById(id).select("+password");
    if (!user || !(await user.correctPassword(passwordCurrent, user.password)))
        return next(new AppError("Your current password is incorrect!", 401));
    user.password = password;
    await user.save();
    createSendToken(user, 204, res);
});

const forgotPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(new AppError("There is no user with the provided email address!", 404));
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
    try {
        await sendEmail({ email: user.email, subject: "Password reset token is valid for 10 minutes!", message });
        res.status(200).json({ status: "success", message: `Token sent to your email! => ${user.email}` });
    } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new AppError("An error has occurred when sending the email!", 500));
    };
});

const resetPassword = catchAsync(async (req, res, next) => {
    const { token } = req.params;
    const { password } = req.body;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });
    if (!user) return next(new AppError("Token is invalid/has expired!", 400));
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    createSendToken(user, 200, res);
});

module.exports = {
    signup,
    login,
    updatePassword,
    forgotPassword,
    resetPassword,
};