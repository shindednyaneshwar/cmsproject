import mongoose from "mongoose";

const notification = mongoose.Schema({
  title:String,
  file:String,
  publisher:String,
  semester:Array,
  dept:Array,
  

});

//pass_user_student => collection name => contains  all student username and password
const notificationModel = mongoose.model("notification", notification);

export default notificationModel;
