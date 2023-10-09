"use strict";
const { sendOtpEmail } = require("../helpers/sendEmail");
const utils = require("../helpers/utils");
const userMapper = require("../mappers/user");
const crypto = require("../helpers/crypto");
const jwtToken = require("../helpers/jwt");
const authService = require("../services/auth");


exports.register = async (body) => {
  try {
    let model = await userMapper.newEntity(body, false);
    body.hash = await crypto.setPassword(body.password);
    let existUser = await db.user.findOne({ email: body.email });
    if (existUser) {
      throw process.lang.DUPLICATE_EMAIL;
    }
    let entity = new db.user(model);
    entity.otp = utils.randomPin();
    await entity.save();
    await sendOtpEmail(entity.email,entity.fullName, entity.otp);
    return await entity.save();
  } catch (error) {
    throw error;
  }
};

exports.login = async(body)=>{
 try {
  let user = await db.user.findOne({ email: body.email });
  if (!user) {
    throw process.lang.EMAIL_INVALID;
  }
  const passwordIsValid = await crypto.comparePassword(
    body.password,
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
    return user;
}
 } catch (error) {
  throw error
 }
}

exports.setPassword = async (req, res) => {
  try {
    let { oldPassword, newPassword, confirmNewPassword } = req.body;
    let findUser = await db.user.findById(req.user.id);
    let match = await crypto.comparePassword(
      oldPassword,
      findUser.password
    );
    if (!match) {
      throw process.lang.OLD_PASS_NOT_MATCH;
    }
    if (!(newPassword === confirmNewPassword)) {
      throw process.lang.CONFIRM_PASS_NOT_MATCH;
    }
    findUser.password = await crypto.setPassword(newPassword);
    await findUser.save();
    return findUser;
  } catch (error) {
    throw error
  }
}

exports.changePassword = async (req, res) => {
  try {
    let findUser = await db.user.findById(req.params.id);
    let{ newPassword ,confirmNewPassword } = req.body
    if(!(findUser.otp === req.body.otp)){
      throw process.lang.INVALID_OTP;
    }
    if (!(newPassword === confirmNewPassword)) {
      throw process.lang.CONFIRM_PASS_NOT_MATCH;
    }
    findUser.password = await crypto.setPassword(newPassword);
    findUser.otp = null;
    findUser.isEmailVerified = true;
    await findUser.save();
    return findUser;
  } catch (error) {
    throw error;
  }
};
// module.exports= {
//   login
// }