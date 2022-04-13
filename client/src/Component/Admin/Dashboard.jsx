import "../../Assets/Css/dashboard.css";

import "../../Assets/Css/common.css";

import { useEffect, useState } from "react";
import { facultyFormSet, isFormAllow, getCountOfALL } from "../../Api/adminApi";
import CountUp from "react-countup";

import { check } from "../Validations/Utility";
export default function Fdashboard() {
  const [lastLogin, setLastLogin] = useState({ date: "", time: "" });

  const [message, setMessage] = useState();
  const [counterr, setCounterr] = useState({
    facultyCount: 0,
    studentCount: 0,
    users: 0,
    adminCount: 0,
  });
  const [user, setUser] = useState({
    aPRN: "",
    isFacultyAllow: false,
    isStudentAllow: true,
  });

  useEffect( () => {

   async function temp(){
    const info = JSON.parse(localStorage.getItem("userPersonalDetail"));
    const check = await isFormAllow(info.aPRN);
    if (check) {
      setUser({
        aPRN: info.aPRN,
        isFacultyAllow: check.data.faculty,
        isStudentAllow: check.data.student,
      });
    }
    const counter = await getCountOfALL();
    
    const dt = counter.data;
    const per = 100 / (dt.facultyCount + dt.studentCount + dt.adminCount); //percentage=val*(100/total Val)
    if (counter.status === 200) {
      setCounterr({
        facultyCount: dt.facultyCount * per,
        studentCount: dt.studentCount * per,
        users: dt.users,
        adminCount: dt.adminCount * per,
      });

    
    }

    }
    temp();
    
  }, []);

  useEffect(async () => {
    const lastseen = await check("lastseen");
    const userDetail = await check("userPersonalDetail");

    let date = [
      lastseen.split(" ")[0].split("/")[2],
      lastseen.split(" ")[0].split("/")[1],
      lastseen.split(" ")[0].split("/")[0],
    ];
    date = `${date[0]}/${date[1]}/${date[2]}`;
    let time = [
      lastseen.split(" ")[1].split(":")[0],
      lastseen.split(" ")[1].split(":")[1],
      lastseen.split(" ")[1].split(":")[2],
    ];

    if (time[0] > 12) {
      time = `${time[0] - 12}:${time[1]} PM`;
    } else {
      time = `${time[0]}:${time[1]} AM`;
    }

    console.log("first,", time);
    setLastLogin({ date, time });
  }, []);

  const setForm = async (data, e) => {
    setMessage("");
    console.log("logggggg", e.target.checked);

    if (data === "faculty") {
      setUser({ ...user, isFacultyAllow: e.target.checked });
      const isFacultyFormSet = await facultyFormSet({
        aPRN: user.aPRN,
        faculty: e.target.checked,
        student: user.isStudentAllow,
      });

      console.log("....;;;;...", isFacultyFormSet);
      if (isFacultyFormSet.status === 200) {
        // setUser({ ...user, isFacultyAllow: e.target.checked });
      } else {
        const val = e.target.checked ? false : true;
        setUser({ ...user, isFacultyAllow: val });

        setMessage("Server error. Cant change Faculty Form");
      }
    } else {
      setUser({ ...user, isStudentAllow: e.target.checked });
      const isStudentFormSet = await facultyFormSet({
        aPRN: user.aPRN,
        faculty: user.isFacultyAllow,
        student: e.target.checked,
      });

      if (isStudentFormSet.status === 200) {
        // console.log("....;;;;...",isStudentFormSet)

        setUser({ ...user, isStudentAllow: e.target.checked });
      } else {
        const val = e.target.checked ? false : true;
        setUser({ ...user, isStudentAllow: val });
        setMessage("Server error. Cant change Student Form");
      }
    }
  };

  return (
    <>
      <div className="sub-heading">
        <div>Dashboard</div>
      </div>
      <div>
        <div
          className="text-shadow "
          style={{ float: "right", fontWeight: "bolder" }}
        >
          <h4>
            Last Login :{lastLogin.date} {lastLogin.time}
          </h4>
        </div>
        <section className="container-fluid row">
          <div className="d-flex justify-content-around">
            <div className="cms-counter cntr-5 box-shadow">
              <div>
                <i className="bi bi-person-workspace"></i>
              </div>{" "}
              <div>
                <span>
                  <CountUp end={counterr.users} duration={3.75} />
                </span>
              </div>
              <span>Total User</span>
            </div>
            <div className="cms-counter cntr-2 box-shadow ">
              {" "}
              <div>
                <i class="bi bi-person-plus-fill"></i>
              </div>{" "}
              <div>
                <span>
                  <CountUp end={counterr.facultyCount} duration={3.75} />%
                </span>
              </div>
              <span>Faculty</span>
            </div>
            <div className="cms-counter cntr-3 box-shadow">
              {" "}
              <div>
                <i class="bi bi-person-video3"></i>
              </div>{" "}
              <div>
                <span>
                  <CountUp end={counterr.studentCount} duration={3.75} />%
                </span>
              </div>
              <span>Student</span>
            </div>
            <div className="cms-counter cntr-4 box-shadow">
              {" "}
              <div>
                <i class="bi bi-journal-text"></i>
              </div>{" "}
              <div>
                <span>
                  <CountUp end={counterr.adminCount} duration={4.75} />%
                </span>
              </div>
              <span>Admin</span>
            </div>
          </div>
          {<h3 className="op-error">{message}</h3>}
          <div className="container cms-checkBox ">
            <input
              type="checkbox"
              className="_checkbox"
              id="faculty"
              checked={user.isFacultyAllow}
              onChange={(e) => setForm("faculty", e)}
            />
            <label for="faculty">
              <div className="tick_mark"></div>
            </label>

            <div>
              <h1 className="text-shadow">Allow Faculty</h1>
            </div>
          </div>

          <div className="container cms-checkBox ">
            <input
              type="checkbox"
              className="_checkbox"
              id="student"
              checked={user.isStudentAllow}
              onChange={(e) => setForm("student", e)}
            />
            <label for="student">
              <div className="tick_mark"></div>
            </label>

            <div>
              <h1 className="text-shadow">Allow Student</h1>
            </div>
          </div>
        </section>

        {/* <!-- end of Charts --> */}
      </div>
    </>
  );
}
