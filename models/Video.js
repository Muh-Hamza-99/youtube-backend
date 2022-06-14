const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    name: {
        type: String,
        required: [true, "Please enter a name for the video!"],
    },
    videoPath: {
        type: String,
        required: [true, "Video path is required to upload video!"],
        unique: [true, "Video path must be unique!"],
    },
    likes: {
        type: Number,
        default: 0,
    },
    dislikes: {
        type: Number,
        default: 0,
    },
    views: {
        type: Array,
        default: [],
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        }
    ],
});

const Video = mongoose.model("Video", videoSchema);

module.exports = Video;