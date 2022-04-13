import mongoose from "mongoose";

const FacultyInfo = mongoose.Schema({
  fPRN:String,
  fname: String,
  femail: String,
  faddress: String,
  fpin: Number,
  fstate: String,
  fdob: String,
  fmob: Number,
  fedu: String,
  fgender: String,
  fdept: String,
  allocateSubject:Array,
  
  fpic: {
    data: Buffer,
    typeof: String,
  },
});

//pass_user_student => collection name => contains  all student username and password
const FacultyInfoModel = mongoose.model("FacultyInfo", FacultyInfo);

export default FacultyInfoModel;
