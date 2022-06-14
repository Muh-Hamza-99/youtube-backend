const IPInfoFinder = require("ip-info-finder");

const Video = require("./../models/Video");

const AppError = require("./../utilities/app-error");
const catchAsync = require("./../utilities/catch-async");

const addIP = catchAsync(async (req, res, next) => {
    const { videoID, IP } = req.params;
    const video = await Video.findById(videoID);
    if (!video) return next(new AppError("No video with the provided ID!", 400));
    await Video.findByIdAndUpdate(videoID, { $push: { views: IP } }, { runValidators: true, new: true });  
    next();  
});

module.exports = addIP;