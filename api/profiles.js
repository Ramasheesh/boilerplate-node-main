const base = require("./api-base")("profiles", "profile"); // role of services and role of mapper
const check = require("../validators/users");
exports.create = async (req, res) => {
  try {
    let validate = await check.canCreateProfile(req);
    if (!validate.isSuccess) {
      return res.failure(validate.message);
    }
    let retVal = await base.create(req);
    return res.data(retVal);
  } catch (error) {
    res.failure(error);
  }
};

exports.update = async (req, res) => {
  try {
    let validate = await check.canUpdate(req);
    if (!validate.isSuccess) {
      return res.failure(validate.message);
    }

    let retVal = await base.update(req);
    return res.data(retVal);
  } catch (error) {
    res.failure(error);
  }
};

exports.search = async (req, res) => {
  try {
    let retVal = await base.search(req);
    return res.pageWithPaging(
      retVal.items,
      retVal.pageNo,
      retVal.limit,
      retVal.total
    );
  } catch (error) {
    res.failure(error);
  }
};

exports.get = async (req, res) => {
  try {
    let retVal = await base.get(req);
    return res.data(retVal);
  } catch (error) {
    res.failure(error);
  }
};

exports.delete = async (req, res) => {
  try {
    let retVal = await base.delete(req);
    return res.success(retVal);
  } catch (error) {
    res.failure(error);
  }
};
