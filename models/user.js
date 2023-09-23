module.exports = {
     firstName: String,
     lastName: String,
     roleId : String,
     authType: {
          type: String,
          enum: ['email', 'google', 'facebook', 'apple', 'github', 'phone'],
          default: 'email',
     },
     email: String,
     password: String,
     salt: String,
     status: {
          type: String,
          enum: ['pending', 'active', 'inactive', 'deleted', 'blocked'],
          default: 'pending',
     },
     isEmailVerified: { type: Boolean, default: false },
     isTokenExpire : {type : Boolean , default: false },
     // isLoggedIn: false,
     token:String,
     otp:String,
     lastLogin: Date
};
