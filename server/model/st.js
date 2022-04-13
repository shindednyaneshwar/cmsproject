import mongoose from "mongoose";



const StudentInfo= mongoose.Schema({
    sPRN :String,
    sname:String,
    semail:String,
    sdept:String,
    syear:String,
    ssemester:String,
    saddress:String,
    smob:String,
    spic:String,
    subjects:Object
});




//pass_user_student => collection name => contains  all student username and password
const StudentInfoModel = mongoose.model('StudentInfo',StudentInfo);

export default StudentInfoModel;


