const mongoose = require("mongoose");
const { USER_TYPES, GENDER } = require("../../../config/constants");
const user = new mongoose.Schema({
    name: { type: String },
    age: { type: Number },
    gender: { type: Number , enum : Object.values(GENDER) },
    email: { type: String },
    countryCode: { type: String },
    phoneNumber: { type: String },
    password: { type: String },
    address: { type: String },
    jti: { type: String },
    isNumberVerified: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    role: { type: Number, enum: Object.values(USER_TYPES) }
},
    { timestamps: true }
)
const userModel = mongoose.model("users", user)

module.exports = userModel;