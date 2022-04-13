import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

// import "./Assets/Css/bootstrap.min.css";
// import "./Assets/Css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./Assets/Css/common.css";
// import { check } from "./Component/Validations/Utility.js";
// P:\PDrive\CDAC\zFinalProject\MainProject\CMS\BootStrapClient\node_modules\bootstrap\dist\css\bootstrap.min.css

import Login from "./Component/login";
import ChangePassword from "./Component/changePassword.jsx";
// import Prac from "./practice";

// import Table from "./Component/Compo/TableFormat";
// import Menu from "./Component/Compo/menu";
import AdminApp from "./Component/Admin/AdminApp";
// import AddStudent from "./Component/Compo/AddStudent"; 
import FDashboard from "./Component/Faculty/facultyApp";
// import Update from "./Component/Compo/UpdateSubject";
import SDashboard from "./Component/Student/SDashboard";
// import TableFormat from "./Component/Compo/TableFormat";

import PageNotFound from "./Component/pageNotFound.jsx";
// import { Redirect } from "react-router-dom";

export default function App() {
  // const [login,setLogin]= useState({isLogin:"",PRN:"",username:"",token:"",user:""})
 



  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" render={() => <Login  />} />
          

          <Route path="/admin" render={() => <AdminApp />} />
          <Route path="/faculty" render={() => <FDashboard />} />
          <Route path="/student" render={() => <SDashboard />} />
          <Route path="/forgotPassword" render={() => <ChangePassword />} />
          <Route path="/:random" render={() => <PageNotFound />} />
          


          <Route component={Login} />
        </Switch>
      </BrowserRouter>
    </>
  );
}
