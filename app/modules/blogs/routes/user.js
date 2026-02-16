const express = require("express");
const {verify} = require("../../../middlewares/checkRole")
const { USER_TYPES } = require("../../../config/constants");
const {addBlog, getBlogs, myBlogs, editBlog, deleteBlog, getBlog} = require("../controllers/user");
const upload = require("../../../middlewares/upload");

const router = express.Router();

router.post("/addBlog" , verify(USER_TYPES.USER),upload.single("img"), addBlog);
router.get("/getBlogs",verify(USER_TYPES.USER),getBlogs) 
router.get("/getBlog/:id",verify(USER_TYPES.USER),getBlog) 
router.get("/myBlogs",verify(USER_TYPES.USER),myBlogs)
router.patch("/editBlog/:id",verify(USER_TYPES.USER),editBlog)
router.delete("/deleteBlog/:id",verify(USER_TYPES.USER),deleteBlog)
module.exports = router