const express = require("express");
const router = express.Router({ mergeParams: true });

const {
    getComments,
    commentOnVideo,
    replyToComment,
} = require("./../controllers/comment-controllers");

router 
    .route("/")
    .get(getComments)
    .post(commentOnVideo)

router.post("/:commentID", replyToComment);

module.exports = router;