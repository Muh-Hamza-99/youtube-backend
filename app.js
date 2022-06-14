require("dotenv").config({ path: "./config.env" });

const mongoose = require("mongoose")

const express = require("express");
const app = express();

const compression = require("compression");
const CORS = require("cors");

const expressMongoSanitise = require("express-mongo-sanitize");
const expressRateLimit = require("express-rate-limit");
const XSS = require("xss-clean");
const helmet = require("helmet");

const userRouter = require("./routes/user-routes");
const videoRouter = require("./routes/video-routes");
const commentRouter = require("./routes/comment-routes");
const playlistRouter = require("./routes/playlist-routes");

const AppError = require("./utilities/app-error");
const globalErrorHandler = require("./utilities/error-handler");

const limiter = expressRateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this device! Please try again after an hour!",
});

app.options("*", CORS());

app.use(compression());

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

app.use(expressMongoSanitise());
app.use(XSS());
app.use(helmet());

app.use("/api", limiter);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/playlists", playlistRouter);

app.all("*", (req, res, next) => {
    res.status(404).json({ status: "fail", message: `Can't find ${req.originalUrl} on this server!` });
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

const DB = process.env.MONGO_URI.replace("<PASSWORD>", process.env.MONGO_PASSWORD);

mongoose.connect(DB)
    .then(() => console.log("Successfully connected to DB!"))
    .catch(error => console.log(`Something went wrong...${error}.`));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is up and running on port ${PORT}...`))
