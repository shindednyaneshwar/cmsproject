import { useEffect, useState } from "react";
import logo from "./../Assets/Images/logo.jpeg";
import { Link, useHistory } from "react-router-dom";
import {
  checkLogger,
  getOneAdmin,
  getOneFaculty,
  isFormAllow,
} from "../Api/adminApi.js";
import "../Assets/Css/login.css";
import StudentForm from "./Compo/studentForm.jsx";
import FacultyForm from "./Compo/facultyForm.jsx";

function Login(props) {
  const [message, setMessage] = useState(null);
  const [formStudent, setFormStudent] = useState(false);
  const [formFaculty, setFormFaculty] = useState(false);
  const [allowForm, setAllowForm] = useState({ student: "", faculty: "" });

  const [loggerInfo, setLoggerInfo] = useState({
    username: "",
    password: "",
    status: "",
  });

  useEffect( () => {

    async function fectDta(){
      const check = await isFormAllow("fromLogin");
      console.log("::::::::",check.data)
       setAllowForm(check.data);
    }
    fectDta();
  }, []);

  const history = useHistory();

  function loggerinfo(e) {
    setMessage(false);

    setLoggerInfo({ ...loggerInfo, [e.target.name]: e.target.value });
  }

  const isUsernameVarified =
    loggerInfo.status !== "" &&
    loggerInfo.password !== "" &&
    ((loggerInfo.username.includes("@") &&
    loggerInfo.username.includes(".")) ||
   
    (loggerInfo.username.includes("ELE0") ||
      loggerInfo.username.includes("CIVIL0") ||
      loggerInfo.username.includes("ENTC0") ||
      loggerInfo.username.includes("IT0") ||
      loggerInfo.username.includes("MECH0") ||
      loggerInfo.username.includes("MIN0"))
)
 
  const getLoggedin = async () => {
    if (isUsernameVarified) {
      var isLogin = await checkLogger(loggerInfo);

      console.log("resp from server", isLogin);

      if (isLogin.status === 200) {
        localStorage.removeItem("userData");
        localStorage.removeItem("userPersonalDetail");

        console.log("User successfully login");
        localStorage.setItem("userData", JSON.stringify(isLogin.data));
        if (isLogin.data.user === "faculty") {
          const userData = await getOneFaculty(isLogin.data.PRN);
          console.log("resp from userDataa", userData);

          localStorage.setItem(
            "userPersonalDetail",
            JSON.stringify(userData.data)
          );
        } else if (isLogin.data.user === "admin") {
          const userData = await getOneAdmin(isLogin.data.PRN);
          console.log("User successfully login in adminn", userData);

          console.log("login data");
          localStorage.setItem(
            "userPersonalDetail",
            JSON.stringify(userData.data)
          );
        }

        if (isLogin.data.user === "admin") history.push(`/admin`);
        else if (isLogin.data.user === "faculty") history.push(`/faculty`);
        else if (isLogin.data.user === "student") history.push(`/student`);

        setMessage("User successfully login");
      } else if (isLogin.status === 203) {
        console.log("Login Credential are Wrong");
        setMessage("Please check User/Username/Password");
      }
    } else {
      setMessage("Please check User/Username/Password");
    }
  };

  function setForm(data) {
    if (data === "faculty" && allowForm.faculty === true) {
      setFormStudent(false);
      formFaculty ? setFormFaculty(false) : setFormFaculty(true);
    } else if (data === "student" && allowForm.student === true) {
      setFormFaculty(false);
      formStudent ? setFormStudent(false) : setFormStudent(true);
    } else {
      alert(`Admin not allow yet to fill  ${data} Form`);
    }
  }

  const closeForm = async () => {
    setFormFaculty(false);
    setFormStudent(false);
  };



  //////////////////////////////////////////////////////////////////////////

  return (
    <>
      <div className="login-page">
        <div>
          <div className="fl-center loginpage box-shadow-wh text-shadow">
            <div className="heading">Welcome College OF Engineering</div>
          </div>
          <div>
            <button
              className="btn btn-dark box-shadow"
              onClick={() => setForm("faculty")}
            >
              <h5>Faculty Form</h5>
            </button>
            <button
              className="btn btn-dark box-shadow"
              onClick={() => setForm("student")}
            >
              <h5>Student Form</h5>
            </button>
          </div>
        </div>
        <div className="conatiner">
          <div className="fl-center">
            {formStudent ? <StudentForm closeForm={closeForm} /> : ""}
            {formFaculty ? <FacultyForm closeForm={closeForm} /> : ""}
          </div>

          <div className="Loginblock ">
            {!(formFaculty || formStudent) ? (
              <div className="wrapper   fadeInDown login ">
                <div id="formContent">
                  <div className="fadeIn first">
                    <img src={logo} id="icon" alt="User Icon" />
                  </div>
                  <h1>{props.showin}</h1>
                  <select
                    name="status"
                    id="stat"
                    onChange={loggerinfo}
                    value={loggerInfo.status}
                  >
                    <option value="">who's login?</option>

                    <option value="faculty">Faculty</option>
                    <option value="admin">Admin</option>
                    <option value="student">Student</option>
                  </select>
                  <h5 style={{ color: "red" }}>{message}</h5>

                  <input
                    type="text"
                    autoComplete="off"
                    id="login"
                    className="fadeIn second"
                    name="username"
                    placeholder="Email"
                    onChange={loggerinfo}
                    value={loggerInfo.username}
                  />
                  <input
                    type="password"
                    className="fadeIn third"
                    name="password"
                    placeholder="Password"
                    onChange={loggerinfo}
                    value={loggerInfo.password}
                  />
                  <input
                    type="submit"
                    className="fadeIn fourth box-shadow"
                    value="Log In"
                    onClick={getLoggedin}
                  />
                  <div id="formFooter">
                    <Link to="/forgotPassword" className="underlineHover">
                      Forgot Password?
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>

        {/* ============================  Footer ==================================================================== */}

        <div>
          <footer className="footer">
            <div className="container">
              <ul className="foote_bottom_ul_amrc">
                <li>
                  <a href="#">Home</a>
                </li>
                <li>
                  <a href="#">About</a>
                </li>
                <li>
                  <a href="#">Services</a>
                </li>
                <li>
                  <a href="#">Pricing</a>
                </li>
                <li>
                  <a href="#">Blog</a>
                </li>
                <li>
                  <a href="#">Contact</a>
                </li>
              </ul>
              {/* <!--foote_bottom_ul_amrc ends here--> */}
              <p className="text-center">
                Copyright @2022 | Designed With by{" "}
                <a href="##">Pankaj Aru & Dnyaneshwar Shinde</a>
              </p>

              <ul className="social_footer_ul">
                <li>
                  <a href="#">
                    <i className="fi bi-facebook"></i>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fi bi-twitter"></i>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fi bi-linkedin"></i>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fi bi-instagram"></i>
                  </a>
                </li>
              </ul>
              {/* <!--social_footer_ul ends here--> */}
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}

export default Login;
