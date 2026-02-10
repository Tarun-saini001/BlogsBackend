const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        token: { type: String },
        role: { type: Number },
        device: { type: String },
        ip: { type: String },
        jti: { type: String },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const sessionModel =
    mongoose.models.Session || mongoose.model("Session", sessionSchema);

module.exports = { sessionModel };


// const { DataTypes } = require("sequelize");
// const { sequelize } = require("../../../config/db");
// const User = require("../models/user"); // Import User model to create FK

// const Session = sequelize.define(
//   "Session",
//   {
//     userId: {
//       type: DataTypes.INTEGER,   // SQL FK → number
//       allowNull: false,
//       references: {
//         model: User,
//         key: "id",
//       },
//       onDelete: "CASCADE",
//     },

//     token: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },

//     role: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//     },

//     device: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },

//     ip: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },

//     jti: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },

//     isActive: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: true,
//     },
//   },
//   {
//     tableName: "session",
//     timestamps: true,
//   }
// );

// // -----------------------
// // Setup Relationship
// // -----------------------
// User.hasMany(Session, { foreignKey: "userId" });
// Session.belongsTo(User, { foreignKey: "userId" });

// module.exports = Session;
