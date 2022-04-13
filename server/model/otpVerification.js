import mongoose from "mongoose";

const otpVerification = mongoose.Schema({
  username:String,
  otp:String,
  validity:String
  

});

//pass_user_student => collection name => contains  all student username and password
const otpVerificationModel = mongoose.model("otpVerification", otpVerification);

export default otpVerificationModel;
