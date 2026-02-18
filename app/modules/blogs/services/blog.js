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
        if (req.file) {
            body.img = `/uploads/blogs/${req.file.filename}`;
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
     getBlog: async (req) => {
        const { id } = req.params;
        console.log('author', id);

        const filter = id ? { _id: new mongoose.Types.ObjectId(id) } : {};
        console.log('filter: ', filter);

        const blog = await blogModel
            .find(filter)
            .populate("author", "name email")
            .sort({ createdAt: -1 });

        return {
            success: true,
            message: messages.BLOGS_FETCHED_SUCCESSFULLY,
            data: blog,
            status: "success"
        };
    },
    myBlogs: async (req) => {

        const id = req.user.id
        const blogs = await blogModel
            .find({ author: new mongoose.Types.ObjectId(id) })
            .populate("author", "name email")
            .sort({ createdAt: -1 });

        return {
            success: true,
            message: messages.BLOGS_FETCHED_SUCCESSFULLY,
            data: blogs,
            status: "success"
        }
        // deleteBlog:
    },
    editBlog: async (req) => {
        const { id } = req.params;
        console.log('id: ', id);
        const body = req.body;
        console.log('body: ', body);
        const userId = req.user.id;
        console.log('userId: ', userId);

        if (!id) {
            return {
                success: false,
                message: messages.BLOG_ID_REQUIRED,
                status: "badRequest"
            };
        }

        const blog = await blogModel.findById(id);
        console.log('blog: ', blog);

        if (!blog) {
            return {
                success: false,
                message: messages.BLOG_NOT_FOUND,
                status: "recordNotFound"
            };
        }

        // Check ownership
        if (blog.author.toString() !== userId) {
            return {
                success: false,
                message: messages.ONLY_OWNER_CAN_EDIT,
                status: "validation"
            };
        }

        // If new image uploaded
        if (req.file) {
            body.img = `/uploads/blogs/${req.file.filename}`;
        }

        const updatedBlog = await blogModel.findByIdAndUpdate(
            id,
            body,
            { new: true }
        ).populate("author", "name email");
        
        console.log('updatedBlog: ', updatedBlog);
        return {
            success: true,
            message: messages.BLOG_UPDATED_SUCCESSFULLY,
            data: updatedBlog,
            status: "success"
        };
    },
deleteBlog: async (req) => {
    const { id } = req.params;
    const userId = req.user.id;
    console.log('userId: ', userId);

    if (!id) {
        return {
            success: false,
            message: messages.BLOG_ID_REQUIRED,
            status: "badRequest"
        };
    }

    const blog = await blogModel.findById(id);

    if (!blog) {
        return {
            success: false,
            message: messages.BLOG_NOT_FOUND,
            status: "recordNotFound"
        };
    }

    console.log('blog.author: ', blog.author);
    // Check ownership
    if (blog.author.toString() !== userId.toString()) {
        return {
            success: false,
            message: messages.ONLY_OWNER_CAN_DELETE,
            status: "validation"
        };
    }

    await blogModel.findByIdAndDelete(id);

    return {
        success: true,
        message: messages.BLOG_DELETED_SUCCESSFULLY,
        status: "success"
    };
}

}

module.exports = { blogs }