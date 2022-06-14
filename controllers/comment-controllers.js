const Comment = require("./../models/Comment");
const Video = require("./../models/Video");

const AppError = require("./../utilities/app-error");
const catchAsync = require("./../utilities/catch-async");

const getComments = catchAsync(async (req, res, next) => {
    const { videoID } = req.params;
    const video = await Video.findById(videoID).populate({ path: "comments", populate: { path: "replies", model: "Comment" } });
    if (!video) return next(new AppError("No video with the provided ID!", 400));
    res.status(200).json({ status: "success", comments: video.comments })
})

const commentOnVideo = catchAsync(async (req, res, next) => {
    const { videoID } = req.params;
    if (!await Video.findById(videoID)) return next(new AppError("There exists no video with the provided ID!"));
    if (!req.body.comment) return next(new AppError("There is no text to comment!"));
    const newComment = await Comment.create({ owner: req.token.id, comment: req.body.comment });
    await Video.findByIdAndUpdate(videoID, { $push: { comments: newComment._id } });
    res.status(201).json({ status: "success", comment: newComment });
});

const replyToComment = catchAsync(async (req, res, next) => {
    const { videoID, commentID } = req.params;
    if (!await Video.findById(videoID) || !await Comment.findById(commentID)) return next(new AppError("There exists no video/comment with the provided ID!"));
    const newComment = await Comment.create({ owner: req.token.id, comment: req.body.comment });
    await Comment.findByIdAndUpdate(commentID, { $push: { replies: newComment._id } });
    res.status(201).json({ status: "success", comment: newComment });
});

module.exports = {
    getComments,
    commentOnVideo,
    replyToComment,
};