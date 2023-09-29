"use strict";
const mapper = require("../mappers/user");
const _ = require("underscore");
const moment = require("moment");
const mongoose = require("mongoose");
const updateEntities = require("../helpers/updateEntities");
const ObjectId = mongoose.Types.ObjectId;
const set = (model, entity) => {
  return updateEntities.update(model, entity);
};

const getById = async (id) => {
  return await db.user.findById(id).populate(populate);
};

const getByCondition = async (condition) => {
  return await db.user.findOne(condition).populate(populate);
};

// this user created by role
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
    let existUser = await db.user.findOne({email: model.user})
    if(existUser){
        throw "User Already exist Enter other Email"
    }
    let entity = new db.user.create(await mapper.newEntity(model));
    return await entity.save();
  } catch (error) {
    throw error;
  }
};

exports.update = async (id, model) => {
  try {
    // let roleInfo = await db.role.findById(model.roleId);
    let entity = await db.user.findById(id).populate(populate);
    set(model, entity);
    return entity.save();
  } catch (error) {
    throw error;
  }
};
exports.search = async (query, page, user) => {
  let where = {};
  const { search } = query;

  if (query.search) {
    where["$or"] = [
      {
        firstName: { $regex: query.search, $options: "i" },
      },
      {
        lastName: { $regex: query.search, $options: "i" },
      },
      {
        fullName: { $regex: query.search, $options: "i" },
      },
    ];
  }

  if (user.id) {
    where._id = { $ne: user.id };
  }
  if (query.createdBy) {
    where["createdBy"] = query.createdBy;
  }
  if (query.roleType) {
    where["roleId.roleType"] = query.roleType;
  }
  if (query.roleId) {
    where["roleId"] = new ObjectId(query.roleId);
  }

  const pipeline = [
    {
      $lookup: {
        from: "roles",
        // localField: "roleId",
        // foreignField: "_id",
        let: { roleId: "$roleId" }, 
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$roleId"] 
              }
            }
          },
          
        ],
        as: "roleId",
      },
    },
    {
      $unwind: "$roleId"
    },
    {
      $lookup: {
        from: "profiles",
        localField: "currentProfile",
        foreignField: "_id",
        as: "currentProfile",
      },
    },
    {
      $unwind: "$currentProfile"
    },
    {
      $lookup: {
        from: "profiles",
        localField: "profiles",
        foreignField: "_id",
        as: "profiles",
      },
    }
    
  ];
  const count = await db.user.countDocuments(where);

  let items;
  if (page) {
    pipeline.push(
      { $match: where },
      { $sort: { updatedAt: -1 } },
      { $skip: page.skip },
      { $limit: page.limit }
    );
    items = await db.user.aggregate(pipeline);
  } else {
    pipeline.push(
      {
        $match: where,
      },
      { $sort: { updatedAt: -1 } }
    );
    items = await db.user.aggregate(pipeline);
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
    let entity = await db.user.findById(id);
    if (entity) {
      return await db.user.deleteOne({ _id: entity.id });
    }
    return null;
  } catch (error) {
    throw error;
  }
};

exports.switchProfile = async (req, res) => {
  try {
    let userInfo = await db.user.findOne({ _id: req.user.id });
    if (userInfo && userInfo.currentProfile) {
      const currentProfileId = new ObjectId(userInfo.currentProfile);

      if (userInfo.profiles[0].equals(currentProfileId)) {
        userInfo.currentProfile = userInfo.profiles[1];
      }
      if (userInfo.profiles[1].equals(currentProfileId)) {
        userInfo.currentProfile = userInfo.profiles[0];
      }
      await userInfo.save();
    }
    return userInfo;
  } catch (error) {
    return error;
  }
};
