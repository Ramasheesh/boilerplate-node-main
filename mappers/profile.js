"use strict";
const _ = require("underscore");
exports.toModel = (entity) => {
  const model = {
    id: entity._id,
    name: entity.name,
    fullAddress: entity.fullAddress,
    city: entity.city,
    state: entity.state,
    country: entity.country,
    zipCode: entity.zipCode,
    profileImage: entity.profileImage,
    profileType: entity.profileType,

    userId: entity.userId,
  };
  return model;
};

exports.newEntity = async (body) => {
  const model = {
    name: body.name,
    fullAddress: body.fullAddress,
    city: body.city,
    state: body.state,
    country: body.country,
    zipCode: body.zipCode,
    profileImage: body.profileImage,
    profileType: body.profileType,

    userId: body.userId,
  };
  return model;
};

exports.toSearchModel = (entities) => {
  return _.map(entities, exports.toModel);
};
