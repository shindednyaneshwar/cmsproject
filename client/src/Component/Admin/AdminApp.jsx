import "../../Assets/Css/common.css";
import Menu from "./menu";

import Student from "./Student";
import Faculty from "./Faculty";
import Dashboard from "./Dashboard";
import { BrowserRouter, Switch } from "react-router-dom";
import { Route } from "react-router-dom";
import Subject from "./Subject";
import { useEffect, useState } from "react";
import { check } from "../Validations/Utility";
import PageNotFound from "../pageNotFound";
import AddAdmin from "./Addadmin.jsx";

export default function AdminApp() {
  const [count, setCount] = useState(false);

  useEffect( () => {

    async function temp(){
      

      const temp = await check("admin");
      setCount(temp);
    }
  temp();
   
  }, []);

  return (
    <>
      <BrowserRouter>
        <div className="dashboard">
          <div>
            <Menu />
          </div>

          <div className="functionality col-lg-10 col-sm-12">
            <section className="main-section" id="dashboard-admin">
              <div className="heading">
                <div>Welcome To Collge Of Engineering</div>
              </div>

              <div className="fun-work my-scroll">
                <Switch>
                  <Route exact path="/admin" render={() => <Dashboard />} />
                  <Route
                    exact
                    path="/admin/faculty"
                    render={() => <Faculty />}
                  />
                  <Route
                    exact
                    path="/admin/student"
                    render={() => <Student />}
                  />
                  <Route
                    exact
                    path="/admin/subject"
                    render={() => <Subject />}
                  />
                  <Route
                    exact
                    path="/admin/addadmin"
                    render={() => <AddAdmin />}
                  />

                  <Route path="/" render={() => <PageNotFound />} />
                </Switch>
              </div>
            </section>
          </div>
        </div>
      </BrowserRouter>
    </>
  );
}
