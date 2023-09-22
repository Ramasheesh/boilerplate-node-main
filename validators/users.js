'use strict';

exports.canCreate = (req) => {
     let data = {
          isSuccess: false,
     };
     if (!req.body) {
          data.message = 'invalid request';
          return data;
     }

     if (!req.body.email) {
          data.message = 'email is required';
          return data;
     }
     if (!req.body.firstName) {
          data.message = 'firstName is required';
          return data;
     }
     if (!req.body.password) {
          data.message = 'password is required';
          return data;
     }
     if (!req.body.roleId) {
          data.message = 'add role id';
     }

     data.isSuccess = true;
     return data;
};

exports.canUpdate = (req) => {
     let data = {
          isSuccess: false,
     };
     if (!req.body) {
          data.message = 'invalid request';
          return data;
     }

     data.isSuccess = true;
     return data;
};
exports.canSend = (req) => {
     let data = {
          isSuccess: false,
     };
     if (!req.body) {
          data.message = 'invalid request';
          return data;
     }
     if (!req.body.email) {
          data.message = 'email required';
          return data;
     }
     if(!req.body.name){
          data.message = 'name required';
          return data
     }

     data.isSuccess = true;
     return data;
};


exports.canChange = (req) => {
     let data = {
          isSuccess: false,
     };
     if (!req.body) {
          data.message = 'invalid request';
          return data;
     }
     if (!req.body.status) {
          data.message = 'status required';
          return data;
     }

     data.isSuccess = true;
     return data;
};
exports.canSwitch = (req) => {
     let data = {
          isSuccess: false,
     };
     if (!req.body) {
          data.message = 'invalid request';
          return data;
     }
     if (!req.body.profileId) {
          data.message = 'profile Id required';
          return data;
     }

     data.isSuccess = true;
     return data;
};

exports.canUpdateCarrier = (req) => {
     let data = {
          isSuccess: false,
     };
     if (!req.body) {
          data.message = 'invalid request';
          return data;
     }
     if (!req.body.status) {
          data.message = 'required request';
          return data;
     }

     data.isSuccess = true;
     return data;
};

exports.canCreateProfile = (req) => {
     let data = {
          isSuccess: false,
     };
     if (!req.body) {
          data.message = "invalid request";
          return data;
     }
     if (!req.body.name) {
          data.message = "please enter name";
          return data;
     }
     if (!req.body.address1) {
          data.message = "please enter address1";
          return data;
     }
     if (!req.body.city) {
          data.message = "please enter city";
          return data;
     }
     if (!req.body.state) {
          data.message = "please enter state";
          return data;
     }
     if (!req.body.country) {
          data.message = "please enter country";
          return data;
     }
     if (!req.body.zipCode) {
          data.message = "please enter zip code";
          return data;
     }
     data.isSuccess = true;
     return data;
};


exports.canAddCustomer = async (req) => {
     let data = {
          isSuccess: false,
     };
     if (!req.body) {
          data.message = "invalid request";
          return data;
     }
     if (!req.body.name) {
          data.message = "please enter name";
          return data;
     }
     if (!req.body.email) {
          data.message = "please enter email";
          return data;
     }
     if (!req.body.accountType) {
          data.message = "please enter accountType";
          return data;
     }
     if (!req.body.address1) {
          data.message = "please enter address";
          return data;
     }
     if (!req.body.city) {
          data.message = "please enter city";
          return data;
     }
     if (!req.body.state) {
          data.message = "please enter state";
          return data;
     }
     if (!req.body.country) {
          data.message = "please enter country";
          return data;
     }
     if (!req.body.zipCode) {
          data.message = "please enter zip code";
          return data;
     }
     data.isSuccess = true;
     return data;
};




