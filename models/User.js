const crypto = require("crypto")

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
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
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

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    };
    return false;
};

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;