const {userModel} = require("../models/user");
const  {sessionModel} = require("../models/session")
const {generateNumber}= require("../../../utils/common")
const{USER_TYPES,ROLES}= require("../../../config/constants")
const{getToken}=require("../../../utils/common");
// const { success } = require("zod");
const { messages } = require("../../../locales/en");
// const User = require("../models/user");
// const Session = require("../models/session");

//Build query for email or phone number 
const buildQuery = async (body) => {
    let query = {};

    if (body.email != null) {
        query.email = body.email;
    } else if (body.phoneNumber != null && body.countryCode) {
        query.phoneNumber = body.phoneNumber;
        query.countryCode = body.countryCode;
    }
    return query;
}
// const buildQuery = (body) => {
//   let whereClause = {};

//   if (body.email != null) {
//     whereClause.email = body.email;
//   } else if (body.phoneNumber != null && body.countryCode) {
//     whereClause.phoneNumber = body.phoneNumber;
//     whereClause.countryCode = body.countryCode;
//   }

//   return whereClause;
// };


// check email or number already verified
const checkVerifiedUser = async (body) => {
    let query = {};

    if (body.email != null) {
        query.email = body.email;
        query.isEmailVerified = true
    } else if (body.phoneNumber != null && body.countryCode) {
        query.phoneNumber = body.phoneNumber;
        query.countryCode = body.countryCode;
        query.isNumberVerified = true
    }
    const user = await userModel.findOne(query)
    return user;
}
// const checkVerifiedUser = async (body) => {
//   let whereClause = {};

//   if (body.email) {
//     whereClause = {
//       email: body.email,
//       isEmailVerified: true,
//     };
//   } else if (body.phoneNumber && body.countryCode) {
//     whereClause = {
//       phoneNumber: body.phoneNumber,
//       countryCode: body.countryCode,
//       isNumberVerified: true,
//     };
//   }

//   const user = await User.findOne({ where: whereClause });
//   return user;
// };


//checking user exixt or not
const checkUser = async (body) => {
    let query = {};

    if (body.email != null) {
        query.email = body.email;
    } else if (body.phoneNumber != null && body.countryCode !=null) {
        query.phoneNumber = body.phoneNumber;
        query.countryCode = body.countryCode;
    }
    const user = await userModel.findOne(query)
    return user;
}
// const checkUser = async (body) => {
//   let whereClause = {};

//   if (body.email != null) {
//     whereClause.email = body.email;
//   } else if (body.phoneNumber != null && body.countryCode != null) {
//     whereClause.phoneNumber = body.phoneNumber;
//     whereClause.countryCode = body.countryCode;
//   }

//   const user = await User.findOne({ where: whereClause });
//   return user;
// };



// check role of session
const sessionRole = (role) => {
    const adminRoles = [ROLES.ADMIN, ROLES.SUBADMIN];
    const userRoles = [ROLES.USER, ROLES.BUSINESS];

    if (adminRoles.includes(role)) return USER_TYPES.ADMIN;
    if (userRoles.includes(role)) return USER_TYPES.USER;

    return USER_TYPES.USER;
};

//creating session 
const createUserSession = async (
    user,
    body,
    role,
    isForget = false,
    rememberMe = false
) => {
    const sessionType = sessionRole(role);

    const sessionData = {
        deviceType: body.deviceType,
        deviceToken: body.deviceToken,
        userId: user._id,
        role,
        jti: generateNumber(20),
    };

    const session = await sessionModel.create(sessionData);

    // Convert mongoose doc to JS object
    const userObj = user.toObject ? user.toObject() : user;
    const { password, __v, ...safeUser } = userObj;

    return {
        ...safeUser,
        token: getToken(
            { _id: session.id, userId: user._id, jti: session.jti, isForget },
            sessionType,
            rememberMe
        ),
        tokenType: "Bearer",
    };
};
// const createUserSession = async (user, body, role, isForget = false, rememberMe = false) => {
//   const sessionType = sessionRole(role);

//   const sessionData = {
//     deviceType: body.deviceType,
//     deviceToken: body.deviceToken,
//     userId: user.id,  // SQL uses `id` instead of `_id`
//     role,
//     jti: generateNumber(20),
//   };

//   // Insert session into database
//   const session = await Session.create(sessionData);

//   // Remove sensitive fields from user object
//   const { password, ...safeUser } = user.dataValues || user; // Sequelize returns .dataValues

//   return {
//     ...safeUser,
//     token: getToken(
//       { id: session.id, userId: user.id, jti: session.jti, isForget },
//       sessionType,
//       rememberMe
//     ),
//     tokenType: "Bearer",
//   };
// };


// Validates whether the request contains an authenticated user (user/admin) and returns their info.
const validateUserAuth = async (req) => {
    const user = req.user || req.admin;

    if (!user) {
        return {
            success:false,
            message:messages.UNAUTHORIZED_ACCESS,
            status:"unautherized"
        }
    }

    return { user, error: null };
};



module.exports = { buildQuery, checkVerifiedUser, checkUser,sessionRole,createUserSession,validateUserAuth }