import mongoose from "mongoose";



const StudentInfo= mongoose.Schema({
    sPRN:String,
    sname:String,
    semail:String,
    saddress:String,
    sstate:String,
    spin:Number,
    sdob:String,
    sgender:String,
    sdept:String,
    ssemester:String,
    smob:String,
   spic:{
        data:Buffer,
        typeof:String
    }
});




//pass_user_student => collection name => contains  all student username and password
const StudentInfoModel = mongoose.model('StudentInfo',StudentInfo);

export default StudentInfoModel;


