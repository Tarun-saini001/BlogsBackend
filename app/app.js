require('module-alias/register');

const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
// const { connectDatabase,sequelize  } = require("./config/db");

const { seedUsers } = require("./utils/seed");
const {responseHandler} = require("./middlewares/responses")
dotenv.config({ path: ".env" });
const routes = require("./modules/index");
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();

const corsOptions = {
  origin: process.env.ALLOW_ORIGIN ,
  credentials:true
};

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(responseHandler);
app.use(routes)
app.use(errorHandler)
app.use(express.static(path.join(__dirname, "public")));
// setupSwagger(app);


connectDB();


if (process.env.NODE_ENV === "dev") {
  seedUsers();
}


// connectDatabase();
// Sync all SQL models (creates tables)
// sequelize
//   .sync({ alter: true }) // change to { force: false }
//   .then(() => {
//     console.log("All SQL tables synced!");

//     // Run seed only in dev environment
//     if (process.env.NODE_ENV === "dev") {
//       seedUsers();
//     }
//   })
//   .catch((err) => console.log("Sync error:", err));


app.get("/", (req, res) => {
  res.render("index");
});



module.exports = app;

