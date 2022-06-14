const User = require("./../models/User");

const AppError = require("./../utilities/app-error");
const catchAsync = require("./../utilities/catch-async");

const subscribe = catchAsync(async (req, res, next) => {
    const { userID } = req.params;
    const user = await User.findByIdAndUpdate(userID, { $push: { subscribers: req.token.id } });
    if (!user) return next(new AppError("The user with the provided ID does not exist!", 400));
    await User.findByIdAndUpdate(req.token.id, { $push: { subscribedChannels: userID } });
    res.status(200).json({ status: "success", user })
});

const unSubscribe = catchAsync(async (req, res, next) => {
    const { userID } = req.params;
    const subscribedToUser = await User.findById(userID);
    if (!subscribedToUser.subscribedChannels.includes(req.token.id)) return next(new AppError("You are not subscribed to this channel!", 400));
    const userIndex = subscribedToUser.indexOf(req.token.id);
    subscribedToUser.slice(userIndex, 1);
    await subscribedToUser.save();
    const subscribedUser = await User.findById(req.token.id);
    const subscribedUserIndex = subscribedUser.indexOf(userID);
    subscribedUser.slice(subscribedUserIndex, 1);
    await subscribedUser.save();
    res.status(200).json({ status: "success", user: subscribedUser });
});

module.exports = {
    subscribe,
    unSubscribe,
};