const express = require("express");
const router = express.Router();

const {
    uploadVideo,
    stream,
    updateVideo,
    deleteVideo,
    likeVideo,
    dislikeVideo,
    getComments,
    commentOnVideo,
    replyToComment,
    createPlaylist,
    addToPlaylist,
} = require("./../controllers/video-controllers");

const videoUpload = require("../middleware/video-upload");
const addIP = require("../middleware/add-ip");
const protect = require("../middleware/protect");

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
    .route("/:videoID/comment")
    .post(protect, commentOnVideo);

router
    .route("/:videoID/comment/:commentID")
    .post(protect, replyToComment);

router
    .route("/:videoID/comment")
    .get(getComments);

router
    .route("/:videoID/playlist")
    .post(createPlaylist);

router
    .route("/:videoID/playlist")
    .patch(addToPlaylist);

module.exports = router;