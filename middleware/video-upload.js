const multer = require("multer");
const { v4: UUID } = require("uuid");

const videoStorage = multer.diskStorage({
    destination: "videos",
    filename: (req, file, cb) => {
        const fileName = `${req.token.id.toString()}#${UUID()}`;
        req.fileName = fileName;
        cb(null, fileName);
    },
});

const videoUpload = multer({
    storage: videoStorage,
    limits: { fileSize: 90000000 * 5 },
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(mp4|MPEG-4|mkv)$/)) return cb(new Error("Video format not supported."));
        cb(undefined, true);
    },
});

module.exports = videoUpload;