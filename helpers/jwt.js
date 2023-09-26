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

// const roles = {
//   superAdmin: ["create", "update", "get", "search", "delete"],
//   admin: ["create", "update", "get"],
//   manager: ["get"],
// };
// exports.authorize = (role, action) => {
//   return (req, res, next) => {
//     if (roles[role] && roles[role].includes(action)) {
//       // User has the required role and permission
//       next();
//     } else {
//       // User is not authorized
//       res.status(403).json({ message: "Access denied." });
//     }
//   };
// }