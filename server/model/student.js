import mongoose from "mongoose";

const userLoginStudent= mongoose.Schema({
    username:String,
    password:String,
    status:String
});


//pass_user_student => collection name => contains  all student username and password
const loginStudentModel = mongoose.model('pass_user_student',userLoginStudent);

export default loginStudentModel;