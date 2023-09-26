"use strict";
const crypto = require("../helpers/crypto");
const jwtToken = require("../helpers/jwt");
const authService = require("../services/auth");
const mapper = require("../mappers/user");
const check = require("../validators/auth");
const utils = require("../helpers/utils");

exports.signup = async (req, res) => {
  let validate = await check.canRegister(req);
  if (!validate.isSuccess) {
    return res.failure(validate.message);
  }
  try {
    req.body.hash = await crypto.setPassword(req.body.password);
    let user = await authService.register(req.body);
    return res.data(mapper.toModel(user));
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
      throw "user not found";
    }
    const passwordIsValid = await crypto.comparePassword(
      req.body.password,
      user.password
    );
    if (!passwordIsValid) {
      return res.failure("Invalid password");
    } else {
      // generate token and save token in user
      user.token = await jwtToken.jwtSign({
        id: user.id,
        email: user.email,
        roleId:user.roleId
      });
      user.isTokenExpire = false;
      user.otp = null;
      await user.save();
      return res.data(user);
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.failure("An error occurred during login");
  }
};

exports.logout = async (req, res) => {
  try {
    let userInfo = await db.user.findById(req.params.id, { token: 1 });
    if (userInfo) {
      userInfo.token = null;
    }

    await userInfo.save();
    return res.data(userInfo, { message: "user logout successfully" });
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
    let findUser = await db.user.findById(req.params.id);
    let match = await crypto.comparePassword(
      req.body.oldPassword,
      findUser.password
    );
    if (!match) {
      throw "old password not match";
    }
    if (!(newPassword === confirmPassword)) {
      throw "confirm password not match";
    }
    findUser.password = await crypto.setPassword(newPassword);
    await findUser.save();
    return res.data("password updated successfully");
  } catch (error) {
    return res.failure(error);
  }
};
exports.changePassword = async (req, res) => {
  try {
    const validate = await check.canResetPassword(req);
    if (!validate.isSuccess) {
      return res.failure(validate.message);
    }
    let findUser = await db.user.findById(req.params.id);
    let newPassword = req.body.newPassword;
    let confirmNewPassword = req.body.confirmNewPassword;
    if (!(newPassword === confirmNewPassword)) {
      throw "confirm password not match";
    }
    findUser.password = await crypto.setPassword(newPassword);
    await findUser.save();
    return res.data("password updated successfully");
  } catch (error) {
    return res.failure(error);
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    let data = req.body;
    let user = await db.user.findById(req.params.id);
    let otpCode = await utils.randomPin(6);
    user.otp = otpCode;
    await user.save();
    return res.data(user);
  } catch (error) {
    return res.failure(error);
  }
};
