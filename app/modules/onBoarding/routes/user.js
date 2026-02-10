const express = require("express");
const validate = require("../../../utils/validateRequest");
const{signupValidation}= require("../validation/onBoarding")
const {signup} = require("../controllers/admin")
const router = express.Router();

router.post("/signup",validate(signupValidation),signup)



module.exports = router;