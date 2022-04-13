import "../../Assets/Css/adminMenu.css";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Buffer } from "buffer";



export default function FMenu() {
  const [img, setImg] = useState([]);

  const [user, setUser] = useState({
    aPRN: "",

    adept: "",

    aemail: "",

    mob: "",
    aname: "",
    apic: "",
  });

  useEffect(async () => {
    const info = JSON.parse(localStorage.getItem("userPersonalDetail"));
    // console.log(">>>?????userPersonalDetails", info);

    setUser({
      aPRN: info.aPRN,

      aemail: info.aemail,

      amob: info.amob,
      aname: info.aname,
      apic: info.apic.data.data,
    });
    console.log(">>>?????user", user);

    setImg(info.apic.data);
    console.log(img);
  }, []);
  function toBase64(sdata) {
    return Buffer.from(
      String.fromCharCode.apply(null, new Uint8Array(sdata)),
      "binary"
    ).toString("base64");
  }

  function logoutFun() {
    //deleting userDetails from Local storage of Client
    localStorage.clear()

    window.location.href='/';

  
  }

  return (
    <>
      <div className="nav-side-menu">
        <div className="brand">
          <div className="userPic">
            <br />
            <h6>{user.aPRN}</h6>
            <img
              src={`data:image/jpeg;base64,${toBase64(user.apic)}`}
              alt="No Pic Found"
            />
          </div>
          <h4>{user.aname}</h4>
          <h6>{user.amob}</h6>
          <h6>{user.aemail.split("@")[0]}@</h6>
          <h6>{}</h6> <br />
          <Link to="/">
            {" "}
            <button className="btn-logout" onClick={logoutFun}>
              Logout
            </button>{" "}
          </Link>
        </div>

        <div className="menu-list">
          <ul className="menu-content ">
            <li data-target="#dashboard-admin">
              <Link to="/admin/">
                <i className="bi bi-speedometer"></i> Dashboard
              </Link>
            </li>

            <li>
              <Link to="/admin/student">
                <i className="bi bi-person"></i> Students{" "}
              </Link>
            </li>

            <li data-target="#subject">
              <Link to="/admin/subject">
                <i className="bi bi-journal-bookmark"></i> Subjects{" "}
              </Link>
            </li>

            <li data-toggle="collapse" data-target="#new" className="collapsed">
              <Link to="/admin/faculty">
                <i className="bi bi-mortarboard-fill"></i> Faculty
              </Link>
            </li>

            <li>
              <Link to="/admin/addadmin">
                {" "}
                <i class="bi bi-person-check-fill"></i> Add Admin
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

// ==================================================
