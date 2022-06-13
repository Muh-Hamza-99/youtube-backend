const express = require("express");
const router = express.Router();

const {
    uploadVideo,
    stream,
    updateVideo,
    deleteVideo,
} = require("./../controllers/video-controllers");

const videoUpload = require("../middleware/video-upload");
const protect = require("../middleware/protect");

router.post(protect, videoUpload.single("video"), uploadVideo);

router
    .route("/:videoID")
    .get(stream)
    .delete(deleteVideo)
    .patch(updateVideo);

module.exports = router;