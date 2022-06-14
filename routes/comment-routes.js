const express = require("express");
const router = express.Router({ mergeParams: true });

const {
    getComments,
    commentOnVideo,
    replyToComment,
} = require("./../controllers/comment-controllers");

const protect = require("../middleware/protect");

router 
    .route("/")
    .get(getComments)
    .post(protect, commentOnVideo)

router.post("/:commentID", protect, replyToComment);

module.exports = router;