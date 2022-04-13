import jwt from "jsonwebtoken";
import authDataModel from "../model/authenticationData.js";
import 'dotenv/config'

export const verify = async (req, res, next) => {
  const authHeader = req.headers.autherization;

  console.log("verifyyy madhhe authheaedesrss", authHeader);

  
  if (authHeader) {
    jwt.verify(authHeader,process.env.CMS_SECRETE_KEY, (error, user) => {
      console.log("req.headers.autherization>>>>>", user);
      if (user) {
        res.locals.mydata = user;
        next();
      } else {
        console.log(
          "Error while verifyin middleware/userVerification/verify==>",
          error
        );
      }
    });
  } else {
    console.log(
      "Error while verifyin middleware/userVerification/verify==> Not Getting Token"
    );
  }
};









export const   checkMail = async (req, res) => {
   

    try {
       
      const isMailExist = await authDataModel.findOne({username:req.params.data});
     
   if(!isMailExist){

    console.log('LLLL',isMailExist)
    res.status(200).json(isMailExist);
   }else{
    console.log('LLLelseL',isMailExist)
    res.status(203).json({message:"Email Not Allow"});

   }

      
    } catch (error) {
      console.log("error___>>", error.message);
      res.status(203).json({message:"Problem while deleting Subject"});
  
    }
  };