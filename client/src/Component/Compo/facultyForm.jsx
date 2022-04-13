import { useEffect, useState } from "react";
import {
  addFacultyDetails,
  checkMail,
  getAllFaculty,
} from "../../Api/adminApi";
// import "../../Assets/Css/form.css";
// import { Buffer } from "buffer";
import facultyValidation from "../Validations/FacultyValidation";

import { check } from "../Validations/Utility";
import { Redirect } from "react-router-dom";
import xlsx from "json-as-xlsx";
import { Link } from "react-router-dom";
export default function Faculty(props) {
  const [login, setLogin] = useState({
    isLogin: "",
    PRN: "",
    username: "",
    token: "",
    user: "",
  });

  const [formAddFaculty, setFormAddFaculty] = useState(false);
  const [messageWarn, setMessageWarn] = useState(null);
  const [success, setSuccess] = useState(false);
  const [allFacultyData, setAllFacultyData] = useState([]);
  const [formAllocateSubjects, setFormAllocateSubjects] = useState(false);

  const [count, setCount] = useState(1);
  const [emailMessage, setEmailMessage] = useState("");
  const [validEmail, setValidEmail] = useState("");

  const [facultyInfo, setFacultyInfo] = useState({
    fname: "",
    femail: "",
    faddress: "",
    fpin: "",
    fstate: "",
    fdob: "",
    fmob: "",
    fedu: "",
    fdept: "",
    fgender: "",
    fpic: "",
    fpass: "",
    fconfirm: "",
  });

  //===============================================================================================================
  // --------------------------------------As Page automatically Student List will get

  // Here, useEffect will operate as this Component render at first time  and then as count changes

  useEffect(async () => {}, [count]);

  //============================================================================================================

  async function onChangeHandler(e) {
    setMessageWarn(null);
    setSuccess(null);

    if (e.target.name === "femail") {
      setFacultyInfo({ ...facultyInfo, [e.target.name]: e.target.value });
      setValidEmail(true);
    } else {
      if (
        validEmail === true &&
        facultyInfo.femail.includes("@") &&
        facultyInfo.femail.includes(".")
      ) {
        const isEmailValid = await checkMail(facultyInfo.femail);

        if (isEmailValid.status === 200) {
          setEmailMessage("op-success");
        } else {
          const temp = facultyInfo.femail;
          setEmailMessage("op-error");
        }
        setFacultyInfo({ ...facultyInfo, femail: e.target.value });

        setValidEmail(false);
      }
      setFacultyInfo({ ...facultyInfo, [e.target.name]: e.target.value });
      setValidEmail(false);
    }
  }

  async function onphotoChangeHandler(e) {
    setMessageWarn("");
    setSuccess(" ");

    const file = await e.target.files[0];
    const fileSize = await e.target.files[0].size;

    if (
      (file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png") &&
      fileSize < 50000 &&
      file.type !== "undefined"
    ) {
      setFacultyInfo({ ...facultyInfo, fpic: file });
    } else {
      setFacultyInfo({ ...facultyInfo, fpic: null });

      setMessageWarn(
        "image should be JPEG / JPG / PNG (Format)  and Below 50kb (Size) "
      );
    }
  }

  // const data="";
  //   var data = [];

  const setSubmitData = async (e) => {
    e.preventDefault();

    const valideData = facultyValidation(facultyInfo);
    let isValid = 0;
    let isString = "Check ";
    let nameArray = [
      "Name",
      "Email",
      "Address",
      "State",
      "Pincode",

      "Date Of Birth",
      "Education",
      "Mobile No.",

      "Department",
      "Gender",
      "Image",
      "Password",
    ];

    //For validation of Data
    for (const key in Object.keys(valideData)) {
      if (Object.values(valideData)[key] === false) {
        ++isValid;
        isString = isString + nameArray[key] + ", ";
      }
    }

    let helper = !isValid;
    if (validEmail === true) {
      const isEmailValid = await checkMail(facultyInfo.femail);

      if (isEmailValid.status === 200) {
        setEmailMessage("op-success");

        helper = true;
      } else {
        helper = false;
        const temp = facultyInfo.femail;
        setEmailMessage("op-error");
      }
    }

    if (isValid === 0 && emailMessage === "op-success" && helper) {
      //converting into Formdata
      setMessageWarn(null);
      let formData = new FormData();

      for (var key in facultyInfo) {
        formData.append(key, facultyInfo[key]);
      }
      //sending to Axios

      const facultyinfo = await addFacultyDetails(formData);

      if (facultyinfo.status === 200) {
        setCount(count + 1);
        setMessageWarn("");
        setFacultyInfo({
          fname: "",
          femail: "",
          faddress: "",
          fstate: "",
          fpin: "",
          fdob: "",
          fgender: "",
          fdept: "",
          fedu: "",
          fmob: "",
          fpic: "",
        });
        setSuccess("Faculty Information Update Successfully");
      } else {
        setMessageWarn("There is proble while saving the data");
      }

      setCount(count + 1);
    } else {
      setMessageWarn(isString);
    }
  };

  // --------------------------------------------------------------------------------------------------

  return (
    <>
      <section className="addperson showForm" id="addFaculty" name="addFaculty">
        <div className="container">
          <button
            onClick={() => props.closeForm()}
            className="btn"
            style={{ float: "right", color: "red" }}
          >
            <i class="bi bi-x-square-fill"></i>
          </button>
          <h2 className="text-center">Faculty Form</h2>

          {<h5 style={{ color: "red" }}>{messageWarn}</h5>}

          {
            <h5
              style={{
                color: "green",
                fontSize: "20px",
                backgroundColor: "yellowgreen",
              }}
            >
              {success}
            </h5>
          }

          <div className="row jumbotron">
            <div className="col-sm-6 form-group">
              <label for="name-l">Full Name</label>

              <input
                onChange={onChangeHandler}
                value={facultyInfo.fname}
                name="fname"
                type="text"
                className="form-control"
                id="name-l"
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="col-sm-6 form-group">
              <label for="email">
                Email{" "}
                <i
                  className={`${emailMessage} bi bi-check-circle-fill zoom `}
                ></i>
              </label>

              <input
                onChange={onChangeHandler}
                value={facultyInfo.femail.toLowerCase()}
                type="email"
                className="form-control"
                name="femail"
                id="email"
                placeholder="Enter your email."
                required
              />
            </div>
            <div className="col-sm-6 form-group">
              <label for="address-1">Address</label>

              <input
                onChange={onChangeHandler}
                value={facultyInfo.faddress}
                type="address"
                className="form-control"
                name="faddress"
                id="address-1"
                placeholder="Address"
                required
              />
            </div>

            <div className="col-sm-4 form-group">
              <label for="State">State</label>

              <select
                name="fstate"
                id="state"
                class="form-control"
                onChange={onChangeHandler}
                value={facultyInfo.fstate}
              >
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Andaman and Nicobar Islands">
                  Andaman and Nicobar Islands
                </option>
                <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                <option value="Assam">Assam</option>
                <option value="Bihar">Bihar</option>
                <option value="Chandigarh">Chandigarh</option>
                <option value="Chhattisgarh">Chhattisgarh</option>
                <option value="Dadar and Nagar Haveli">
                  Dadar and Nagar Haveli
                </option>
                <option value="Daman and Diu">Daman and Diu</option>
                <option value="Delhi">Delhi</option>
                <option value="Lakshadweep">Lakshadweep</option>
                <option value="Puducherry">Puducherry</option>
                <option value="Goa">Goa</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Haryana">Haryana</option>
                <option value="Himachal Pradesh">Himachal Pradesh</option>
                <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                <option value="Jharkhand">Jharkhand</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Kerala">Kerala</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Manipur">Manipur</option>
                <option value="Meghalaya">Meghalaya</option>
                <option value="Mizoram">Mizoram</option>
                <option value="Nagaland">Nagaland</option>
                <option value="Odisha">Odisha</option>
                <option value="Punjab">Punjab</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Sikkim">Sikkim</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Telangana">Telangana</option>
                <option value="Tripura">Tripura</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Uttarakhand">Uttarakhand</option>
                <option value="West Bengal">West Bengal</option>
              </select>
            </div>
            <div className="col-sm-2 form-group">
              <label for="zip">Postal-Code</label>

              <input
                onChange={onChangeHandler}
                value={facultyInfo.fpin}
                type="zip"
                className="form-control"
                name="fpin"
                id="zip"
                placeholder="Postal-Code."
                required
              />
            </div>

            <div className="col-sm-3 form-group">
              <label for="Date">Date Of Birth</label>

              <input
                onChange={onChangeHandler}
                value={facultyInfo.fdob}
                type="Date"
                name="fdob"
                className="form-control"
                id="Date"
                placeholder=""
                required
              />
            </div>

            <div className=" col-sm-3 form-group">
              <label for="fgender">Gender</label>

              <select
                className="form-control"
                id="fgender"
                name="fgender"
                onChange={onChangeHandler}
                value={facultyInfo.fgender}
              >
                <option name="">Choose</option>
                <option name="male">Male</option>
                <option name="female">Female</option>
                <option name="unspecified">Not specified</option>
              </select>
            </div>

            <div className="col-sm-4 form-group">
              <label for="fmob">Phone</label>

              <input
                onChange={onChangeHandler}
                value={facultyInfo.fmob}
                type="tel"
                name="fmob"
                className="form-control"
                id="fmob"
                placeholder="Enter Your Contact Number."
                required
              />
            </div>

            <div className="col-sm-6 form-group">
              <label for="address-1">Eduaction</label>

              <input
                onChange={onChangeHandler}
                value={facultyInfo.fedu}
                type="text"
                className="form-control"
                name="fedu"
                id="address-1"
                placeholder="Eduaction"
                required
              />
            </div>
            <div className=" col-sm-5 form-group">
              <label for="dept">Department</label>

              <select
                className="form-control"
                id="dept"
                name="fdept"
                onChange={onChangeHandler}
                value={facultyInfo.fdept}
              >
                <option value="">Select Department</option>
                <option value="ele">Electrical Engineering</option>
                <option value="mech">Mechanical Engineering</option>
                <option value="civil">Civil Engineering</option>
                <option value="it">Information Technology </option>
                <option value="entc">Electronics Engineering</option>
              </select>
            </div>

            <div className="col-sm-8 form-group">
              <label for="photo">Add Photo</label>

              <input
                type="file"
                onChange={onphotoChangeHandler}
                accept="image/png,image/jpg,image/jpeg,"
                name="fpic"
                className="form-control"
                id="photo"
                required
              />
            </div>
            <div className="col-sm-6 form-group">
              <label for="pass">Password</label>

              <input
                onChange={onChangeHandler}
                value={facultyInfo.fpass}
                type="Password"
                name="fpass"
                className="form-control"
                id="pass"
                placeholder="Enter your password."
                required
              />
            </div>
            <div className="col-sm-6 form-group">
              <label for="pass2">Confirm Password</label>

              <input
                onChange={onChangeHandler}
                value={facultyInfo.fconfirm}
                type="Password"
                name="fconfirm"
                className="form-control"
                id="pass2"
                placeholder="Re-enter your password."
                required
              />
            </div>

            <div className="col-sm-12 form-group mb-0">
              <button
                type="submit"
                className="btn btn-primary float-right"
                onClick={(e) => setSubmitData(e)}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
