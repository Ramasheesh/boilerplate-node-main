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
    let user = await db.user.findOne({ email: req.body.email });
    if (!user) {
      throw process.lang.EMAIL_INVALID;
    }
    const passwordIsValid = await crypto.comparePassword(
      req.body.password,
      user.password
    );
    if (!passwordIsValid) {
      return res.failure(process.lang.INVALID_PASSWORD);
    } else {
      // generate token and save token in user
      user.token = jwtToken.jwtSign({
        id: user.id,
        email: user.email,
        roleId: user.roleId,
      });
      user.isTokenExpire = false;
      user.otp = null;
      await user.save();
      return res.data(user);
    }
  } catch (error) {
    // console.error("Login error:", error);
    return res.failure(process.lang.LOGIN_ERROR);
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
    const validate = await check.canSetPassword(req);
    if (!validate.isSuccess) {
      return res.failure(validate.message);
    }
    let { oldPassword, newPassword, confirmPassword } = req.body;
    let findUser = await db.user.findById(req.user.id);
    let match = await crypto.comparePassword(
      oldPassword,
      findUser.password
    );
    if (!match) {
      throw process.lang.OLD_PASS_NOT_MATCH;
    }
    if (!(newPassword === confirmPassword)) {
      throw process.lang.CONFIRM_PASS_NOT_MATCH;
    }
    findUser.password = await crypto.setPassword(newPassword);
    await findUser.save();
    return res.data(process.lang.PASSWORD_CHANGE_SUCCESS);
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
    let findUser = await db.user.findById(req.params.id);
    let newPassword = req.body.newPassword;
    let confirmNewPassword = req.body.confirmNewPassword;
    if (!(newPassword === confirmNewPassword)) {
      throw process.lang.CONFIRM_PASS_NOT_MATCH;
    }
    findUser.password = await crypto.setPassword(newPassword);
    await findUser.save();
    return res.data(process.lang.PASSWORD_CHANGE_SUCCESS);
  } catch (error) {
    return res.failure(error);
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    let data = req.body.email;
    let existUser = await db.user.findOne({ email: data });
    if (existUser) {
      throw process.lang.USER_NOT_FOUND;
    }
    let user = await db.user.findById(req.params.id);
    let otpCode = utils.randomPin(6);
    user.otp = otpCode;
    await user.save();
    return res.data(user);
  } catch (error) {
    return res.failure(error);
  }
};
