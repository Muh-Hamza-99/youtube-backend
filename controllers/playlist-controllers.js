const Video = require("./../models/Video");
const Playlist = require("./../models/Playlist");

const AppError = require("./../utilities/app-error");
const catchAsync = require("./../utilities/catch-async");

const createPlaylist = catchAsync(async (req, res, next) => {
    const { videoID } = req.params;
    const newPlaylist = await Playlist.create({ owner: req.token.id, playlistName: req.body.name });
    newPlaylist.videos.push(videoID);
    await newPlaylist.save()
    res.status(201).json({ status: "success", playlist: newPlaylist });
});

const addToPlaylist = catchAsync(async (req, res, next) => {
    const { videoID } = req.params;
    if (!await Video.findById(videoID)) return next(new AppError("No video with the provided ID!", 400));
    const playlist = await Playlist.findOneAndUpdate({ owner: req.token.id }, { $push: { videos: videoID } });
    res.status(200).json({ status: "success", playlist });
});

module.exports = {
    createPlaylist,
    addToPlaylist,
};