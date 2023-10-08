"use strict";
const { sendOtpEmail } = require("../helpers/sendEmail");
const utils = require("../helpers/utils");
const userMapper = require("../mappers/user");
const crypto = require("../helpers/crypto");


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

