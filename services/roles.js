"use strict";
const mapper = require("../mappers/role");
const updateEntities = require("../helpers/updateEntities");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const set = (model, entity) => {
  return updateEntities.update(model, entity);
};

const getById = async (id) => {
  return await db.role.findById(id);
};

const getByCondition = async (condition) => {
  return await db.role.findOne(condition);
};

const populate = [
  {
    path: "roleId"
  }
];
exports.create = async (model ) => {
  try {

    let entity = new db.role(await mapper.newEntity(model));
    return await entity.save();
  } catch (error) {
    throw error;
  }
};

exports.update = async (id, model) => {
  try {
    let entity = await db.role.findById(id);
    set(model, entity);
    return entity.save();
  } catch (err) {
    throw err;
  }
};

exports.search = async (query, page) => {
  let where = {};

  if (query.name) {
    where.name = {
      $regex: query.name,
      $options: "i",
    };
  }

  where.query = query;
  const count = await db.role.find(where).count();
  let items;
  if (page) {
    items = await db.role
      .find(where)
      .sort({ name: 1 })
      .skip(page.skip)
      .limit(page.limit)
      .populate(populate);
  } else {
    items = await db.role.find(where).sort({ name: 1 }); //.populate(populate);;
  }

  return {
    count: count,
    items: items,
  };
};

exports.get = async (query) => {
  if (typeof query === "string") {
    // if (query.isObjectId()) {
    return getById(query);
    // }
  }
  if (query.id) {
    return getById(query.id);
  }
  if (query.name) {
    return getByCondition({
      name: query.name,
    });
  }
  return null;
};

exports.remove = async (id) => {
  try {
    let entity = await this.get(id);
    if (entity) {
      return await entity.remove();
    }
    return null;
  } catch (error) {
    throw error;
  }
};
