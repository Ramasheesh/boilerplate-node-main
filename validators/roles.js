'use strict';

exports.canCreate = (req) => {
     
     let data = {
          isSuccess: false,
     };
     if (!req.body.name) {
          data.message = 'name is required';
          return data;
     };
  

     data.isSuccess = true;
     return data;
};