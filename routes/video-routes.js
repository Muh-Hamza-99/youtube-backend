const express = require("express");
const router = express.Router();

const {
    uploadVideo,
    stream,
    updateVideo,
} = require("./../controllers/video-controllers");

const videoUpload = require("../middleware/video-upload");
const protect = require("../middleware/protect");

router
    .route("/")
    .post(protect, videoUpload.single("video"), uploadVideo)
    .patch(updateVideo);

router
    .route("/:fileName")
    .get(stream);

module.exports = router;