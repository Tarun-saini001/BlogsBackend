const mongoose = require("mongoose");
const { OTP_FOR } = require("../../../config/constants");
const otp = new mongoose.Schema({
    email: { type: String },
    phoneNumber: { type: Number },
    countryCode: { type: String },
    otp: { type: Number },
    otpType: {
        type: Number,
        enum: Object.values(OTP_FOR),
        default: OTP_FOR.REGISTER,
        required: true,
    },
    expiredAt: { type: Date }
},
    { timestamps: true }
)
const otpModel = mongoose.model("otps", otp)

module.exports = otpModel;

// const { DataTypes } = require("sequelize");
// const { sequelize } = require("../../../config/db");
// const { OTP_FOR } = require("../../../config/constants");

// const OTP = sequelize.define(
//   "OTP",
//   {
//     email: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },

//     phoneNumber: {
//       type: DataTypes.STRING,     // Use STRING to avoid losing leading zeros
//       allowNull: true,
//     },

//     countryCode: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },

//     otp: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//     },

//     otpType: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       defaultValue: OTP_FOR.REGISTER,
//       validate: {
//         isIn: [Object.values(OTP_FOR)],
//       },
//     },

//     expiredAt: {
//       type: DataTypes.DATE,
//       allowNull: true,
//     },
//   },
//   {
//     tableName: "otps",
//     timestamps: true, // createdAt + updatedAt
//   }
// );

// module.exports = OTP;
