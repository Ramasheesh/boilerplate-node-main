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
    // match: { roleType: { $ne: "superAdmin" } },
    // match: { roleType },
    // match: {createdBy : {$eq: "admin"}}
    // match: { select: "-createdBy" },
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
          roleInfo.roleType != user //=== "manager" ||
          //   roleInfo.roleType === "admin" ||
          //   roleInfo.roleType === "superAdmin"
        ) {
          throw "permission not granted";
        }
        model.createdBy = "manager";
        break;
      // case "":
      //   if (roleInfo.roleType === "")
      //   model.createdBy = "user";
      //   break;
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
    let entity = await db.user.findById(id).populate(populate);
    set(model, entity);
    return entity.save();
  } catch (error) {
    throw error;
  }
};
exports.search = async (query, page, user) => {
  let where = {};

  if (query.fullName) {
    where["fullName"] = query.fullName;
  }
  if (user.id) {
    where["_id"] = { $ne: user.id };
  }
  if (query.createdBy) {
    where["createdBy"] = query.createdBy;
  }
  if (query.roleType) {
    where["user.roleId.roleType"] = query.roleType;
  }
  if (query.roleId) {
    where["roleId"] = new ObjectId(query.roleId);
  }

  const pipeline = [];
  // Add a $match stage to filter documents based on the 'where' criteria.
  pipeline.push({ $match: where });

  // Optionally, you can add a $sort stage to sort the documents by 'updatedAt'.
  pipeline.push({ $sort: { updatedAt: -1 } });

  // Optionally, add $skip and $limit stages for pagination if 'page' is provided.
  if (page) {
    const { skip, limit } = page;
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });
  }
  pipeline.push({
    $lookup: {
      from: "roles",
      localField: "roleId",
      foreignField: "_id",
      as: "hhhhh",
    },
  });
  // Perform the aggregation using the pipeline.
  const result = await db.user.aggregate(pipeline);

  // Count the matching documents separately.
  const count = await db.user.countDocuments(where);

  return {
    count,
    items: result,
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
    let entity = await db.user.findById(id);
    if (entity) {
      return await db.user.deleteOne({ _id: entity.id });
    }
    return null;
  } catch (error) {
    throw error;
  }
};
