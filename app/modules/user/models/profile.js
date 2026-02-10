const mongoose = require("mongoose");
const { USER_TYPES, GENDER } = require("../../../config/constants");

const profileSchema = new mongoose.Schema(
    {
        name: { type: String },
        userName: { type: String },
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
        fcmToken: {
            type: DataTypes.STRING,
            allowNull: true,
        }

    },
    { timestamps: true }
);

const userModel =
    mongoose.models.users || mongoose.model("instaUser", profileSchema);

module.exports = { userModel };
