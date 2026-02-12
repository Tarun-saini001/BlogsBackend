const { asyncHandler } = require("../../../middlewares/async");
const { sendResponse } = require("../../../utils/common");
const{blogs}=require("../services/blog")

const addBlog = asyncHandler(async (req,res) => {
    const response = await blogs.addBlog(req);
    return sendResponse(res,response)
})

const getBlogs = asyncHandler(async (req,res) => {
    const response = await blogs.getBlogs(req);
    return sendResponse(res,response)
})

const myBlogs = asyncHandler(async (req,res) => {
    const response = await blogs.myBlogs(req);
    return sendResponse(res,response)
})

module.exports={addBlog, getBlogs, myBlogs}