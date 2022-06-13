const Video = require("../models/Video");

const isOwner = videoID => {
    return (req, res, next) => {
        const video = await Video.findById(videoID);
        if (video.owner !== req.token._id.toString()) return;
        next();
    };
};

module.exports = isOwner;