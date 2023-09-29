const base = require("./api-base")("users", "user");
const check = require("../validators/users");
const userServices = require('../services/users')

exports.create = async (req, res) => {
  try {
    // console.log("h");
    let validate = check.canCreate(req);
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
    let validate = check.canUpdate(req);
    if (!validate.isSuccess) {
      return res.failure(validate.message);
    }
    let retVal = await base.update(req);
    // console.log('retVal: ', retVal);
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
      retVal.totalRecords,
    );
  } catch (error) {
    return res.failure(error);
  }
};

exports.get = async (req, res) => {
  try {
    let retVal = await base.get(req);
    return res.data(retVal);
  } catch (error) {
    return res.failure(error);
  }
};

exports.delete = async (req, res) => {
  try {
    let retVal = await base.delete(req);
    return res.success(retVal);
  } catch (error) {
    return res.failure(error);
  }
};

exports.switchProfile = async(req,res)=>{
  try {
    // let validate = check.canCreate(req);
    // if (!validate.isSuccess) {
    //   return res.failure(validate.message);
    // }
    let result = await userServices.switchProfile(req)
    return res.success(result)
  } catch (error) {
    return res.failure(error)
  }
}


