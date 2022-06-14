const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    videos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video",
        },
    ],
    playlistName: {
        type: String,
        required: [true, "Playlist name is required!"],
    },
});

const Playlist = mongoose.model("Playlist", playlistSchema);

module.exports = Playlist;