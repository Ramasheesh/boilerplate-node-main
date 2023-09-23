'use strict';
const crypto = require('../helpers/crypto');
const _ = require('underscore');

exports.toModel = (entity) => {
     const model = {
          id: entity._id,
          firstName: entity.firstName,
          lastName: entity.lastName,
          email: entity.email,
          isEmailVerified: entity.isEmailVerified,
          status: entity.status,
          loginType: entity.loginType,
          token:entity.token,
          roleId : entity.roleId,
          otp: entity.otp
     };
     return model;
};

exports.toSearchModel = (entities) => {
     return _.map(entities, exports.toModel);
};

exports.toAuthModel = (entity) => {
     let model = exports.toModel(entity);
     if (entity.session) {
          model.accessToken = entity.session.accessToken;
     }
     return model;
};

exports.newEntity = async (body, createdByAdmin = true) => {
     const model = {
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
          loginType: body.loginType,
          token:body.token,
          roleId: body.roleId,
          otp: body.otp
     };
     if (body.password) {
          model.password = await crypto.setPassword(body.password);
     }

     if (createdByAdmin) {
          if (body.loginType == 'email') {
               model.isEmailVerified = true;
          } else if(body.loginType == 'phone'){
               model.isPhoneVerified = true;
          }
          model.status = 'active';
     }
     return model;
};
