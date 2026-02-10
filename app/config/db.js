const mongoose = require("mongoose");
require("dotenv").config();

const connectDatabase = async()=>{
    try {
       await mongoose.connect(process.env.MONGO_URI)
       console.log("DATABASE CONNECTED SUCCESSFULLY!")
    } catch (error) {
        console.log("DATABASE CONNECTION FAILED...",error)
    }
}
 module.exports = connectDatabase

// const { Sequelize } = require("sequelize");
// require("dotenv").config();

// const sequelize = new Sequelize(process.env.MYSQL_URI, {
//   dialect: "mysql",
//   logging: false,
// });

// const connectDatabase = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log("MYSQL DATABASE CONNECTED SUCCESSFULLY!");
//   } catch (error) {
//     console.log("MYSQL CONNECTION FAILED...", error);
//   }
// };

// module.exports = { sequelize, connectDatabase };
