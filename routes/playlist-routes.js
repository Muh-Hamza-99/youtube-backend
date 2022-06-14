const express = require("express");
const router = express.Router({ mergeParams: true });

const {
    createPlaylist,
    addToPlaylist,
} = require("./../controllers/playlist-controllers");

const protect = require("../middleware/protect");

router.use(protect);

router  
    .route("/")
    .post(createPlaylist)
    .post(addToPlaylist);

module.exports = router;