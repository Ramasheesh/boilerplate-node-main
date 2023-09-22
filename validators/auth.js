"use strict";
exports.canRegister = async (req) => {
  const loginTypes = ['facebook', 'google', 'apple', "email", "phone"];
  let data = {
    isSuccess: false,
  };

  if (!req.body) {
    data.message = "invalid request";
    return data;
  };

  if (!req.body.loginType) {
    req.body.loginType = "email";
  }

  if (!loginTypes.includes(req.body.loginType)) {
    data.message = "loginType required";
    return data
  };

  switch (req.body.loginType) {

    case "phone":
      if (!req.body.phone) {
        data.message = "phone required";
        return data;
      }
      data.isSuccess = true;
      return data;

    case "facebook":
      if (!req.body.facebookId) {
        data.message = "facebookId required";
        return data
      };
      data.isSuccess = true;
      return data;

    case "google":
      if (!req.body.email) {
        data.message = "email required";
        return data;
      }
      if (!req.body.googleId) {
        data.message = "googleId required";
        return data
      };
      data.isSuccess = true;
      return data;

    case "apple":
      if (!req.body.appleId) {
        data.message = "appleId required";
        return data
      };
      if (!req.body.email) {
        data.message = "email required";
        return data;
      }
      data.isSuccess = true;
      return data;

    default:
      if (!req.body.email) {
        data.message = "email required";
        return data;
      }
      if (!req.body.password) {
        data.message = "password required";
        return data;
      }
      data.isSuccess = true;
      return data;
  }
};
exports.canLogin = async (req)=>{
  let data = {
    isSuccess: false,
  };

  if (!req.body) {
    data.message = "invalid request";
    return data;
  };
  if (!req.body.email) {
    data.message = "email is required";
    return data;
  };

  if (!req.body.password) {
    req.body.password = "password is required";
  }
  data.isSuccess = true;
  return data;
}

exports.canSetPassword = (req) => {
  let data = {
       isSuccess: false,
  };
  if (!req.body) {
       data.message = 'invalid request';
       return data;
  }
  if (!req.body.password) {
       data.message = 'password required';
       return data;
  }

  data.isSuccess = true;
  return data;
};