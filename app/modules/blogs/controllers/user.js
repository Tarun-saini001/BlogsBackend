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

const getBlog = asyncHandler(async (req,res) => {
    const response = await blogs.getBlog(req);
    return sendResponse(res,response)
})

const myBlogs = asyncHandler(async (req,res) => {
    const response = await blogs.myBlogs(req);
    return sendResponse(res,response)
})

const editBlog = asyncHandler(async (req,res) => {
    console.log("controller");
    const response = await blogs.editBlog(req);
    return sendResponse(res,response)
})

const deleteBlog = asyncHandler(async (req,res) => {
    console.log("controller");
    const response = await blogs.deleteBlog(req);
    return sendResponse(res,response)
})

module.exports={addBlog, getBlogs, myBlogs,editBlog, deleteBlog,getBlog}