const { verifyToken } = require("../utils/common");
const { sessionModel } = require("../modules/onBoarding1/models/session");
const { USER_TYPES } = require("../config/constants");
// const Session = require("../modules/onBoarding1/models/session");

const verify =
  (...roles) =>

    async (req, res, next) => {
      try {
        console.log("AUTH HEADER:", req.headers.authorization);
        let token = String(req.headers.authorization || "")
          .replace(/bearer|jwt|Guest/i, "")
          .trim();

        console.log('token: ', token);
        if (!token) {
          return res.status(401).send({
            statusCode: 401,
            message: req.t("UNAUTHORIZED_ACCESS"),
            data: {},
            status: 0,
            isSessionExpired: true,
          });
        }

        const decoded = verifyToken(token, roles[0]);
        console.log('decoded: ', decoded);

        if (!decoded) {
          return res.status(401).send({
            statusCode: 401,
            message: req.t("UNAUTHORIZED_ACCESS"),
            data: {},
            status: 0,
            isSessionExpired: true,
          });
        }
        const session = await sessionModel.findOne({
          _id: decoded._id,
          userId: decoded.userId,
        });
        // const session = await Session.findOne({
        //   where: {
        //     // id: decoded._id,       // Mongoose `_id` maps to `id` in SQL
        //     userId: decoded.userId,
        //   },
        // })

        // const sessionData = session?.get({ plain: true });
        // console.log('session data: ', sessionData);
        const sessionData = session;
        if (!sessionData) {
          return res.status(401).send({
            statusCode: 401,
            message: req.t("SESSION_EXPIRED"),
            data: {},
            status: 0,
            isSessionExpired: true,
          });
        }

        const userData = {
          id: sessionData.userId,
          role: sessionData.role,
        };

        const roleKey = roles.includes(USER_TYPES.ADMIN) ? "admin" : "user";
        req[roleKey] = userData;
        console.log("req", req.user);
        next();

      } catch (error) {
        return res.status(401).send({
          statusCode: 401,
          message: "Unauthorized access",
          data: {},
          status: 0,
          isSessionExpired: true,
        });

      }
    };

module.exports = { verify };
