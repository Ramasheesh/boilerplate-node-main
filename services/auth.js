"use strict";
const utils = require("../helpers/utils");
const userMapper = require("../mappers/user");

exports.register = async (body) => {
  try {
    let model = await userMapper.newEntity(body, false);
    let entity = new db.user(model);
    // entity.activationCode = utils.randomPin();
    return await entity.save();
  } catch (error) {
    throw error;
  }
};

