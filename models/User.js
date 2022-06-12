const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please enter your username!"],
        unique: [true, "Account with this username is already taken!"],
    },
    email: {
        type: String,
        required: [true, "Please enter your email!"],
        unique: [true, "Account with this email is already taken!"],
    },
    password: {
        type: String,
        required: [true, "Password is required!"],
        minlength: 8,
        select: false,
    },
    videos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        },
    ],
    subscribers: {
        type: Array,
        default: [],
    },
    subscribedChannels: {
        type: Array, 
        default: [],
    },
});

const User = mongoose.model("User", userSchema);

module.exports = User;