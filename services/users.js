"use strict";
const mapper = require("../mappers/user");
const _ = require("underscore");
const moment = require("moment");
const mongoose = require("mongoose");
const updateEntities = require("../helpers/updateEntities");
const ObjectId = mongoose.Types.ObjectId;

const populate = [
  {
    path: "roleId",
    match: { select: "-createdBy" },
  },
];
//
const set = (model, entity) => {
  return updateEntities.update(model, entity);
};

const getById = async (id) => {
  return await db.user.findById(id).populate(populate);
};

const getByCondition = async (condition) => {
  return await db.user.findOne(condition).populate(populate);
};

exports.create = async (model, user) => {
  try {
    let roleInfo = await db.role.findById(model.roleId);
    switch (user.roleId.roleType) {
      case "superAdmin":
        if (roleInfo.roleType === "superAdmin") {
          throw "permission not granted";
        }
        model.createdBy = "superAdmin";
        break;

      case "admin":
        if (
          roleInfo.roleType === "admin" ||
          roleInfo.roleType === "superAdmin"
        ) {
          throw "permission not granted";
        }
        model.createdBy = "admin";
        break;

      case "manager":
        if (
          roleInfo.roleType === "manager" ||
          roleInfo.roleType === "admin" ||
          roleInfo.roleType === "superAdmin"
        ) {
          throw "permission not granted";
        }
        model.createdBy = "manager";
        break;

      default:
        throw "permission not granted";
    }
    let entity = new db.user(await mapper.newEntity(model));
    return await entity.save();
  } catch (error) {
    throw error;
  }
};

exports.update = async (id, model, user) => {
  try {
    let roleInfo = await db.role.findById(model.roleId);

    if (roleInfo.roleType === "superAdmin" || roleInfo.roleType === "admin") {
      let entity = await db.user.findById(id).populate(populate);
      set(model, entity);
      return entity.save();
    } else {
      throw "permission not granted";
    }
  } catch (error) {
    throw error;
  }
};
exports.search = async (query, page) => {
  let where = {};
  // if (query.id) {
  //   where["_id"] = query.id;
  // }
  const populate = [
    {
      path: "roleId",
      match: { roleType: { $ne: "superAdmin" } },
      // match: { select: "-roleType" },
    },
  ];
  if (query.fullName) {
    where["fullName"] = query.fullName;
  }

  const count = await db.user.countDocuments(where);
  // console.log("count: ", count);
  let items;
  if (page) {
    items = await db.user
      .find(where)
      .skip(page.skip)
      .limit(page.limit)
      .sort({ createdAt: -1 })
      .populate(populate);
  } else {
    items = db.user
      .find(where) // { roleId: 0 }
      .sort({ createdAt: -1 })
      .populate(populate);
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
      return await entity.delete();
    }
    return null;
  } catch (error) {
    throw error;
  }
};
