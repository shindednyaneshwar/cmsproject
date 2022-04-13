import mongoose from "mongoose";

const authData = mongoose.Schema({
  username:String,
  PRN:String,
  password:String,
  status:String,
  lastLogin:String

});

//pass_user_student => collection name => contains  all student username and password
const authDataModel = mongoose.model("authData", authData);

export default authDataModel;
