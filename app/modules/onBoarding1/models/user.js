const mongoose = require("mongoose");
const { USER_TYPES, GENDER } = require("../../../config/constants");

const userSchema = new mongoose.Schema(
    {
        name: { type: String },
        age: { type: Number },
        gender: { type: Number, enum: Object.values(GENDER) },
        email: { type: String },
        countryCode: { type: String },
        phoneNumber: { type: String },
        password: { type: String },
        address: { type: String },
        jti: { type: String },
        isNumberVerified: { type: Boolean, default: false },
        isEmailVerified: { type: Boolean, default: false },
        isBlocked: { type: Boolean, default: false },
        isDeleted: { type: Boolean, default: false },
        role: {
            type: Number,
            enum: Object.values(USER_TYPES),
            default: USER_TYPES.USER,
        },
    },
    { timestamps: true }
);

const userModel =
    mongoose.models.users || mongoose.model("users", userSchema);

module.exports = {userModel};

// const { DataTypes } = require("sequelize");
// const { sequelize } = require("../../../config/db"); // import your sequelize instance
// const { USER_TYPES, GENDER } = require("../../../config/constants");

// const User = sequelize.define(
//   "User",
//   {
//     name: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },

//     age: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//     },

//     gender: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//       validate: {
//         isIn: [Object.values(GENDER)],
//       },
//     },

//     email: {
//       type: DataTypes.STRING,
//       allowNull: true,
//       validate: {
//         isEmail: true,
//       },
//     },

//     countryCode: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },

//     phoneNumber: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },

//     password: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },

//     address: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },

//     jti: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },

//     isNumberVerified: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: false,
//     },

//     isEmailVerified: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: false,
//     },

//     isBlocked: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: false,
//     },

//     isDeleted: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: false,
//     },

//     role: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       defaultValue: USER_TYPES.USER,
//       validate: {
//         isIn: [Object.values(USER_TYPES)],
//       },
//     },
//   },
//   {
//     tableName: "users",
//     timestamps: true,
//   }
// );

// module.exports = User;

    