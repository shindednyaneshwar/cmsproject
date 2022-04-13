import mongoose from "mongoose";

const PrnGenerator = mongoose.Schema({
 faculty:Number,
 student:Number,
 subject:Number,
 admin:Number,
 
});

//pass_user_student => collection name => contains  all student username and password
const PrnGeneratorModel = mongoose.model("PrnGenerator", PrnGenerator);

export default PrnGeneratorModel;
