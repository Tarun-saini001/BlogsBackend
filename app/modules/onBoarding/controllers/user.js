const {onBoarding} = require("../services/onBoarding");
const {asyncHandler} = require("../../../middlewares/async");
const {sendResponse} = require("../../../utils/common")

const signup = asyncHandler(async(req,res)=>{
const response = await onBoarding.signup(req);
return sendResponse(res,response)
})