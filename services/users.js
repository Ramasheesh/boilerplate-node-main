"use strict";
const mapper = require("../mappers/user");
const _ = require("underscore");
const moment = require("moment");
const mongoose = require('mongoose');
const updateEntities = require("../helpers/updateEntities");
const populate = [
  // {
  //      path: 'role',
  // },
  // {
  //      path: 'profiles',
  // },
  // {
  //      path: 'currentProfile',
  // },
  // {
  //      path: 'userPlan',
  // },
];

const ObjectId = mongoose.Types.ObjectId

const set = (model, entity) => {
  return updateEntities.update(model, entity);
};

const getById = async (id) => {
  return await db.user.findById(id).populate(populate);
};

const getByCondition = async (condition) => {
  return await db.user.findOne(condition).populate(populate);
};

exports.create = async (model) => {
  try {
    let entity = new db.user(await mapper.newEntity(model));
    return await entity.save();
  } catch (error) {
    throw error;
  }
};

exports.update = async (id, model) => {
  try {
    let entity = await db.user.findById(id).populate(populate);
    set(model, entity);
    return entity.save();
  } catch (error) {
    throw error;
  }
};
exports.search = async (query, page) => {
  let where = {};
  // if (query.id) {
  //   where["_id"] = query.id;
  // }
  if(query.firstName){
    where['firstName'] = query.firstName
  }

  const count = await db.user.countDocuments(where);
  let items;
  if (page) {
    items = await db.user
      .find(where)
      .skip(page.skip)
      .limit(page.limit)
      .sort({ createdAt: -1 })
      // .populate(popuroutelate);
  } else {
    items = db.user.find(where).sort({ createdAt: -1 })//.populate(populate);
  }
  return {
    count,
    items,
  };
};

exports.get = async (query) => {
  try {
    if (typeof query === "string") {
      // if (query.isObjectId()) {
        return getById(query);
      // }
      // let data = await db.user.findById(query);
      // console.log("data: ", data);
      // return data;
    }

    if (query.id) {
      return getById(query.id);
    }

    if (query.name) {
      return getByCondition({ name: query.name });
    }
    return null; //"file not found";
  } catch (error) {
    throw error;
  }
};

exports.remove = async (id) => {
  try {
    let entity = await this.get(new ObjectId(id));
    if (entity) {
      return await entity.remove();
    }
    return null;
  } catch (error) {
    throw error;
  }
};
