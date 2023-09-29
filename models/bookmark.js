const  mongoose  = require("mongoose");

module.exports = {
    bookMarkById : {type : mongoose.Types.ObjectId , ref: "user" },
    bookMarkToId : {type: mongoose.Types.ObjectId , ref: "user"},
    status: {type: String , enum: ["active" , "inActive","pending"],default: "pending"},
}