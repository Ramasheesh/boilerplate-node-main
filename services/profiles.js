"use strict";
const mapper = require("../mappers/profile");
const updateEntities = require("../helpers/updateEntities");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const populate = [
  {
    path: "userId",
    match: { profileType: { $eq: "driver" } },
  },
];
const set = (model, entity) => {
  return updateEntities.update(model, entity);
};

const getById = async (id) => {
  return await db.profile.findById(id);
};

const getByCondition = async (condition) => {
  return await db.profile.findOne(condition);
};

exports.create = async (model, user) => {
  try {
    let userInfo = await db.user.findById(user.id);


    if (userInfo && userInfo.profiles.length === 0) {
      let entity = new db.profile(await mapper.newEntity(model));
      entity.userId = userInfo.id;
      userInfo.currentProfile = new ObjectId(entity.id);
      userInfo.profiles.push(new ObjectId(entity.id));
      await userInfo.save();
      return await entity.save();
    } 
    

    else if (userInfo && userInfo.profiles.length === 1) {
      let existedProfile = await db.profile.findById(userInfo.profiles[0]);
      if (existedProfile.profileType === model.profileType) {
        throw "this profiles type already existed";
      }
      let entity = new db.profile(await mapper.newEntity(model));
      entity.userId = userInfo.id;
      userInfo.profiles.push(new ObjectId(entity.id));
      userInfo.save();
      return await entity.save();
    } 
    else {
      throw "you already have two profiles";
    }
  
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
  const { search } = query;
  if (query.search) {
    where["$or"] = [
      {
        name: { $regex: query.search, $options: "i" },
      },
      {
        profileType: { $regex: query.search, $options: "i" },
      },
    ];
  }
  // if (user.userId) {
  //   where._id = { $ne: user.userId };
  // }
  if (query.profileType) {
    where["profileType"] = query.profileType;
  }
  if (query.name) {
    where["name"] = query.name;
  }
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
    let entity = await db.profile.findById(id);
    if (entity) {
      return await db.profile.deleteOne({ _id: entity.id });
    }
    return null;
  } catch (error) {
    throw error;
  }
};

exports.uploadProfile = async()=>{
  
}