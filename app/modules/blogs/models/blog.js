const mongoose = require("mongoose");

const blog = new mongoose.Schema(
    {
        img: { type: String },
        author: { type: String },
        title: { type: String },
        content: { type: String },
        publishDate: { type: Date },
        profilePic: { type: String },
        isPublisged: { type: Boolean, default: true }
    },
    {timestamps:true}
)

const blogModel = mongoose.model("blogs",blog);
module.exports=blogModel;