const JWT = require("jsonwebtoken");

const User = require("./../models/User");

const signup = async (req, res) => {
    const { username, email, password } = req.body;
    const newUser = await User.create({ username, email, password });
    res.status(201).json({ status: "success", user: newUser });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return;
    const user = await User.findOne({ email }).select("+password");
    if (!user || await user.correctPassword(password, user.password)) return;
    res.status(200).json({ status: "success", user });
};

module.exports = {
    signup,
    login,
};