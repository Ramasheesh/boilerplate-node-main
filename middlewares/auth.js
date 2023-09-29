"use strict";
const jwtHelper = require("../helpers/jwt");
const _ = require("underscore");
const jwt = require("jsonwebtoken");
const tokenValidator = async (token) => {
  try {
    let retVal = {
      isValid: false,
    };
    let claims = jwtHelper.verifyToken(token);
    retVal.isValid = true;
    retVal.claims = claims;
    return retVal;
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return retVal;
    }
    return retVal;
  }
};

exports.validate = async (req, res, next) => {
  try {
    var token =
      req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token) return res.accessDenied();

    let tokenValidatorResult = await tokenValidator();
    if (!tokenValidatorResult.isValid) return res.accessDenied();

    next();
  } catch (err) {
    return res.accessDenied();
  }
};

exports.validateRefreshToken = (req, res, next) => {
  var refreshToken = req.cookies.refreshToken || req.headers["refreshToken"];

  if (!refreshToken) {
    return res.status(403).send({
      success: false,
      message: "refreshToken is required.",
    });
  }

  let claims = jwtHelper.verifyToken(token);
  req.user = claims;
  next();
};

exports.validateToken = async (req, res, next) => {
  var token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({
      success: false,
      message: "token is required.",
    });
  }

  try {
    //     let claims = jwtHelper.verifyToken(token, authConfig.secret);
    // let session = await sessionService.get(claims.session);
    // if (!session) {
    //      return res.status(403).send({
    //           success: false,
    //           message: 'session not found',
    //      });
    // // }
    // if (session && session.status === 'expired') {
    //      return res.status(403).send({
    //           success: false,
    //           message: 'session expired',
    //      });
    // }
    // let user = await db.user
    //      .findById(mongoose.Types.ObjectId(session.user))
    //      .populate({ path: 'role' });
    // if (!user) {
    //      return res.status(403).send({
    //           success: false,
    //           message: 'user not found',
    //      });
    // }
    // if (user && user.status == 'inactive') {
    //      return res.status(403).send({
    //           success: false,
    //           message: 'user inactive.',
    //      });
    // }

    // req.session = session;
    //      const decoded = JSON.parse(
    //           Buffer.from(token.split(".")[1], "base64").toString()
    //      )
    //     console.log(decoded);
    //     req.user = decoded;
    // let accessToken  = "";
    const decodeData = jwtHelper.verifyToken(token);
    if (!decodeData) throw "invalid token ";
    const userData = await db.user.findById(decodeData.id).populate({path:'roleId'});
    req.user = userData;

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.failure("Session Expired");
    }
    return res.failure(err);
  }
};
