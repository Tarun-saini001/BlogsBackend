const express = require("express");
const AdminRoutes = require("./admin")
 const UserRoutes = require("./user");

const router = express.Router();

router.use('/admin', AdminRoutes);
router.use('/user', UserRoutes);

module.exports = router;
