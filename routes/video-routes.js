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

const commentRouter = require("./comment-routes");
const playlistRouter = require("./playlist-routes");

const videoUpload = require("../middleware/video-upload");
const addIP = require("../middleware/add-ip");
const protect = require("../middleware/protect");

router.use("/:videoID/comments", commentRouter);
router.use("/:videoID/playlists", playlistRouter);

router.get("/:videoID/:IP", addIP, stream);

router.use(protect);

router.post("/", videoUpload.single("video"), uploadVideo);

router
    .route("/:videoID")
    .patch(updateVideo)
    .delete(deleteVideo)

router.patch("/:videoID/like", likeVideo);
router.patch("/:videoID/dislike", dislikeVideo);

module.exports = router;