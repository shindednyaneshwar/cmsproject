import "../../Assets/Css/SDashboard.css";
import { Buffer } from "buffer";
import "../../Assets/Css/common.css";
import Menu from "./menu.jsx";
import { useEffect, useState } from "react";
import { check, takeDepartment } from "../Validations/Utility";
import { getMyAcademicInfo, getMyLecture } from "../../Api/studentApi.js";
import { getOneStudent } from "../../Api/adminApi";
import { Link } from "react-router-dom";

import { getnotifications, getOneSyllabus } from "../../Api/facultyApi";
import Line from "./Line.jsx";
import Pie from "./Pie.jsx";
import Donut from "./Donut.jsx";

export default function Dashboard() {
  const [subjects, setSubjects] = useState([]);
  const [pdfFile, setpdfFile] = useState("");
  const [myAttendDetails, setAttendMyDetails] = useState([]);
  const [subjectsValues, setSubjectsValues] = useState([
    { attendance: "", exam: "", first: "", second: "" },
  ]);
  const [myDetails, setMyDetails] = useState([]);
  const [attendance, setAttendance] = useState(false);

  const [img, setImg] = useState([]);
  const [count, setCount] = useState(false);
 

  const attendanceHead = [
    "Subject",
    "Faculty",
    "Total Classes",
    "Presesnt",
    "Attendance (%)",
  ];

  const markHead = [
    "Subject",
    "Syllabus",
    "Test 1",
    "Test 2",
    "Exam",
    "Performance",
  ];

  useEffect(async () => {
    async function temp() {
      var c = await check("student");
      setCount(c);
      if (c) {
        const s = JSON.parse(localStorage.getItem("userData"));

        if (s) {
          const myDetail = await getOneStudent(s.PRN);

          if (myDetail.status === 200) {
            setMyDetails(myDetail.data);
            setImg(myDetail.data.spic.data.data);

            const notiData = await getnotifications(
              `${myDetail.data.sdept},${myDetail.data.ssemester}`
            );

            if (notiData.status === 200) {
              localStorage.setItem(
                "notiFicationData",
                JSON.stringify(notiData.data)
              );

             
            }

            const academicData = await getMyAcademicInfo(s.PRN);

            if (academicData.status === 200) {
              setSubjects(Object.keys(academicData.data.subjects));

              setSubjectsValues(Object.values(academicData.data.subjects));
            }
          }
        }
      } else {
        localStorage.clear();
        window.href = "./";
      }
    }
    temp();
  }, []);

  function toBase64(sdata) {
    return Buffer.from(
      String.fromCharCode.apply(null, new Uint8Array(sdata)),
      "binary"
    ).toString("base64");
  }

  async function getMyLectureFun() {
    let arr = [];
    setAttendMyDetails([]);

    let arrayyy = [];
    subjects.map(async (item, i) => {
      
      const myLectureData = await getMyLecture(item);

      if (myLectureData.status === 200) {
        console.log("ooooo", myLectureData.data);
        setAttendMyDetails((prev) => [...prev, myLectureData.data]);
      }

    
    });

    setAttendMyDetails(arrayyy);
    

    attendance ? setAttendance(false) : setAttendance(true);
  }

  function logout() {
    localStorage.clear();

    window.location.href = "/";
  }

  async function onChangeHandler(id) {
    const dataOneNotificaton = await getOneSyllabus(
      `${id},${myDetails.ssemester},${myDetails.sdept}`
    );

    if (dataOneNotificaton.status === 200) {
      setpdfFile(dataOneNotificaton.data.data.data);
    } else {
      setpdfFile("");

      alert("File Not Found,Kindly Contact to Publisher");
    }
  }

  return (
    <>
      <div className="stu-dashboard">
        <div className="functionality col-sm-9 ">
          <section className="main-section" id="dashboard-faculty">
            <div className="heading">
              <div>Welcome To Collge Of Engineering</div>
            </div>

            <div className="fun-work my-notify-scroll">
              <div className="st-studentInfo box-shadow">
                <div className="st-pic ">
                  <img
                    className="box-shadow"
                    src={`data:image/jpeg;base64,${toBase64(img)}`}
                    alt="No Pic Found"
                  />
                  <br />
                  <span className="text-shadow">
                    {myDetails.sname
                      ? `Hello ${myDetails.sname.split(" ")[1].toUpperCase()}`
                      : ""}
                  </span>{" "}
                  <br />
                  <h6>{myDetails.sPRN} </h6>
                  <Link to="./forgotPassword">
                    {" "}
                    <button className="btn btn-light box-shadow">
                      <i class="bi bi-lock-fill"></i>Change Password
                    </button>
                  </Link>
                  <br />
                  <Link to="./">
                    {" "}
                    <button
                      className="btn btn-light box-shadow"
                      onClick={logout}
                    >
                      <i class="bi bi-signpost-fill"></i>
                      Logout
                    </button>
                  </Link>
                </div>

                <div className="info">
                  <span className="text-shadow">
                    {" "}
                    {myDetails.sname ? myDetails.sname.toUpperCase() : ""}
                  </span>{" "}
                  <br />
                  <span>
                    <i class="bi bi-mortarboard-fill"></i>
                    {takeDepartment(myDetails.sdept)}
                  </span>
                  <br />
                  <span>
                    <i className="bi bi-envelope-fill dark"></i>
                    {myDetails.semail}
                  </span>
                  <br />
                  <span>
                    <i class="bi bi-phone-fill"></i>
                    {myDetails.smob}{" "}
                  </span>
                  <br />
                  <span>
                    <i class="bi bi-geo-alt-fill"></i>
                    {myDetails.saddress} {myDetails.spin}
                  </span>
                  <br />
                </div>
              </div>
              <button
                className="btn btn-primary box-shadow btn-shadow"
                onClick={getMyLectureFun}
              >
                Get Attendance Details
              </button>

              <div className="st-studentInfo-Aca ">
                <div className="stu-cms-table">
                  {attendance ? (
                    <table className="table table_striped box-shadow">
                      <thead className="bg-light">
                        <tr>
                          <th>Sr. No.</th>
                          {attendanceHead.map((item, index) => {
                            return (
                              <>
                                <th scope="col" key={index}>
                                  {" "}
                                  {item}
                                </th>
                              </>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {myAttendDetails.map((item, index) => {
                          {
                            /*   console.log("subjectsValues", subjectsValues);
                          console.log("subjects", subjects);
                          console.log("myAttendDetails", myAttendDetails); */
                          }

                          if (subjectsValues[index] === null) {
                            return;
                          }

                          const e = subjectsValues[index].attendance;

                          const att =
                            (subjectsValues[index].attendance / item.sub.lec) *
                            100;

                          return (
                            <>
                              <tr>
                                <td>{++index}</td>
                                <td>{item.sub.name}</td>

                                <td>{item.pro}</td>
                                <td>{item.sub.lec}</td>
                                <td>{e}</td>

                                <td>{att < 0 ? 0 : att.toFixed(2)}</td>
                              </tr>
                            </>
                          );
                        })}
                      </tbody>
                    </table>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <div className="st-studentInfo-Aca">
                <div className="stu-cms-table box-shadow">
                  <table className="table table_striped">
                    <thead className="bg-light">
                      <tr>
                        {markHead.map((item, index) => {
                          return (
                            <>
                              <th scope="col" key={index}>
                                {" "}
                                {item}
                              </th>
                            </>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {subjectsValues.map((item, index) => {
                        return (
                          <>
                            <tr>
                              <td>{subjects[index]}</td>
                              <td>
                                {" "}
                                <a
                                  className="zoom"
                                  onClick={() =>
                                    onChangeHandler(subjects[index])
                                  }
                                  href={`data:application/pdf;base64,${toBase64(
                                    pdfFile
                                  )}`}
                                  download="Notification"
                                >
                                  <i className="bi bi-file-earmark-arrow-down-fill"></i>
                                </a>
                              </td>

                              <td>{item.first}</td>
                              <td>{item.second}</td>
                              <td>{item.exam}</td>
                              <td>
                                {item.exam > 30
                                  ? "Excellent"
                                  : item.exam < 20
                                  ? "Bad"
                                  : "Good"}
                              </td>
                            </tr>
                          </>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="graphical-repre box-shadow col-lg-10 ">
                <h2 className="text-shadow">Graphical Representaion Of Data</h2>
                <div className=" ">
                  <div>
                    <div className="chart">
                      <h3>Marks</h3>
                      <Line />
                    </div>
                    <div className="chart">
                      <h3>Attendance</h3>
                      <Pie />
                    </div>
                    <div className="chart">
                      <h3>Marks</h3>
                      <Donut />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div>
          <Menu />
        </div>
      </div>
    </>
  );
}
