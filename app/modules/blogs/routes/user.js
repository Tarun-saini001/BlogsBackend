const express = require("express");
const {verify} = require("../../../middlewares/checkRole")
const { USER_TYPES } = require("../../../config/constants");
const {addBlog, getBlogs, myBlogs} = require("../controllers/user")

const router = express.Router();

router.post("/addBlog" , verify(USER_TYPES.USER), addBlog);
router.get("/getBlogs",verify(USER_TYPES.USER),getBlogs) 
router.get("/myBlogs",verify(USER_TYPES.USER),myBlogs)
module.exports = router