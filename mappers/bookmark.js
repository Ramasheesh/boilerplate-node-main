"use strict";
const _ = require("underscore");
exports.toModel = (entity) => {
  const model = {
    id: entity._id,
    bookMarkById: entity.bookMarkById,
    bookMarkToId: entity.bookMarkToId,
    status: entity.status
  };
  return model;
};

exports.newEntity = async (body) => {
  const model = {
    bookMarkById: body.bookMarkById,
    bookMarkToId: body.bookMarkToId,
    status: body.status
  };
  return model;
};

exports.toSearchModel = (entities) => {
  return _.map(entities, exports.toModel);
};
