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
    path: "userId",
    match: { profileType: { $eq: "driver" } },
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

exports.search = async (query, page, userId) => {
  let where = {};
  const { search } = query;

  if (query.search) {
    where["$or"] = [
      {
        name: { $regex: query.search, $options: "i" },
      },
      {
        profileType: { $regex: query.search, $options: "i" },
      },
      {
        zipCode: { $regex: query.search, $options: "i" },
      },
    ];
  }

  // if (userId.id) {
  //   userId._id = { $ne: user.id };
  // }
  const pipeline = [
    {
      $lookup: {
        from: "users",
        let: { localUserId: "$userId" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$localUserId"],
              },
            },
          },
          {
            $project: {
              _id: 0,
              fullName: 1,
              firstName: 1,
              lastName: 1,
              email: 1,
            },
          },
        ],
        as: "userId",
      },
    },
    {
      $unwind: {
        path: "$userId",
        preserveNullAndEmptyArrays: true,
      },
    },
  ];
  const count = await db.profile.countDocuments(where);

  let items;
  if (page) {
    pipeline.push(
      { $match: where },
      { $sort: { updatedAt: -1 } },
      { $skip: page.skip },
      { $limit: page.limit }
    );
    items = await db.profile.aggregate(pipeline);
  } else {
    pipeline.push(
      {
        $match: where,
      },
      { $sort: { updatedAt: -1 } }
    );
    items = await db.profile.aggregate(pipeline);
  }
  return {
    count,
    items,
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
