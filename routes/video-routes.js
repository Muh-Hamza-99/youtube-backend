const express = require("express");
const router = express.Router();

const videoUpload = require("../middleware/video-upload");
const protect = require("../middleware/protect");

router.get("/test", protect, videoUpload.single("video"), (req, res) => res.json({ message: "It worked" }));

module.exports = router;