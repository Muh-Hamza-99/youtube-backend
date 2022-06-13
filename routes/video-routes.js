const express = require("express");
const router = express.Router();

const {
    uploadVideo,
    stream,
    updateVideo,
    deleteVideo,
    likeVideo,
    dislikeVideo,
} = require("./../controllers/video-controllers");

const videoUpload = require("../middleware/video-upload");
const protect = require("../middleware/protect");

router
    .route("/")
    .post(protect, videoUpload.single("video"), uploadVideo);

router
    .route("/:videoID")
    .get(stream)
    .patch(protect, updateVideo)
    .delete(protect, deleteVideo)

router
    .route("/:videoID/like")
    .patch(protect, likeVideo);

router
    .route("/:videoID/dislike")
    .patch(protect, dislikeVideo);

module.exports = router;