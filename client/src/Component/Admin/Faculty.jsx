import { useEffect, useState } from "react";
import {
  addFacultyDetails,
  checkMail,
  getAllFaculty,
} from "../../Api/adminApi";

import facultyValidation from "../Validations/FacultyValidation";
import FacultyTableFormat from "./FacultyTableFormat.jsx";

import { check } from "../Validations/Utility";

import xlsx from "json-as-xlsx";

export default function Faculty() {
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

  useEffect( () => {

   async  function temp(){
      const isCheck = await check("admin");
      setCount(isCheck);
      setLogin(isCheck);
  
      if (isCheck) {
        const temp = await getAllFaculty();
        console.log("amskalksdks", login);
  
        setAllFacultyData(temp.data);
      }

    }
    temp()
 
  }, [count]);

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
          setEmailMessage({  fname: "",
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
          fconfirm: "",})
          console.log("sucessss");
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

  let facultydata = [
    {
      sheet: "Faculty Data",
      columns: [
        { label: "PRN", value: "fPRN" }, // Top level data

        { label: "Name", value: "fname" }, // Top level data
        { label: "Email", value: "femail" }, // Top level data
        { label: "Mobile No", value: "fmob" }, // Top level data
        { label: "DOB", value: "fdob" }, // Top level data
        { label: "Gender", value: "fgender" }, // Top level data
        { label: "Address", value: "faddress" }, // Top level data
        { label: "Pin", value: "fpin" },
        { label: "State", value: "fstate" }, // Top level data

        { label: "Education", value: "fedu" }, // Top level data
        { label: "Department", value: "fdept" }, // Top level data
        // { label: "Department", value: (row) => (row.more ? row.more.phone || "" : "") }, // Run functions
      ],
      content: allFacultyData,
    },
  ];

  let settings = {
    fileName: "FacultyData", // Name of the resulting spreadsheet
    extraLength: 17, // A bigger number means that columns will be wider
    writeOptions: {}, // Style options from https://github.com/SheetJS/sheetjs#writing-options
  };

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

  function IncreaseCount() {
    
    setCount(count + 1);
  }

  // const data="";
  var data = [];

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

    let helper = !validEmail;
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

    if (
      isValid === 0 &&
      emailMessage === "op-success" &&
      helper
    ) {
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

  //For Hiding and Showing Student Form
  const showFormk = (whichForm) => {
    setEmailMessage("");
    setMessageWarn("");
    setSuccess('')
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

    
    if (whichForm === "formAddFaculty") {
      formAddFaculty ? setFormAddFaculty(false) : setFormAddFaculty(true);
    } else if (whichForm === "formAllocateSubjects") {
      formAllocateSubjects
        ? setFormAllocateSubjects(false)
        : setFormAllocateSubjects(true);
    }
  };

  // --------------------------------------------------------------------------------------------------

  return (
    <>
      
                <div className="sub-heading">
                  <div>Faculty</div>
                </div>
                <div>
                  <div className="container row-cols-5 fl-row">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => showFormk("formAddFaculty")}
                    >
                      <a>
                        {" "}
                        <i className="bi bi-person-plus-fill"></i> Add Faculty
                      </a>
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => showFormk("formAllocateSubjects")}
                    >
                      <i className="bi bi-person-lines-fill"></i> Allocate
                      Subjects to Faculty
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => xlsx(facultydata, settings)}
                    >
                      <i class="bi bi-cloud-download-fill"></i> Download All
                      Faculty Data{" "}
                    </button>

                    {/* {formSubmit?<h1  style={{color:"greenyellow"}}>Last Form Submit SuccessFully</h1>:""} */}
                  </div>

                  <section
                    className={`addperson ${formAddFaculty ? "showForm" : ""}`}
                    id="addFaculty"
                    name="addFaculty"
                  >
                    <div className="container">
                      <button
                        onClick={() => showFormk("formAddFaculty")}
                        className="btn"
                        style={{ float: "right", color: "red" }}
                      >
                        <i class="bi bi-x-square-fill"></i>
                      </button>
                      <h2 className="text-center">Faculty Form</h2>

                      {<h5 className="op-error">{messageWarn}</h5>}

                      {
                        <h5
                          className="op-success"
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
                              // className={`${emailMessage} bi bi-check-circle-fill zoom `}
                              className={emailMessage?`${emailMessage} bi bi-check-circle-fill zoom`:""}
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
                            <option value="Andhra Pradesh">
                              Andhra Pradesh
                            </option>
                            <option value="Andaman and Nicobar Islands">
                              Andaman and Nicobar Islands
                            </option>
                            <option value="Arunachal Pradesh">
                              Arunachal Pradesh
                            </option>
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
                            <option value="Himachal Pradesh">
                              Himachal Pradesh
                            </option>
                            <option value="Jammu and Kashmir">
                              Jammu and Kashmir
                            </option>
                            <option value="Jharkhand">Jharkhand</option>
                            <option value="Karnataka">Karnataka</option>
                            <option value="Kerala">Kerala</option>
                            <option value="Madhya Pradesh">
                              Madhya Pradesh
                            </option>
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
                            <option value="entc">
                              Electronics Engineering
                            </option>
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

                  <FacultyTableFormat
                    data={allFacultyData}
                    IncreaseCount={IncreaseCount}
                    formAllocateSubjects={formAllocateSubjects}
                    showForm={showFormk}
                  />
                </div>
             
    </>
  );
}
