const JWT = require("jsonwebtoken");

const User = require("./../models/User");

const signup = async (req, res) => {
    const { username, email, password } = req.body;
    const newUser = await User.create({ username, email, password });
    res.status(201).json({ status: "success", user: newUser });
};