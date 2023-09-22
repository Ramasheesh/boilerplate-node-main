"use strict";
const crypto = require("../helpers/crypto");
const jwtToken = require("../helpers/jwt");
const authService = require("../services/auth");
const mapper = require("../mappers/user");
const check = require("../validators/auth");


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
      // genrate token and save token in user
      user.token = await jwtToken.jwtSign({
        id: user.id,
        email: user.email,
      });
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
    let userInfo = await db.user.findById(req.user.id);
    userInfo.isTokenExpire = true;
    userInfo.token = null;
    await userInfo.save();
    return res.data("user logout successfully");
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
    let findUser = await db.user.findById(req.params.id);
    findUser.password = await crypto.setPassword(req.body.password);
    await findUser.save();
    return res.data("password updated succsessfully");
  } catch (error) {
    return res.failure(error);
  }
};
