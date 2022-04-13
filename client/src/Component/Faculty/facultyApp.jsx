import "../../Assets/Css/Fdashboard.css";

import "../../Assets/Css/common.css";
import Menu from "./menu";

import UploadMarks from "./UploadMarks.jsx";
import Attendance from "./Attendance";
import Notification from "./Notification";
import Subject from "./Subject";
import Fdashboard from "./Fdashboard";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useEffect, useState } from "react";

import { check } from "../Validations/Utility";
import PageNotFound from "../pageNotFound";

export default function Dashboard() {
  const [count, setCount] = useState(false);

  useEffect(async () => {
    setCount();

    const temp = await check("faculty");
    setCount(temp);
    if (!temp) {
      localStorage.clear();
      window.href = "./";
    }
  }, []);

  return (
    <>
      <Router>
        {count ? (
          <div className="dashboard">
            <div>
              <Menu />
            </div>

            <div className="functionality col-lg-10 col-sm-12">
              <section className="main-section" id="dashboard-faculty">
                <div className="heading">
                  <div>Welcome To Collge Of Engineering</div>
                </div>

                <div className="fun-work my-scroll">
                  <Switch>
                    <Route
                      exact
                      path="/faculty"
                      render={() => <Fdashboard />}
                    />
                    <Route
                      path="/faculty/uploadMarks"
                      render={() => <UploadMarks />}
                    />
                    <Route
                      path="/faculty/attendance"
                      render={() => <Attendance />}
                    />
                    <Route path="/faculty/subject" render={() => <Subject />} />
                    <Route
                      path="/faculty/notification"
                      render={() => <Notification />}
                    />

                    <Route path="/" render={() => <PageNotFound />} />
                  </Switch>
                </div>
              </section>
            </div>
          </div>
        ) : (
          ""
        )}{" "}
      </Router>
    </>
  );
}
