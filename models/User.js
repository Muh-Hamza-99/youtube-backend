const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

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

userSchema.pre("save", async function(next) {
    if (this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.correctPassword = async function(providedPassword, userPassword) {
    return await bcrypt.compare(providedPassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;