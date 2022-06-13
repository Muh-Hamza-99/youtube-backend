const express = require("express");
const router = express.Router();

const {
    uploadVideo,
    stream,
    updateVideo,
    deleteVideo,
    likeVideo,
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
    .patch(protect, likeVideo);

module.exports = router;