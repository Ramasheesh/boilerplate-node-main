"use strict";
const _ = require("underscore");
exports.toModel = (entity) => {
  const model = {
    id: entity._id,
    name: entity.name,
    roleType: entity.roleType,
  };
  return model;
};

exports.newEntity = async (body) => {
  const model = {
    name: body.name,
    roleType: body.roleType,
  };
  return model;
};

exports.toSearchModel = (entities) => {
  return _.map(entities, exports.toModel);
};
