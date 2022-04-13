import mongoose from "mongoose";

const Subject=mongoose.Schema({
    subID:String,
    sname:String,
    sdept:String,
    ssemester:String,
    isAllocate:Boolean

})

const subjectInfoModel=mongoose.model('subject',Subject);

export default subjectInfoModel;