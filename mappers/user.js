"use strict";
const crypto = require("../helpers/crypto");
const _ = require("underscore");

exports.toModel = (entity) => {
  const model = {
    id: entity._id,
    fullName: entity.fullName,
    firstName: entity.firstName,
    lastName: entity.lastName,
    email: entity.email,
    isEmailVerified: entity.isEmailVerified,
    status: entity.status,
    loginType: entity.loginType,
    token: entity.token,
    roleId: entity.roleId,
    createdBy: entity.createdBy,
    otp: entity.otp,
    currentProfile: entity.currentProfile,
    profiles: entity.profiles,
  bookmarks: entity.bookmarks,
  profileImageUrl: entity.profileImageUrl
  };
  return model;
};

exports.toSearchModel = (entities) => {
  return _.map(entities, exports.toModel);
};

exports.toAuthModel = (entity) => {
  let model = exports.toModel(entity);
  if (entity.session) {
    model.accessToken = entity.session.accessToken;
  }
  return model;
};

exports.newEntity = async (body, createdByAdmin = true) => {
  const model = {
    fullName: body.fullName,
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    loginType: body.loginType,
    isEmailVerified: body.isEmailVerified,
    status: body.status,
    token: body.token,
    roleId: body.roleId,
    createdBy: body.createdBy,
    otp: body.otp,
    currentProfile: body.currentProfile,
    profiles: body.profiles,
  bookmarks: body.bookmarks,
  profileImageUrl : body.bookmarks
  };
  if (body.password) {
    model.password = await crypto.setPassword(body.password);
  }

  if (createdByAdmin) {
    if (body.loginType == "email") {
      model.isEmailVerified = true;
    } else if (body.loginType == "phone") {
      model.isPhoneVerified = true;
    }
    model.status = "active";
  }
  return model;
};
