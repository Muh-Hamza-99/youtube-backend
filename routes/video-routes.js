const express = require("express");
const router = express.Router();

const {
    uploadVideo,
} = require("./../controllers/video-controllers");

const videoUpload = require("../middleware/video-upload");
const protect = require("../middleware/protect");

router.get("/test", protect, videoUpload.single("video"), uploadVideo);

module.exports = router;