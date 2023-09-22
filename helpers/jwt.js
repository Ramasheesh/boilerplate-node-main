'use strict';
var jwt = require('jsonwebtoken');
var auth = require('config').get('auth');

exports.getAccessToken = (user, session) => {
     var claims = {
          session: session.id,
          user: user.id,
     };
     return jwt.sign(claims, auth.secret, {
          expiresIn: auth.tokenPeriod,
     });
};

exports.getRefreshToken = (user) => {
     var claims = {
          user: user.id,
     };
     return jwt.sign(claims, auth.refreshSecret, {
          expiresIn: auth.refreshPeriod,
     });
};
exports.jwtSign = (payload) =>{
     try {
          return jwt.sign(payload,auth.secret, { expiresIn: auth.tokenPeriod });
      } catch (error) {
          throw error;
      }
}
exports.verifyToken = (token) => {
     return jwt.verify(token, auth.secret);
};

