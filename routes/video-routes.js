const express = require("express");
const router = express.Router();

const protect = require("../middleware/protect");

router.get("/test", protect, (req, res) => res.json({ message: "It worked" }));

module.exports = router;