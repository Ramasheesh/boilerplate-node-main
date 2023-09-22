'use strict';
var bcrypt = require('bcryptjs');

exports.setPassword = async (password) => {
     let salt = bcrypt.genSaltSync(10);
     return bcrypt.hashSync(password, salt);
};

exports.comparePassword = async (password, hash) => {
     return bcrypt.compareSync(password, hash);
};
// exports.comparePasswordUsingBcrypt= async (password,hashPassword) => {
//      // const hash = await bcrypt.genSalt(10);
//      return bcrypt.compareSync(password, hashPassword)
//  },

exports.compareNum = (num1, num2) => {
     return num1 === num2;
};
