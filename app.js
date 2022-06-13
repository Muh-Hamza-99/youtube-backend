require("dotenv").config({ path: "./config.env" });

const mongoose = require("mongoose")

const express = require("express");
const app = express();

const userRouter = require("./routes/user-routes");
const videoRouter = require("./routes/video-routes");

app.use(express.json({ limit: "10kb" }));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);

const DB = process.env.MONGO_URI.replace("<PASSWORD>", process.env.MONGO_PASSWORD);

mongoose.connect(DB)
    .then(() => console.log("Successfully connected to DB!"))
    .catch(error => console.log(`Something went wrong...${error}.`));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is up and running on port ${PORT}...`))
