const mongoose = require("mongoose");

const commentSchema = new Schema({ 
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    comment: {
        type: String,
        required: [true, "Comment text is required to comment on a video!"],
    },
    likes: {
        type: Number,
        default: 0,
    },
    dislikes: {
        type: Number,
        default: 0,
    },
    replies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        }
    ],
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;