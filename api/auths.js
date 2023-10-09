"use strict";
const crypto = require("../helpers/crypto");
const jwtToken = require("../helpers/jwt");
const authService = require("../services/auth");
const mapper = require("../mappers/user");
const check = require("../validators/auth");
const utils = require("../helpers/utils");
const sendMail = require('../helpers/nodemailer');

exports.signup = async (req, res) => {
  let validate = await check.canRegister(req);
  if (!validate.isSuccess) {
    return res.failure(validate.message);
  }
  try {
    let user = await authService.register(req.body);
    return res.data(user);
  } catch (e) {
    return res.failure(e);
  }
};

exports.login = async (req, res) => {
  try {
    const validate = await check.canLogin(req);
    if (!validate.isSuccess) {
      return res.failure(validate.message);
    }
    let user = await authService.login(req.body)
    return res.data(user);
  } catch (error) {
    // console.error("Login error:", error);
    return res.failure(error);
  }
};

exports.logout = async (req, res) => {
  try {
    let userInfo = await db.user.findById(req.user.id, { token: 1 });
    if (userInfo) {
      userInfo.token = null;
    }
    await userInfo.save();
    return res.data(userInfo = null, process.lang.LOGOUT);
  } catch (error) {
    return res.failure(error);
  }
};

exports.setPassword = async (req, res) => {
  try {
    const validate = check.canSetPassword(req);
    if (!validate.isSuccess) {
      return res.failure(validate.message);
    }
    let user = await authService.setPassword(req)
    return res.data(user, process.lang.PASSWORD_SET_SUCCESS);
  } catch (error) {
    return res.failure(error);
  }
};
exports.changePassword = async (req, res) => {
  try {
    const validate = check.canResetPassword(req);
    if (!validate.isSuccess) {
      return res.failure(validate.message);
    }
    let user = await authService.changePassword(req);
    return res.data(user ,process.lang.PASSWORD_CHANGE_SUCCESS);
  } catch (error) {
    return res.failure(error);
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const validate = check.canForgotPassword(req);
    if(!validate.isSuccess){
      return res.failure(validate.message);
    }
    let user = await authService.forgotPassword(req);
    return res.data(user);
  } catch (error) {
    return res.failure(error);
  }
};
