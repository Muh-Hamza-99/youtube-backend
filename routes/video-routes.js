const express = require("express");
const router = express.Router();

const {
    uploadVideo,
    stream,
    updateVideo,
} = require("./../controllers/video-controllers");

const videoUpload = require("../middleware/video-upload");
const protect = require("../middleware/protect");

router.get("/:fileName", stream);
router.post("/", protect, videoUpload.single("video"), uploadVideo);
router.patch("/", updateVideo);

module.exports = router;