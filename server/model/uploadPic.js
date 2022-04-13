import mongoose from "mongoose";

const UploadPic=mongoose.Schema({
    
    photo:String,
    name:String,
    img:{
        data:Buffer,
        typeof:String
    }
   

})

const UploadPicModel=mongoose.model('UploadPic',UploadPic);

export default UploadPicModel;