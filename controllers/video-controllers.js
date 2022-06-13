const fs = require("fs");

const Video = require("./../models/Video");

const AppError = require("./../utilities/app-error");
const catchAsync = require("./../utilities/catch-async");

const isOwner = async (videoID) => {
    const video = await Video.findById(videoID);
    if (video.owner !== req.token.id.toString()) return false;
    return true;
};

const uploadVideo = catchAsync(async (req, res, next) => {
    const newVideo = await Video.create({ owner: req.token.id, name: req.body.name, videoPath: req.fileName });
    res.status(201).json({ status: "success", video: newVideo });
});

const stream = catchAsync(async (req, res, next) => {
    const { videoID } = req.params;
    const { range } = req.headers;
    if (!range) return next(new AppError("Please provide a range for the video!", 400));
    const video = await Video.findById(videoID);
    if (!video) return next(new AppError("No video with the provided ID!", 400));
    const videoPath = `videos/${video.videoPath}`;
    const videoSize = fs.statSync(videoPath).size;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + 10**6, videoSize - 1);
    const headers = { "Content-Length": end - start + 1, "Accept-Range": "bytes", "Content-Type": "video/mp4", "Content-Range": `bytes ${start - end/videoSize}` };
    const videoStream = fs.createReadStream(videoPath, { start, end });
    res.writeHead(206, headers);
    videoStream.pipe(res);
});

const updateVideo = catchAsync(async (req, res, next) => {
    const { videoID } = req.params;
    const { name } = req.body;
    if (!isOwner(videoID)) return next(new AppError("You are not the owner of this video!", 403));
    const video = await Video.findByIdAndUpdate(videoID, { name }, { runValidators: true, new: true });
    res.status(200).json({ status: "success", video });
});

const deleteVideo = catchAsync(async (req, res, next) => {
    const { videoID } = req.params;
    const video = await Video.findById(videoID);
    if (!video) return next(new AppError("No video with the provided ID!", 400));
    const videoPath = `videos/${video.videoPath}`;
    if (!fs.existsSync(videoPath)) return next(new AppError("No video with the persisted path!", 400));
    fs.unlink(videoPath, async (error) => {
        if (error) return next(new AppError("Error in deleting video!", 500));
        if (!isOwner(videoID)) return next(new AppError("You are not the owner of this video!", 403));
        await Video.findByIdAndDelete(videoID);
        return res.status(204).json({ status: "success", video: null });
    });
});

const likeVideo = catchAsync(async (req, res, next) => {
    const { videoID } = req.params;
    const video = await Video.findByIdAndUpdate(videoID, { $inc: { likes: 1 } }, { runValidators: true, new: true });
    if (!video) return next(new AppError("No video with the provided ID!", 400));
    res.status(204).json({ status: "success", video });
});

const dislikeVideo = catchAsync(async (req, res, next) => {
    const { videoID } = req.params;
    const video = await Video.findByIdAndUpdate(videoID, { $inc: { dislikes: 1 } }, { runValidators: true, new: true });
    if (!video) return next(new AppError("No video with the provided ID!", 400));
    res.status(204).json({ status: "success", video });
});

module.exports = {
    uploadVideo,
    stream,
    updateVideo,
    deleteVideo,
    likeVideo,
    dislikeVideo,
};