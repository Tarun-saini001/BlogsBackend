const { success } = require("zod");
const { messages } = require("../../../locales/en");
const blogModel = require("../models/blog");
const { default: mongoose } = require("mongoose");

const blogs = {
    addBlog: async (req) => {
        const body = req.body;
        if (!body) {
            return {
                success: false,
                message: messages.MISSING_BODY,
                status: "badRequest"
            }
        }
        const userId = req.user.id;

        const existingBlog = await blogModel.findOne({
            author: userId,
            title: body.title,
            content: body.content
        });

        if (existingBlog) {
            return {
                success: false,
                message: messages.BLOG_ALREADY_EXIST,
                status: "validation"
            };
        }

        body.author = userId;
        console.log('userId: ', userId);
        console.log('  body.author: ', body.author);
        console.log('body: ', body);
        const blog = await blogModel.create(body);
        return {
            success: true,
            message: messages.BLOG_ADD_SUCC,
            data: blog,
            status: success
        }

    },
    getBlogs: async (req) => {
        const { id } = req.query;
        console.log('author', id);

        const filter = id ? { _id: new mongoose.Types.ObjectId(id) } : {};
        console.log('filter: ', filter);

        const blogs = await blogModel
            .find(filter)
            .populate("author", "name email")
            .sort({ createdAt: -1 });

        return {
            success: true,
            message: messages.BLOGS_FETCHED_SUCCESSFULLY,
            data: blogs,
            status: "success"
        };

    },
    myBlogs: async (req) => {
        
      const id = req.user.id
        const blogs = await blogModel
            .find({author: new mongoose.Types.ObjectId(id)})
            .populate("author", "name email")
            .sort({ createdAt: -1 });

        return {
            success: true,
            message: messages.BLOGS_FETCHED_SUCCESSFULLY,
            data: blogs,
            status: "success"
        }
        // deleteBlog:
    }
}

module.exports = { blogs }