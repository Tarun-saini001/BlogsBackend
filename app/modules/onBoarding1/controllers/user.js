const { onBoarding } = require("../services/onBoarding")
const { asyncHandler } = require("../../../middlewares/async");
const { sendResponse } = require("../../../utils/common");
const { userModel } = require("../models/user");

const signup = asyncHandler(async (req, res) => {
    const response = await onBoarding.signup(req);
    return sendResponse(res, response)
})

const verifyOtp = asyncHandler(async (req, res) => {
    const response = await onBoarding.verifyOtp(req);
    return sendResponse(res, response)
})


const login = asyncHandler(async (req, res) => {
    const response = await onBoarding.login(req);
    return sendResponse(res, response)
})


const updateProfile = asyncHandler(async (req, res) => {
    const response = await onBoarding.updateProfile(req);
    return sendResponse(res, response)
})

const deleteAccount = asyncHandler(async (req, res) => {
    const response = await onBoarding.deleteAccount(req);
    return sendResponse(res, response)
})

const changePassword = asyncHandler(async (req, res) => {
    const response = await onBoarding.changePassword(req);
    return sendResponse(res, response)
})

const forgotPassword = asyncHandler(async (req, res) => {
    const response = await onBoarding.forgotPassword(req);
    return sendResponse(res, response)
})
const getProfile = asyncHandler(async (req, res) => {
    const response = await onBoarding.getProfile(req);
    return sendResponse(res, response)
})

const logout = asyncHandler(async (req, res) => {
    const response = await logout.getProfile(req);
    return sendResponse(res, response)
})
const register = asyncHandler(async (req, res) => {
    const response = await onBoarding.register(req);
    return sendResponse(res, response)
})


const uploadProfilePic = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    if (!req.file) {
        return sendResponse(res, {
            success: false,
            message: "No file uploaded",
            status: "badRequest"
        });
    }

    const profilePicPath = `/uploads/profiles/${req.file.filename}`;

    const updatedUser = await userModel.findByIdAndUpdate(
        userId,
        { profilePic: profilePicPath },
        { new: true }
    );

    return sendResponse(res, {
        success: true,
        message: "Profile picture updated",
        data: updatedUser,
        status: "success"
    });
});


module.exports = { signup, verifyOtp, login, updateProfile, deleteAccount, changePassword, forgotPassword, getProfile, logout, register, uploadProfilePic }