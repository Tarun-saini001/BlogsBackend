const mongoose = require("mongoose");

const blog = new mongoose.Schema(
    {
        img: { type: String },
        author: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
        title: { type: String },
        content: { type: String },
        publishDate: { type: Date },
        profilePic: { type: String },
        isPublisged: { type: Boolean, default: true },
        isDeleted: { type: Boolean, default: false }
    },
    { timestamps: true }
)

const blogModel = mongoose.model("blogs", blog);
module.exports = blogModel;