const express = require("express");
const validate = require("../../../utils/validateRequest");
const { signupValidation,verifyOtpValidation,loginValidation, updateProfileValidation } = require("../validation/onBoardings")
const { signup,verifyOtp,login, updateProfile } = require("../controllers/admin");
const {verify} = require("../../../middlewares/checkRole");
const { USER_TYPES } = require("../../../config/constants");
const router = express.Router();

router.post("/signup", validate(signupValidation), signup)
router.post("/verifyOtp",validate(verifyOtpValidation),verifyOtp)
router.post("/login",validate(loginValidation),login)
router.post("/updateProfile",verify(USER_TYPES.ADMIN),validate(updateProfileValidation),updateProfile)
module.exports = router;