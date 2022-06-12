const JWT = require("jsonwebtoken");

const User = require("./../models/User");

const signToken = id => JWT.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_TOKEN_EXPIRES_IN });

const signup = async (req, res) => {
    const { username, email, password } = req.body;
    const newUser = await User.create({ username, email, password });
    const token = signToken(newUser._id);
    res.status(201).json({ status: "success", token });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return;
    const user = await User.findOne({ email }).select("+password");
    if (!user || await user.correctPassword(password, user.password)) return;
    const token = signToken(user._id);
    res.status(200).json({ status: "success", token });
};

module.exports = {
    signup,
    login,
};