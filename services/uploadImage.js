const multer = require('multer');
const path = require('path');


let storage = multer.diskStorage({
    destination:function(req,file,callback){
      callback(null,path.join('./public'))
    },
    filename:function(req,file,callback){
      callback(null, file.fieldname+ "_" + Date.now()+ ".jpg")
    },
  })

const singleUpload = multer({storage:storage})
module.exports = {singleUpload: singleUpload} 

// const multerFilter = (req, file, cb) => {
//     if (file.mimetype.split("/")[1] === "jpg") {
//       cb(null, true);
//     } else {
//       cb(new Error("Not a jpg File!!"), false);
//     }
//   };
//   module.exports = multer({
//     fileFilter: multerFilter,
//   });