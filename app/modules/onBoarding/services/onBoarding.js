const { success } = require("zod");
const { signupValidation } = require("../validation/onBoarding");
const { messages } = require("../../../locales/en");
const { queryForVarifyCheck } = require("./common");
const dayjs = require("dayjs");
const sendOtpToMail = require("../../../utils/email");
const userModel = require("../models/user");
const sendOtpToNumber = require("../../../utils/phoneNumber");



const onBoarding = {
    signup: async (req) => {
        const body = req.body;
        if (!body) {
            return {
                success: false,
                message: messages.MISSING_BODY,
                status: "badRequest"
            }
        }
        const qry = queryForVarifyCheck(req.body);

        const otp = 1234;
        const expiry = dayjs().add(5, "minutes").toISOString();
        const hashedPASS = await bcrypt.hash(body.password.toString(), 10)
        if (body.email) {
            sendOtpToMail(body.email, otp);
            const user = await userModel.findOneAndUpdate(
                { email:body.email },
                { $set: body },
                { upsert: true, new: true }
            )
            const newOtp = await Model.otp.findOneAndUpdate(
                { email:body.email },
                { $set: { email:body.email, otp, expiredAt: expiry } },
                { upsert: true, new: true }
            );
            return {
                success: true,
                message: messages.MAIL_OTP_SUCCESSFULL,
                status: "success"
            }
        }
        else if(body.phoneNumber){
            sendOtpToNumber(body,phoneNumber , otp);
            const addUser = await Model.user.findOneAndUpdate(
                { phoneNumber:body.phoneNumber },
                { $set: body },
                { upsert: true, new: true }
            );
            const newOtp = await Model.otp.findOneAndUpdate(
                { phoneNumber:body.phoneNumber },
                { $set: { countryCode:body.countryCode, phoneNumber:body.phoneNumber, otp, expiredAt: expiry } },
                { upsert: true, new: true }
            );
             return {
                success: true,
                message: messages.NUMBER_OTP_SUCCESSFULL,
                status: "success"
            }
        }
    }
};

module.exports = {onBoarding};
