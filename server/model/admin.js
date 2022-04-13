import mongoose from "mongoose";

const AdminInfo = mongoose.Schema({
  aPRN:String,
  aname: String,
  aemail: String,
aaddress: String,
  apin: Number,
  astate: String,
  adob: String,
amob: Number,
 
  agender: String,
 isFacultyAllow:Boolean,
 isStudentAllow:Boolean,

  
  apic: {
    data: Buffer,
    typeof: String,
  }




});

//pass_user_student => collection name => contains  all student username and password
const AdminInfoModel = mongoose.model("AdminInfo", AdminInfo);

export default AdminInfoModel;
