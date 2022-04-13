

import nodemailer from 'nodemailer';
import 'dotenv/config'
import express from "express";
import otpVerificationModel from '../model/otpVerification.js';
const router = express.Router();


console.log(process.env.CMS_COMPANY_EMAIL)
/*------------------SMTP Over-----------------------------*/

/*------------------Routing Started ------------------------*/

export function otpSentVarification(req,res){

    var smtpTransport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user:process.env.CMS_COMPANY_EMAIL,
            pass:process.env.CMS_COMPANY_PASSWORD
        }
    });

      const mailTo=req.body.username
      console.log(">>>>>",mailTo)

       const OTP=Math.floor((Math.random() * 123) + 5854);
    
   var  mailOptions={
        to : mailTo,
        subject : "Please confirm your Email account",
        html : "Hello,<br>Thank You for being part of our Organization<br> Below is OTP use this for change Your Password / Validate Email Account</br>OTP valid for only 10 min<br/>OTP :<h2>"+OTP+"</h2>" 
    }
    console.log("mailoption>>>",mailOptions);
    smtpTransport.sendMail(mailOptions, async function(error, response){


        const result= await saveToDatabase({mailTo,OTP});
     if(error){
            console.log(error);
            res.status(400).json({mesage:"Not Ok"})
      
     }else{
            console.log("Message sent: " + response.messageId);
            res.status(200).json({mesage:"OTP successfully sent"})
         }

 
});
};


async function saveToDatabase(data){
    
    console.log(">>>>>",data.mailTo+data.OTP)

    try{

   const current=new Date();
   
        const val=current.getTime()+1000*60*10;
       
        console.log("??>>>",val)

      const temp= new otpVerificationModel({  username:data.mailTo,
        otp:data.OTP,
        validity:val})

        const isDataSave=await temp.save();

        console.log("OYTPP>>>>",isDataSave)


 return true

    }catch(error){
console.log("error in saveToDatabase",error.message)
return false
    }

}