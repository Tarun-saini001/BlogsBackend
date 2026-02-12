
require('module-alias/register');

const express = require("express");

const onboardingRoutes = require("./onBoarding1/routes");
const blogRoutes = require("./blogs/routes");

const router = express.Router();

router.use("/onBoarding", onboardingRoutes);
router.use("/blogs",blogRoutes)

module.exports = router;
