
require('module-alias/register');

const express = require("express");

const onboardingRoutes = require("./onBoarding1/routes");

const router = express.Router();

router.use("/onBoarding", onboardingRoutes);

module.exports = router;
