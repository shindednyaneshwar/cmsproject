import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs'
import authDataModel from "../model/authenticationData.js";
import 'dotenv/config'
console.log(process.env.CMS_SECRETE_KEY)

export  const verifyAuth = async(req, res, next) => {
    console.log("el???????????????????se")
  
const {username,password,status}=req.body;

console.log("data",username+" "+password+" "+status)


try{
    
    let temp;
    if(username.includes("@")){
temp= await authDataModel.findOne({"username":username,"status":status})
    }else{
        console.log("el???????????????????se")

        temp= await authDataModel.findOne({"PRN":username,"status":status})

    }



if(temp){

    var today = new Date();
    var date = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    
    const dateAndTime=date+' '+time
    // const logInfo= await authDataModel.findOne({"username":username,"status":status})
    
   console.log(">>>>><<<< temp",temp)
    
    var isValid=await bcrypt.compare(password,temp.password)
    if(isValid ){




        if(username.includes("@")){
           
            const temp1= await authDataModel.findOneAndUpdate({"username":username,"status":status},{$set:{lastLogin:dateAndTime  }})

            
                }else{
        const temp1= await authDataModel.findOneAndUpdate({"PRN":username,"status":status},{$set:{lastLogin:dateAndTime  }})
            
                }


    

        const token=jwt.sign({username:temp.username,user:temp.status,PRN:temp.PRN,lastLogin:temp.lastLogin},process.env.CMS_SECRETE_KEY,{expiresIn:"7200s"})
    console.log("UserLogin This is token",token)
    res.status(200).json({username:temp.username,user:temp.status,PRN:temp.PRN,token:token,isLogin:true})
    
    }else{
        console.log("Logger Not Allow>>>",req.body,)
        res.status(203).json({message:"Username Or Password Wrong"}) 
    }
}else{
    console.log(">>>>>>>>>>>>>UserLogin  nOt allow")
    res.status(203).json({message:"Username Or Password Wrong"})


}









}catch(error){

console.log("verifyAuth >error>>",error.message)

}

};
