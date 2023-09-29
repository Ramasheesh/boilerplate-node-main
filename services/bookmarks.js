"use strict";
const mapper = require("../mappers/bookmark");
const updateEntities = require("../helpers/updateEntities");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const populate = [{ path: "bookMarkById" }];
const getById = async (id) => {
  return await db.bookmark.findById(id).populate(populate);
};

const getByCondition = async (condition) => {
  return await db.bookmark.findOne(condition).populate(populate);
};

exports.create = async (model, user) => {
  try {
    let userData = await db.user.findOne({ _id: user.id });
    if (!userData) {
      throw "user data not found";
    }
    let bookmarkData = await db.bookmark.findOne(model.id);
    if (bookmarkData) {
      throw "You already bookmarked";
    }
    else{
        let entity = new db.bookmark(await mapper.newEntity(model));
    entity.bookMarkById = userData.id;
    await entity.save();
    }
    return await entity.save();
  } catch (error) {
    throw error;
  }
};

exports.update = async (id, model) => {
  try {
    let entity = await db.bookmark.findById(id);
    if (!entity) throw "book marks not found";
    if (entity.status !== model.status) {
      entity.status = model.status;
    } else {
      throw { message: `This customer is ${model.status}` };
    }
    await entity.save();
    return entity.save();
  } catch (err) {
    throw err;
  }
};

exports.search = async (query, page) => {
  try {
    let where = {};
  if (query.status) {
    where["status"] = query.status;
  }
  
  const pipeline = [
    {
      $lookup: {
        from: "users",
        // localField: "bookMarkById",
        // foreignField: "_id",
        let: { localUserId: "$bookMarkById" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$localUserId"],
              },
            },
          },
        ],
        as: "bookMarkById",
      },
    },
    {
      $unwind: {
        path: "$bookMarkById",
        preserveNullAndEmptyArrays: true,
      },
    },
  ];
  const count = await db.bookmark.find(where).count();
  let items;
  if (page) {
    pipeline.push(
      { $match: where },
      { $sort: { updatedAt: -1 } },
      { $skip: page.skip },
      { $limit: page.limit }
    );
    items = await db.bookmark.aggregate(pipeline);
  } else {
    pipeline.push(
      {
        $match: where,
      },
      { $sort: { updatedAt: -1 } }
    );
    items = await db.bookmark.aggregate(pipeline);
  }
  return {
    count: count,
    items: items,
  };
  } catch (error) {
    throw error
  }
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
  if (query.status) {
    return getByCondition({
        status: query.status,
    });
  }
  return null;
};

exports.remove = async (id) => {
  try {
    let entity = await db.bookmark.findById(id);
    if (entity) {
      return await entity.deleteOne();
    }
  } catch (error) {
    throw error;
  }
};

