const fs = require("fs");

const Video = require("./../models/Video");

const isOwner = videoID => {
    const video = await Video.findById(videoID);
    if (video.owner !== req.token._id.toString()) return false;
    return true;
};

const uploadVideo = async (req, res) => {
    const newVideo = await Video.create({ owner: req.token._id, name: req.body.name, videoPath: req.fileName });
    res.status(201).json({ status: "success", video: newVideo });
};

const stream = async (req, res) => {
    const { videoID } = req.params;
    const { range } = req.headers;
    if (!range) return;
    const video = await Video.findById(videoID);
    if (!video) return;
    const videoPath = `videos/${video.videoPath}`;
    const videoSize = fs.statSync(videoPath).size;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + 10**6, videoSize - 1);
    const headers = { "Content-Length": end - start + 1, "Accept-Range": "bytes", "Content-Type": "video/mp4", "Content-Range": `bytes ${start - end/videoSize}` };
    const videoStream = fs.createReadStream(videoPath, { start, end });
    res.writeHead(206, headers);
    videoStream.pipe(res);
};

const updateVideo = async (req, res) => {
    const { videoID } = req.params;
    const { name } = req.body;
    if (!isOwner(videoID)) return;
    const video = await Video.findByIdAndUpdate(videoID, { name }, { runValidators: true, new: true });
    res.status(200).json({ status: "success", video });
};

const deleteVideo = async (req, res) => {
    const { videoID } = req.params;
    const video = await Video.findById(videoID);
    if (!video) return;
    const videoPath = `videos/${video.videoPath}`;
    if (!fs.existsSync(videoPath)) return;
    fs.unlink(videoPath, error => {
        if (error) return;
        if (!isOwner(videoID)) return;
        await Video.findByIdAndDelete({ _id: videoID });
        return res.status(204).json({ status: "success", video: null });
    });
};

module.exports = {
    uploadVideo,
    stream,
    updateVideo,
    deleteVideo,
};