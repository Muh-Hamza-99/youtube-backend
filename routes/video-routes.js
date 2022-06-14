const express = require("express");
const router = express.Router();

const {
    uploadVideo,
    stream,
    updateVideo,
    deleteVideo,
    likeVideo,
    dislikeVideo,
    createPlaylist,
    addToPlaylist,
} = require("./../controllers/video-controllers");

const commentRouter = require("./comment-routes");

const videoUpload = require("../middleware/video-upload");
const addIP = require("../middleware/add-ip");
const protect = require("../middleware/protect");

router.use("/:videoID/comments", commentRouter);

router
    .route("/")
    .post(protect, videoUpload.single("video"), uploadVideo);

router
    .route("/:videoID/:IP")
    .get(addIP, stream);

router
    .patch(protect, updateVideo)
    .delete(protect, deleteVideo)

router
    .route("/:videoID/like")
    .patch(protect, likeVideo);

router
    .route("/:videoID/dislike")
    .patch(protect, dislikeVideo);


router
    .route("/:videoID/playlist")
    .post(protect, createPlaylist);

router
    .route("/:videoID/playlist")
    .patch(protect, addToPlaylist);

module.exports = router;