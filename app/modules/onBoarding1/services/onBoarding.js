
const { messages } = require("../../../locales/en");
const { buildQuery, checkVerifiedUser, checkUser, createUserSession, validateUserAuth } = require("./common");
const dayjs = require("dayjs");


const sendOtpToMail = require("../../../utils/email")
//---------------------------------------------------------------------
const { userModel } = require("../models/user");
// const User = require("../models/user");
//---------------------------------------------------------------------
const otpModel = require("../models/otp")
// const OTP = require("../models/otp")
//---------------------------------------------------------------------
const { sessionModel } = require("../models/session");
// const Session = require("../models/session");
//---------------------------------------------------------------------

const sendOtpToNumber = require("../../../utils/phoneNumber");

const bcrypt = require("bcrypt");
const { OTP_FOR, ROLES } = require("../../../config/constants");
const { comparePassword, hashPassword } = require("../../../utils/common");
// const { sequelize } = require("../../../config/db");


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
        const user = await checkVerifiedUser(req.body);
        if (user) {
            return {
                success: false,
                message: messages.VARIFIED_USER,
                status: "validation"
            }
        }
        if (!body.name) {
            return {
                success: false,
                message: messages.NAME_REQUIRED,
                status: "badRequest"
            }
        }
        const otp = 1234;
        const otpType = 1
        const expiry = dayjs().add(5, "minutes").toISOString();
        const hashedPASS = await bcrypt.hash(body.password.toString(), 10);
        body.password = hashedPASS;
        if (body.email) {
            sendOtpToMail(body.email, otp);

            const newOtp = await otpModel.findOneAndUpdate(
                { email: body.email },
                { $set: { email: body.email, otp, otpType, expiredAt: expiry } },
                { upsert: true, new: true }
            );
            //         await sequelize.query(
            //             `
            // INSERT INTO OTP (email, otp, otptype, expiredat, createdat, updatedat)
            // VALUES (:email, :otp, :otpType, :expiredAt, NOW(), NOW())
            // ON CONFLICT (email)
            // DO UPDATE SET
            //     otp = EXCLUDED.otp,
            //     otptype = EXCLUDED.otptype,
            //     expiredat = EXCLUDED.expiredat,
            //     updatedat = NOW();
            // `,
            //             {
            //                 replacements: { email: body.email, otp, otpType, expiredAt: expiry }
            //             }
            //         );
            // await OTP.upsert({
            //     email: body.email,
            //     otp,
            //     otpType,
            //     expiredAt: expiry,
            // });

            return {
                success: true,
                message: messages.MAIL_OTP_SUCCESSFULL,
                status: "success"
            }
        }
        else if (body.phoneNumber) {
            sendOtpToNumber(body.phoneNumber, otp);
            const newOtp = await otpModel.findOneAndUpdate(
                { phoneNumber: body.phoneNumber },
                { $set: { countryCode: body.countryCode, phoneNumber: body.phoneNumber, otp, otpType, expiredAt: expiry } },
                { upsert: true, new: true }
            );
            // await OTP.upsert({
            //     countryCode: body.countryCode,
            //     phoneNumber: body.phoneNumber,
            //     otp,
            //     otpType,
            //     expiredAt: expiry,
            // });
            return {
                success: true,
                message: messages.NUMBER_OTP_SUCCESSFULL,
                status: "success"
            }
        }
    },

    verifyOtp: async (req) => {
        const body = req.body
        if (!body) {
            return {
                success: false,
                message: messages.MISSING_BODY,
                status: "badRequest"
            }
        }
        const qry = await buildQuery(body);
        qry.otpType = Number(body.otpType);
        console.log('qry: ', qry);

        // Find OTP record
        // const otp = await OTP.findOne({ where: qry });
        const otp = await otpModel.findOne(qry);
        console.log('otp: ', otp);
        if (!otp) {
            return {
                success: false,
                message: messages.INVALID_USER,
                status: "unautherized"
            }
        }
        if (!body.otp === otp.otp) {
            return {
                success: false,
                message: messages.INVALID_OTP,
                status: "validation"
            }
        }
        //
        let user = {};
        let role = {};
        switch (body.otpType) {
            case OTP_FOR.LOGIN:
            case OTP_FOR.FORGOT_PASSWORD: {
                user = await checkUser(req.body);
                if (!user) {
                    return {
                        success: false,
                        message: messages.NOT_FOUND,
                        status: "validation"
                    }
                }
                role = Number(user.role)
                const result = await createUserSession(
                    user,
                    body,
                    role,
                    Number(body.otpType) === Number(OTP_FOR.FORGOT_PASSWORD)
                )
                await otpModel.findOneAndDelete({
                    email: body.email,
                    phone: body.phone,
                    countryCode: body.countryCode,
                    otpType: Number(body.otpType),
                });

                // Delete OTP after verification
                // await OTP.destroy({ where: qry });
                if (body.otpType === OTP_FOR.LOGIN) {
                    return {
                        success: true,
                        message: messages.OTP_VERIFIED_SUCCESSFULLY,
                        data: result,
                        status: "success"
                    }
                }
                const data = {
                    token: result.token,
                    tokenType: result.tokenType
                }
                return {
                    success: true,
                    message: messages.OTP_VERIFIED_SUCCESSFULLY,
                    data: data,
                    status: "success"
                }

            }
            case OTP_FOR.REGISTER: {
                user = await checkUser(req.body);
                console.log('user: ', user);
                if (user) {
                    return {
                        success: false,
                        message: messages.VARIFIED_USER,
                        status: "validation"
                    }
                }
                if (body.role === ROLES.ADMIN || body.role === ROLES.SUBADMIN) {
                    return {
                        success: false,
                        message: messages.CAN_NOT_CREATE_ADMIN,
                        status: "validation"
                    }
                }
                const hashedPASS = await bcrypt.hash(String(body.password), 10);
                body.password = hashedPASS;
                let query = { password: body.password, role: body.role, name: body.name };
                if (body.email != null) {
                    query.email = body.email;
                    query.isEmailVerified = true
                } else if (body.phoneNumber != null && body.countryCode) {
                    query.phoneNumber = body.phoneNumber;
                    query.countryCode = body.countryCode;
                    query.isNumberVerified = true
                }

                const createdUser = await userModel.create(query);
                // const createdUser = await User.create(query);
                console.log('createdUser: ', createdUser);
                user = createdUser;
                role = Number(createdUser.role)
                break;
            }
            default:
                return {
                    success: false,
                    message: messages.INVALID_INPUT,
                    status: "validation"
                }
        }
        const result = await createUserSession(
            user,
            body,
            role,
            Number(body.otpType) === Number(OTP_FOR.FORGOT_PASSWORD)
        );
        await otpModel.findOneAndDelete({
            email: body.email,
            phone: body.phone,
            countryCode: body.countryCode,
            otpType: Number(body.otpType),
        });
        // Delete OTP after registration
        // await OTP.destroy({ where: qry });
        return {
            success: true,
            message: messages.OTP_VERIFIED_SUCCESSFULLY,
            data: result,
            status: "success"
        }
    },

    login: async (req) => {
        console.log("reachhhhhhh");
        const body = req.body;
        // console.log('body: ', body);
        if (!body) {
            return {
                success: false,
                message: messages.MISSING_BODY,
                status: "badRequest"
            }
        }
        console.log("reach");
        const user = await checkVerifiedUser(req.body);
        console.log('user: ', user);
        if (!user) {
            return {
                success: false,
                message: messages.NOT_FOUND,
                status: "validation"
            }
        }
        console.log("Plain password:", body.password);
        console.log("Hashed password:", user.password);
        const isMatch = await comparePassword(body?.password, user.password);
        console.log("Password match:", isMatch);
        if (!isMatch) {
            return {
                success: false,
                message: messages.INVALID_PASSWORD,
                status: "validation"
            }
        }
        if (user.isBlocked) {
            return {
                success: false,
                message: messages.ACC_BLOCKED,
                status: "unautherized"
            }
        }
        const result = await createUserSession(user, body, Number(user.role), false, body.rememberMe);
        return {
            success: true,
            message: messages.LOGIN_SUCCESSFULLY,
            data: result,
            status: "success"
        }
    },

    updateProfile: async (req) => {
        const body = req.body


        if (!body) {
            return {
                success: false,
                message: messages.MISSING_BODY,
                status: "badRequest"
            }
        }
        const result = await validateUserAuth(req);
        //console.log('result: ', result);
        if (!("user" in result)) {
            return {
                success: false,
                message: messages.NOT_FOUND,
                status: "validation"
            }
        }
        console.log("----------------");
        const user = result.user;

        let query = {};
        if (body.email != null) {
            query.email = body.email;
            query.isEmailVerified = true
        } else if (body.phoneNumber != null && body.countryCode) {
            query.phoneNumber = body.phoneNumber;
            query.countryCode = body.countryCode;
            query.isNumberVerified = true
        }
        const userData = {
            ...body,
            ...query
        }

        const updateUser = async (userId, body) => {
            try {
                // Prepare the fields to update
                const updateData = { ...body };

                if (body.email != null) {
                    updateData.isEmailVerified = true;
                } else if (body.phoneNumber != null && body.countryCode) {
                    updateData.isNumberVerified = true;
                }

                // const [rowsUpdated] = await User.update(updateData, {
                //     where: { id: userId },
                // });

                // const updatedUser = await User.findOne({ where: { id: userId } });

                const updatedUser = await userModel.findByIdAndUpdate(
                    userId,
                    { $set: updateData },
                    { new: true } // return updated document
                );

                return updatedUser;
            } catch (error) {
                console.error("Error updating user:", error);
                throw error;
            }
        };
        console.log("reached `1");
        const updatedUser = await updateUser(req.user.id, body);
        console.log('updateUser: ', updatedUser);
        // const userExist = await userModel.findByIdAndUpdate(user.id, userData, { new: true });
        if (!updateUser || updateUser == null) {
            return {
                success: false,
                message: messages.NOT_FOUND,
                status: "recordNotFound"
            }
        }
        return {
            success: true,
            message: messages.PROFILE_UPDATE,
            status: "success"
        }
    },

    // deleteAccount: async (req) => {
    //     const result = await validateUserAuth(req);
    //     if (!("user" in result)) {
    //         return {
    //             success: false,
    //             message: messages.NOT_FOUND,
    //             status: "validation"
    //         }
    //     }
    //     const user = result.user;
    //     const response = await userModel.findByIdAndUpdate(user.id, { isDeleted: true });

    //     if (!response) {
    //         return {
    //             success: false,
    //             message: messages.INVALID_ID,
    //             status: "validation"
    //         }
    //     }
    //     return {
    //         success: true,
    //         message: messages.DELETE_SUCCESSFULL,
    //         status: "success"
    //     }
    // },

    changePassword: async (req) => {
        const body = req.body;
        if (!body) {
            return {
                success: false,
                message: messages.MISSING_BODY,
                status: "badRequest"
            }
        }
        const result = await validateUserAuth(req);
        if (!("user" in result)) {
            return {
                success: false,
                message: messages.NOT_FOUND,
                status: "validation"
            }
        }
        const user = result.user;
        const userExist = await userModel.findById(user.id).select(
            "password isEmailVerified isBlocked",
        );
        // const userExist = await User.findOne({
        //     where: { id: user.id },
        //     attributes: ["password", "isEmailVerified", "isBlocked"],
        // });


        if (!userExist) {
            return {
                success: false,
                message: messages.NOT_FOUND,
                status: "recordNotFound"
            }
        }
        if (!userExist.isEmailVerified) {
            return {
                success: false,
                message: messages.ACC_NOT_VERIFIED,
                status: "badRequest"
            }
        }
        if (userExist.isBlocked) {
            return {
                success: false,
                message: messages.ACC_BLOCKED,
                status: "badRequest"
            }
        }

        if (!body.isResetPassword) {
            if (!userExist.password) {
                return {
                    success: false,
                    message: messages.PASSWORD_NOT_SET,
                    status: "badRequest"
                }
            }

            if (!body?.oldPassword) {
                return {
                    success: false,
                    message: messages.INVALID_INPUT,
                    status: "recordNotFound"
                }
            }

            console.log('userExist.password: ', userExist.password);
            console.log('body.oldPassword: ', body.oldPassword);
            const isMatch = await comparePassword(body.oldPassword, userExist.password);
            if (!isMatch) {
                return {
                    success: false,
                    message: messages.OLD_PASSWORD_NOT_MATCH,
                    status: "validation"
                }
            }
        }

        if (userExist.password && (await comparePassword(body.newPassword, userExist.password))) {
            return {
                success: false,
                message: messages.NEW_PASSWORD_SAME_AS_OLD_PASSWORD,
                status: "validation"
            }
        }
        const hashed = await hashPassword(body.newPassword);
        await userModel.findByIdAndUpdate(user.id, { password: hashed });
        // await User.update(
        //     { password: hashed },
        //     { where: { id: user.id } }
        // );

        return {
            success: true,
            message: messages.PASSWORD_CHANGED,
            status: "success"
        }
    },

    forgotPassword: async (req) => {
        const body = req.body;
        if (!body) {
            return {
                success: false,
                message: messages.MISSING_BODY,
                status: "badRequest"
            }
        }
        const user = await checkVerifiedUser(body);
        if (!user) {
            return {
                success: false,
                message: messages.ACC_NOT_VERIFIED,
                status: "badRequest"
            }
        }
        if (user.isBlocked) {
            return {
                success: false,
                message: messages.ACC_BLOCKED,
                status: "badRequest"
            }
        }
        if (user.isDeleted) {
            return {
                success: false,
                message: messages.ACC_DELETED,
                status: "badRequest"
            }
        }
        const otp = 1234;
        const otpType = 3
        const expiry = dayjs().add(5, "minutes").toISOString();
        if (body.email) {
            sendOtpToMail(body.email, otp);
            const newOtp = await otpModel.findOneAndUpdate(
                { email: body.email },
                { $set: { email: body.email, otp, otpType, expiredAt: expiry } },
                { upsert: true, new: true }
            );
            // await OTP.upsert({
            //     email: body.email,
            //     otp,
            //     otpType,
            //     expiredAt: expiry,
            // });
            return {
                success: true,
                message: messages.MAIL_OTP_SUCCESSFULL,
                status: "success"
            }
        }
        else if (body.phoneNumber) {
            sendOtpToNumber(body.phoneNumber, otp);

            const newOtp = await otpModel.findOneAndUpdate(
                { phoneNumber: body.phoneNumber },
                { $set: { countryCode: body.countryCode, phoneNumber: body.phoneNumber, otp, otpType, expiredAt: expiry } },
                { upsert: true, new: true }
            );
            // await OTP.upsert({
            //     countryCode: body.countryCode,
            //     phoneNumber: body.phoneNumber,
            //     otp,
            //     otpType,
            //     expiredAt: expiry,
            // });
            return {
                success: true,
                message: messages.NUMBER_OTP_SUCCESSFULL,
                status: "success"
            }
        }
    },

    getProfile: async (req) => {
        const result = await validateUserAuth(req);
        if (!("user" in result)) {
            return {
                success: false,
                message: messages.NOT_FOUND,
                status: "validation"
            }
        }
        const user = result.user;
        const userRecord = await userModel.findById(user.id).select("-password")
        // const userRecord = await User.findOne({
        //     where: { id: user.id },
        //     attributes: { exclude: ["password"] }
        // });

        return {
            success: true,
            message: messages.PROFILE_FETCHED,
            data: userRecord,
            status: "success"
        }
    },

    logout: async (req) => {
        const result = await validateUserAuth(req);

        if (!("user" in result)) {
            return {
                success: false,
                message: messages.NOT_FOUND,
                status: "validation"
            }
        }
        const token = String(req.headers.authorization || "")
            .replace(/bearer|jwt|Guest/i, "")
            .trim();

        const user = result.user;
        await sessionModel.deleteMany({ userId: user.id, token });
        // await Session.destroy({
        //     where: {
        //         userId: user.id,
        //         token: token
        //     }
        // });

        return {
            success: true,
            message: messages.LOGOUT_SUCCESSFULLY,
            status: "success"
        }
    },
    // saveFcmToken: async (req) => {
    //     const userId = req.user.id;
    //     const { fcmToken } = req.body;

    //     await User.update(
    //         { fcmToken },
    //         { where: { id: userId } }
    //     );
    //     return {
    //         success: true,
    //         message: messages.FCM_TOKEN_SAVED,
    //         status: "success"
    //     }
    // }

    register: async (req) => {
        const body = req.body;

        if (!body) {
            return {
                success: false,
                message: messages.MISSING_BODY,
                status: "badRequest"
            }
        }
        const user = await checkVerifiedUser(req.body);
        if (user) {
            return {
                success: false,
                message: messages.VARIFIED_USER,
                status: "validation"
            }
        }
        if (body.email != null) {
            body.isEmailVerified = true;
        }

        if (!body.name) {
            return {
                success: false,
                message: messages.NAME_REQUIRED,
                status: "badRequest"
            }
        }
        if (body.role === ROLES.ADMIN || body.role === ROLES.SUBADMIN) {
            return {
                success: false,
                message: messages.CAN_NOT_CREATE_ADMIN,
                status: "validation"
            }
        }
        const hashedPASS = await bcrypt.hash(String(body.password), 10);
        body.password = hashedPASS;
        // let query = { password: body.password, role: body.role, name: body.name };
        // if (body.email != null) {
        //     query.email = body.email;
        //     query.isEmailVerified = true}
        const createdUser = await userModel.create(body);
        console.log('createdUser: ', createdUser);

        const result = await createUserSession(createdUser, body, Number(createdUser.role), false, body.rememberMe);
        return {
            success: true,
            message: messages.USER_REGISTERATION_SUCC,
            data: result,
            status: "success"
        }
    }

};

module.exports = { onBoarding };
