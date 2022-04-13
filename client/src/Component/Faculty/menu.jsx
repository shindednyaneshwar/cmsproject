// import "./menu.css";
// import Logo from "../../Assets/Images/logo.jpeg";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Buffer } from "buffer";
import { takeDepartment } from "../Validations/Utility";
import { useHistory } from "react-router-dom";
// import { useHistory } from "react-router-dom";
export default function FMenu() {
  const [img, setImg] = useState([])

  const [user, setUser] = useState({
    fPRN: "",

    fdept: "",

    femail: "",

    fmob: "",
    fname: "",
    fpic: "",
  });

  useEffect(async () => {

    async function temp(){

      const info = JSON.parse(localStorage.getItem("userPersonalDetail"));
      setUser({fPRN:info.fPRN, 
    fdept:info.fdept,
    femail:info.femail,
    fmob:info.fmob,
    fname:info.fname,
    fpic:info.fpic.data.data
   })
 
 
 setImg(info.fpic.data)
 
    }
    temp();
 

  }, []);



  function toBase64(sdata) {
    return Buffer.from(
      String.fromCharCode.apply(null, new Uint8Array(sdata)),
      "binary"
    ).toString("base64");
  }

  const history = useHistory();

function logoutFun(){

 localStorage.clear()

 window.location.href='/';
}



  return (
    <>
      <div className="nav-side-menu">
        <div className="brand">
          
          <div className="userPic">
          <br/>
          <h6>{user.fPRN}</h6>
                <img
                  src={`data:image/jpeg;base64,${toBase64(user.fpic)}`}
                  alt="No Pic Found"
                />
              </div>
              <h4>{user.fname}</h4>
              <h6>{user.fmob}</h6>
              <h6>{user.femail.split("@")[0]}@</h6>
             
              <h6>{takeDepartment(user.fdept)}</h6> <br/>
             <Link to="/"> <button className="btn-logout" onClick={logoutFun}>Logout</button> </Link> 
              
        </div>
        <i
          className="bi bi-watch fa-2x toggle-btn"
          data-toggle="collapse"
          data-target="menu-content"
        ></i>

        <div className="menu-list" >
          <ul className="menu-content ">
            <li data-target="dashboard-admin">
              <Link to="/faculty">
                <i className="bi bi-speedometer"></i> Dashboard
              </Link>
            </li>

            <li>
              <Link to="/faculty/uploadmarks" id="uploadMarks">
                <i className="bi bi-file-earmark-arrow-up"></i> Upload Marks{" "}
              </Link>
            </li>

            <li data-target="subject">
              <Link to="/faculty/attendance">
                <i className="bi bi-check2-all"></i> Attendance{" "}
              </Link>
            </li>

            <li data-toggle="collapse" data-target="new" className="collapsed">
              <Link to="/faculty/subject">
                <i className="bi bi-file-earmark-medical"></i> Subjects
              </Link>
            </li>

            
            <li>
              <Link to="/faculty/notification">
                {" "}
                <i className="bi bi-bell"></i> Notification{" "}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

// ==================================================
