"use strict";
const _ = require("underscore");
exports.toModel = (entity) => {
  const model = {
    id: entity._id,
    name: entity.name,
    type: entity.type,
    role: entity.role,
  };
  return model;
};

exports.newEntity = async (body) => {
  const model = {
    type: body.type,
    name: body.name,
    role: body.role,
  };
  return model;
};

exports.toSearchModel = (entities) => {
  return _.map(entities, exports.toModel);
};
