"use strict";
const mapper = require("../mappers/profile");
const updateEntities = require("../helpers/updateEntities");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const set = (model, entity) => {
  return updateEntities.update(model, entity);
};

const getById = async (id) => {
  return await db.profile.findById(id);
};

const getByCondition = async (condition) => {
  return await db.profile.findOne(condition);
};

const populate = [
  {
    path: "roleId",
  },
];
exports.create = async (model, user) => {
  try {
    let entity = new db.profile(await mapper.newEntity(model));
    if (entity) {
      entity.userId = user.id;
    }
    return await entity.save();
  } catch (error) {
    throw error;
  }
};

exports.update = async (id, model) => {
  try {
    let entity = await db.profile.findById(id);
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
  const count = await db.profile.find(where).count();
  let items;
  if (page) {
    items = await db.profile
      .find(where)
      .sort({ name: 1 })
      .skip(page.skip)
      .limit(page.limit)
      .populate(populate);
  } else {
    items = await db.profile.find(where).sort({ name: 1 }); //.populate(populate);;
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
    let entity = await db.profile.findById(id );
    if (entity) {
      return await db.profile.deleteOne({ _id: entity.id });
    }
    return null;
  } catch (error) {
    throw error;
  }
};
