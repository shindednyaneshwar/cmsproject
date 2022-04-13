import mongoose from "mongoose";

const StuAcadetails= mongoose.Schema({
    sPRN :String,
    studentName:String,
    studentSem:String,
    subjects:Object//what i need?=> subject:{math:Strig,geo:Strig}
    
});


//pass_user_student => collection name => contains  all student username and password
const StuAcadetailsModel = mongoose.model('StuAcadetails',StuAcadetails);

export default StuAcadetailsModel;


