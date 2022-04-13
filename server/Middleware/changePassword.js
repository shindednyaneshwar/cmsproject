import authDataModel from "../model/authenticationData.js";

export async function changePassword(req,res){


    const crypted = await bcrypt.hash(req.body.password, 4);
    console.log("Hashed password", crypted);

try{

    const tempData = await  authDataModel.findOneAndUpdate({username:req.body.username},{$set:{password: crypted}});
   
 if(tempData){
     res.status(200).json({message:"successFully new Password set"})
 }else{
    res.status(203).json({message:"check  email address"})

 }

}catch(error){
    res.status(203).json({message:"something is wrong,may be your mail Id"})


}

}