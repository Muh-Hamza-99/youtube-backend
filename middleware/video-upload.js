const multer = require("multer");
const { v4: UUID } = require("uuid");

const videoStorage = multer.diskStorage({
    destination: "videos",
    fileName: (req, file, cb) => {
        const id = UUID();
        const token = req.token;
        const fileName = `${token._id.toString()}-${id}`;
        req.fileName = fileName;
    },
});

const videoUpload = multer({
    storage: videoStorage,
    limits: { fileSize: 9000000 * 5 },
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(mp4|MPEG-4|mkv)$/)) return cb(new Error("Video format not supported."));
        cb(undefined, true);
    },
});

module.exports = videoUpload;