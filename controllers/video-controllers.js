const Video = require("./../models/Video");

const uploadVideo = async (req, res) => {
    const newVideo = await Video.create({ owner: req.token._id, name: req.body.name, videoPath: req.fileName });
    res.status(201).json({ status: "success", video: newVideo });
};

module.exports = {
    uploadVideo,
};