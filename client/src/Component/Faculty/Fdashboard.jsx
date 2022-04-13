import { useEffect, useState } from "react";

import CountUp from "react-countup";
import { check } from "../Validations/Utility";

export default function Fdashboard() {
  const [lastLogin, setLastLogin] = useState({ date: "", time: "" });

  useEffect(async () => {
    const lastseen = await check("lastseen");

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

   
    setLastLogin({ date, time });
  }, []);

  return (
    <>
            <div className="sub-heading">
                <div>Dashboard</div>
              </div>
              <div className="text-shadow">
                <h4>
                  Last Login :{lastLogin.date} {lastLogin.time}
                </h4>
              </div>
              <div>
                <section className="container-fluid row">
                  <div className="d-flex justify-content-around">
                    <div className="cms-counter cntr-5 box-shadow">
                      <div>
                        <i className="bi bi-person-workspace"></i>
                      </div>{" "}
                      <div>
                        <span>
                          <CountUp end={25} duration={4.75} />
                        </span>
                      </div>
                      <span>student</span>
                    </div>
                    <div className="cms-counter cntr-2 box-shadow ">
                      {" "}
                      <div>
                        <i className="bi bi-person-plus-fill"></i>
                      </div>{" "}
                      <div>
                        <span>
                          <CountUp end={18} />
                        </span>
                      </div>
                      <span>Attendance</span>
                    </div>
                    <div className="cms-counter cntr-3 box-shadow">
                      {" "}
                      <div>
                        <i className="bi bi-person-video3"></i>
                      </div>{" "}
                      <div>
                        <span>
                          <CountUp end={25} />
                        </span>
                      </div>
                      <span>Classes</span>
                    </div>
                    <div className="cms-counter cntr-4 box-shadow">
                      {" "}
                      <div>
                        <i className="bi bi-journal-text"></i>
                      </div>{" "}
                      <div>
                        <span>
                          <CountUp end={24} />
                        </span>
                      </div>
                      <span>Notifications</span>
                    </div>
                  </div>
                </section>
                {/* <!-- end of Charts --> */}
              </div>
           
    </>
  );
}
