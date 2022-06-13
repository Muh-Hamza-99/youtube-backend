const fs = require("fs");

const Video = require("./../models/Video");

const uploadVideo = async (req, res) => {
    const newVideo = await Video.create({ owner: req.token._id, name: req.body.name, videoPath: req.fileName });
    res.status(201).json({ status: "success", video: newVideo });
};

const stream = async (req, res) => {
    const { range } = req.headers;
    const { fileName } = req.params;
    if (!range) return;
    const videoPath = `videos/${fileName}`;
    const videoSize = fs.statSync(videoPath).size;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + 10**6, videoSize - 1);
    const headers = { "Content-Length": end - start + 1, "Accept-Range": "bytes", "Content-Type": "video/mp4", "Content-Range": `bytes ${start - end/videoSize}` };
    const videoStream = fs.createReadStream(videoPath, { start, end });
    res.writeHead(206, headers);
    videoStream.pipe(res);
};

const updateVideo = async (req, res) => {
    const { videoID, name } = req.body;
    const video = await Video.findOneAndUpdate({ _id: videoID }, { name }, { runValidators: true, new: true });
    res.status(200).json({ status: "success", video });
};

module.exports = {
    uploadVideo,
    stream,
    updateVideo,
};