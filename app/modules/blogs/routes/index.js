const express = require("express");

const userRoutes = require("./user");
const adminRoutes = require("./admin");

const router = express.Router();

router.use("/admin", adminRoutes);
router.use("/user", userRoutes);

module.exports = router;