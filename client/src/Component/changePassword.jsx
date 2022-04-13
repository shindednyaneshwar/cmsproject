import { useEffect, useState } from "react";
import logo from "./../Assets/Images/logo.jpeg";
import { Link, Redirect, useHistory } from "react-router-dom";
import { checkMail, setNewPass } from "../Api/adminApi.js";
import {
  checkLogger,
  otpSentVarification,
  verifyOtp,
} from "../Api/adminApi.js";
import "../Assets/Css/login.css";

function Login(props) {
  const [message, setMessage] = useState(null);
  const [otp, setOtp] = useState(' ');  
  const [success, setSuccess] = useState('');  
  const [verifyMessage, setVerifyMessage] = useState("false");
  const [loggerInfo, setLoggerInfo] = useState({
    username: "",
    otp: "",
  });

  const [loginData, setLoginData] = useState({});
  const [confPass, setConfPass] = useState({password:'',confirmPass:'',username:loggerInfo.username});

  const history = useHistory();

   function loggerinfo(data,e) {
    setMessage('');
    setSuccess('');

   if(data==="changePassword"){
    setConfPass({ ...confPass, [e.target.name]: e.target.value });


   }else{


    setLoggerInfo({ ...loggerInfo, [e.target.name]: e.target.value });
    setConfPass({ ...loggerInfo, [e.target.name]: e.target.value });


   }




   

    
  }

  const sendOtpfun = async () => {
    let isSendOtp;
    if (loggerInfo.username.length > 1  && loggerInfo.username.includes('@') && loggerInfo.username.includes(".") ) {


 const dd=await checkMail(loggerInfo.username);
if(dd.status===203){
  
  console.log('respo from checkmail>>>',dd)    
      setSuccess("wait OTP is sending")

    

      isSendOtp = await otpSentVarification(loggerInfo);

      if (isSendOtp.status === 200) {
        setSuccess("OTP successfully sent, Now Enter OTP");
        setOtp("verifyOTP");
      } else if (isSendOtp.status === 203) {
        setMessage("Something problem");
      }
}else{
  setMessage("Email is not Register");

}
 
    } else {
      setMessage("Enter Correct Email ID");
    }

    
  };

 const setChangedPassword=async()=>{


console.log('>>>loggerInfo>>>',loggerInfo)

const ss=loggerInfo.username
setConfPass({...confPass,username:ss})
console.log('>>>>>>',loggerInfo)

if(confPass.confirmPass===confPass.password){

const isNewPassSet=await setNewPass(confPass)


if(isNewPassSet.status===200){

  setSuccess('New Password set, Now login')
  setMessage('')
  setOtp("passSet")
}
}else{
  setMessage('Password and Confirm Password not match')
}

}



  const verifyOtpFun = async () => {
    let isverify;
    if (loggerInfo.otp.length > 1) {
      isverify = await verifyOtp(loggerInfo);
      
console.log('responce of otp verificction',isverify)
      if (isverify.status === 200) {
   setVerifyMessage(true)

        setSuccess("OTP successfully Verify,You can Change Password");
        setOtp("newPass");
      } else if (isverify.status === 203) {
        setMessage("OTP is Not Valid");
      }
    } else {
      setVerifyMessage("OTP does'nt match")
      setMessage("Enter Correect OTP");
    }
  };

  //////////////////////////////////////////////////////////////////////////

  return (
    <>
      <div className="fl-center loginpage">
        <div className="heading">Welcome To College OF Engineering</div>
      </div>

      <div className="Loginblock">
        <div className="wrapper fadeInDown login"><br/><br/><br/>
          <div id="formContent">
            {otp===' ' ? (
              <>
                <div className="fadeIn first">
                  <h3>Enter Valid Email</h3> <br />
                  <img src={logo} id="icon" alt="User Icon" />
                </div>
                <h1>{props.showin}</h1>

                <h5 className="op-error">{message}</h5>
                <h5 className="op-success">{success}</h5>
                <input
                  type="text"
                  autoComplete="off"
                  id="login"
                  className="fadeIn second"
                  name="username"
                  placeholder="Email"
                  onChange={(e)=>loggerinfo("dummy",e)}
                  value={loggerInfo.username}
                />

                <input
                  type="submit"
                  className=""
                  value="Send OTP"
                  onClick={sendOtpfun}
                />
                <div id="formFooter">
                  <Link to="/" className="underlineHover">
                    Back To Login Page
                  </Link>
                </div>
              </>
            ) : (
              ""
            )}

            {otp==="verifyOTP"? (
              <>
                <div className="fadeIn first">
                  <h3>Enter OTP</h3> <br />
                  <img src={logo} id="icon" alt="User Icon" />
                </div>
                <h1>{props.showin}</h1>

                
                <h5 className="op-error">{message}</h5>
                <h5 className="op-success">{success}</h5>

                <input
                  type="text"
                  autoComplete="off"
                  id="login"
                  className="fadeIn second"
                  name="otp"
                  placeholder="OTP"
                  onChange={(e)=>loggerinfo("dummy",e)}
                  value={loggerInfo.otp}
                />
                <input
                  type="submit"
                  className=""
                  value="Verify OTP"
                  onClick={verifyOtpFun}
                />

                <div id="formFooter">
                  <Link to="/" className="underlineHover">
                    Back To Login Page
                  </Link>
                </div>
              </>
            ) : (
              ""
            )}
            {otp==='newPass' ? (
              <><br/><br/>
                <div className="fadeIn first">
                  <h3>Change To New Password</h3> <br />
                  <img src={logo} id="icon" alt="User Icon" />
                </div>
                <h1>{props.showin}</h1>

                <h5 className="op-error">{message}</h5>
                <h5 className="op-success">{success}</h5>

                <input
                  type="password"
                  autoComplete="off"
                  id="login"
                  className="fadeIn second"
                  name="password"
                  placeholder="New Password"
                  onChange={(e)=>loggerinfo("changePassword",e)}
                  value={confPass.password}
                />    <input
                  type="password"
                  autoComplete="off"
                  id="login"
                  className="fadeIn second"
                  name="confirmPass"
                  placeholder="Confirm New Password"
                  onChange={(e)=>loggerinfo("changePassword",e)}
                  value={confPass.confirmPass}
                />
                <input
                  type="submit"
                  className=""
                  value="Submit"
                  onClick={setChangedPassword}
                />

                <div id="formFooter">
                  <Link to="/" className="underlineHover">
                    Back To Login Page
                  </Link>
                </div>
              </>
            ) : ''}






            {otp==='passSet' ? (
              <><br/><br/>
                <div className="fadeIn first">
                  <h3>New Password Status</h3> <br />
                  <img src={logo} id="icon" alt="User Icon" />
                </div>
               

                <h5 className="op-error">{message}</h5>
                <h1 className="op-success">{success}</h1>

<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>



                <div id="formFooter">
                  <Link to="/" className="underlineHover">
                    Back To Login Page
                  </Link>
                </div>
              </>
            ) : ''}



          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
