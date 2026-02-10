const express = require("express");
const validate = require("../../../utils/validateRequest");


const { signupValidation, verifyOtpValidation, loginValidation, updateProfileValidation, changePasswordValidation, forgotPasswordValidation } = require("../validation/onBoardings")
const { signup, verifyOtp, login, updateProfile, deleteAccount, changePassword, forgotPassword, getProfile, logout } = require("../controllers/admin");

const { verify } = require("../../../middlewares/checkRole");
const { USER_TYPES } = require("../../../config/constants");
const router = express.Router();

router.post("/signup", validate(signupValidation), signup)
router.post("/verifyOtp", validate(verifyOtpValidation), verifyOtp)
router.post("/login", validate(loginValidation), login)
router.post("/updateProfile", verify(USER_TYPES.USER), validate(updateProfileValidation), updateProfile),
    router.delete("/deleteAccount", verify(USER_TYPES.USER), deleteAccount)
router.post("/changePassword", verify(USER_TYPES.USER), validate(changePasswordValidation), verify(USER_TYPES.ADMIN), changePassword),
    router.post("/forgotPassword", verify(USER_TYPES.USER), validate(forgotPasswordValidation), forgotPassword),
    router.get("/", verify(USER_TYPES.USER), getProfile),
    router.get("/logout", verify(USER_TYPES.USER), logout)
module.exports = router;