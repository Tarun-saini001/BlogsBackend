const { required } = require("zod/mini");
const { RESPONSE_STATUS, RESPONSE_STATUS_CODE,ROLES,JWT } = require("../config/constants");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt"); 

//send responses
const sendResponse = (res, response) => {
  if (!response.status) {
    switch (response.code) {
      case RESPONSE_STATUS.VALIDATION_ERROR:
        return res
          .status(422)
          .json({
            message: response.message,
            statusCode: RESPONSE_STATUS_CODE.VALIDATION_ERROR
          });

      case RESPONSE_STATUS.UNAUTHORIZED:
        return res
          .status(401)
          .json({
            message: response.message,
            statusCode: RESPONSE_STATUS_CODE.UNAUTHORIZED
          });

      case RESPONSE_STATUS.BAD_REQUEST:
        return res
          .status(400)
          .json({
            message: response.message,
            statusCode: RESPONSE_STATUS_CODE.BAD_REQUEST
          });

      case RESPONSE_STATUS.ALREADY_EXISTS:
        return res
          .status(409)
          .json({
            message: response.message,
            statusCode: RESPONSE_STATUS_CODE.ALREADY_EXISTS
          });

      default:
        return res
          .status(500)
          .json({
            message: response.message,
            statusCode: RESPONSE_STATUS_CODE.INTERNAL_SERVER_ERROR
          });
    }
  }

  // Success response
  return res.status(200).json({
    data: response.data,
    message: response.message,
    statusCode: RESPONSE_STATUS_CODE.SUCCESS
  });
};


//generating random number for jti in session
const generateNumber = (len = 20) => {
  const chars = "0123456789";
  let out = "";
  for (let i = 0; i < len; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
};

// Returns JWT secret based on user role (User/Business or Admin)
const getSecretForPlatform = (role) => {
  switch (role) {
    case ROLES.USER:
    case ROLES.BUSINESS:
      return JWT.USER_SECRET;
    default:
      return JWT.ADMIN_SECRET;
  }
};



// Generates a JWT token with role-based secret and custom expiry (7 days / 30 days)
const getToken = (payload, role, rememberMe = false) => {
  const secret = getSecretForPlatform(role);
  return jwt.sign(
    { ...payload, role },
    secret,
    { expiresIn: rememberMe ? "30d" : "7d" }
  );
};

const verifyToken = (token, role) => {
  try {
    const secret = getSecretForPlatform(role);
    return jwt.verify(token, secret);
  } catch (err) {
    return null;
  }
};


const comparePassword = async (pwd, hash) => {
  return bcrypt.compare(pwd, hash);
};

 const hashPassword = async (pwd) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(pwd, salt);
};


module.exports = {sendResponse,generateNumber,getToken,verifyToken,comparePassword,hashPassword};
