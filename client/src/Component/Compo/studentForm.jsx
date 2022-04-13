import { useEffect, useState } from "react";
// import { propTypes } from "react-bootstrap/esm/Image";
import {
  addStudentDetails,
  checkMail,
  getAllStudent,
  isFormAllow,
} from "../../Api/adminApi";
import studentValidation from "../Validations/StudentValidation";

export default function Student(props) {
  const [form, setForm] = useState(false);
  const [messageWarn, setMessageWarn] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [count, setCount] = useState(1);
  const [emailMessage, setEmailMessage] = useState("");
  const [validEmail, setValidEmail] = useState("");

  const [studentInfo, setStudentInfo] = useState({
    sname: "",
    semail: "",
    saddress: "",
    sstate: "",
    spin: "",
    sdob: "",
    sgender: "",
    sdept: "",
    ssemester: "",
    smob: "",
    spic: "",
    spass: "",
    confirmPass: "",
  });

  //===============================================================================================================
  // --------------------------------------As Page automatically Student List will get

  // Here, useEffect will operate as this Component render at first time  and then as count changes

  //============================================================================================================

  // TO save Data to State
  async function onChangeHandler(e) {
    setMessageWarn("");
    setSuccess("");
    if (e.target.name === "semail") {
      setStudentInfo({ ...studentInfo, [e.target.name]: e.target.value });
      setValidEmail(true);
    } else {
      if (
        validEmail === true &&
        studentInfo.semail.includes("@") &&
        studentInfo.semail.includes(".")
      ) {
        const isEmailValid = await checkMail(studentInfo.semail);

        if (isEmailValid.status === 200) {
          setEmailMessage("op-success");
        } else {
          const temp = studentInfo.semail;
          setEmailMessage("op-error");
        }
        setStudentInfo({ ...studentInfo, semail: e.target.value });

        setValidEmail(false);
      }
      setStudentInfo({ ...studentInfo, [e.target.name]: e.target.value });
    }
  }

  async function onphotoChangeHandler(e) {
    setMessageWarn("");
    setSuccess("");

    const file = await e.target.files[0];
    const fileSize = await e.target.files[0].size;
    if (
      (file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png") &&
      fileSize < 50000
    ) {
      setStudentInfo({ ...studentInfo, spic: e.target.files[0] });
    } else {
      setStudentInfo({ ...studentInfo, spic: null });
      setMessageWarn(
        "image should be JPEG / JPG / PNG (Format)  and Below 50kb (Size) "
      );
    }
  }

  const setSubmitData = async (e) => {
    e.preventDefault();

    console.log("....", validEmail);

    const valideData = studentValidation(studentInfo);
    let isValid = 0;
    let isString = "Check ";
    let nameArray = [
      "Name",
      "Email",
      "Address",
      "State",
      "Pin Code",
      "Date of Birth",
      "Semester",
      "Mobile No.",
      "Department",
      "Gender",
      "Image",
      "Password",
    ];

    let helper = !validEmail;
    if (validEmail === true) {
      const isEmailValid = await checkMail(studentInfo.semail);

      if (isEmailValid.status === 200) {
        setEmailMessage("op-success");

        helper = true;
      } else {
        helper = false;

        setEmailMessage("op-error");
      }
    }

    //For validation of Data
    for (const key in Object.keys(valideData)) {
      if (Object.values(valideData)[key] === false) {
        ++isValid;
        isString = isString + nameArray[key] + ", ";
      }
    }

    const check = await isFormAllow();
    

    if (check.student) {
      if (isValid === 0 && emailMessage === "op-success" && helper) {
        //converting into Formdata
        setMessageWarn("");
        let formData = new FormData();

        for (var key in studentInfo) {
          formData.append(key, studentInfo[key]);
        }
        //sending to Axios
        const isStudentSave = await addStudentDetails(formData);

        isStudentSave.status === 200
          ? setSuccess("Student Added Successfully")
          : setSuccess("Facing problem while Adding Student");
        setCount(count + 1);
      } else {
        setMessageWarn(isString);
        setSuccess("");
      }
    } else {
      setMessageWarn("Admin Not Allow To Fill Form");
    }
  };

  return (
    <>
      <section className="addperson showForm" id="addStudent" name="addStudent">
        <div className="container">
          <button
            onClick={() => props.closeForm()}
            className="btn zoom"
            style={{ float: "right", color: "red" }}
          >
            <i class="bi bi-x-square-fill"></i>
          </button>
          <h2 className="text-center">Student Admission Form</h2>

          {<h5 className="op-error">{messageWarn}</h5>}

          {<h3 className="op-success">{success}</h3>}
          <div className="row jumbotron">
            <div className="col-sm-6 form-group">
              <label for="name-f">Full Name</label>{" "}
              <input
                onChange={onChangeHandler}
                value={studentInfo.sname}
                className="form-control"
                name="sname"
                id="name-f"
                type="text"
                placeholder="Enter your Full name"
                required
              />
            </div>
            <div className="col-sm-4 form-group">
              <label for="email">
                Email{" "}
                <i
                  className={`${emailMessage} bi bi-check-circle-fill zoom `}
                ></i>
              </label>
              <input
                onChange={onChangeHandler}
                value={studentInfo.semail.toLowerCase()}
                type="email"
                className="form-control"
                name="semail"
                id="email"
                placeholder="Enter your email."
                required
              />
            </div>

            <div className="col-sm-6 form-group">
              <label for="address-1">Address </label>{" "}
              <input
                onChange={onChangeHandler}
                value={studentInfo.saddress}
                type="address"
                className="form-control"
                name="saddress"
                id="saddress"
                placeholder="Locality/House/Street no."
                required
              />
            </div>

            <div className="col-sm-4 form-group">
              <label for="State">State</label>

              <select
                name="sstate"
                id="state"
                class="form-control"
                onChange={onChangeHandler}
                value={studentInfo.sstate}
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
              <label for="zip">Postal-Code</label>{" "}
              <input
                onChange={onChangeHandler}
                value={studentInfo.spin}
                type="zip"
                className="form-control"
                name="spin"
                id="zip"
                placeholder="Postal-Code."
                required
              />
            </div>

            <div className="col-sm-3 form-group">
              <label for="Date">Date Of Birth</label>{" "}
              <input
                onChange={onChangeHandler}
                value={studentInfo.sdob}
                type="Date"
                name="sdob"
                className="form-control"
                id="Date"
                required
              />
            </div>
            <div className="col-sm-3 form-group">
              <label for="gender">Gender</label>{" "}
              <select
                onChange={onChangeHandler}
                value={studentInfo.sgender}
                id="gender"
                name="sgender"
                className="form-control browser-default custom-select"
              >
                <option value="">Select Gender</option>

                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="unspesified">Unspecified</option>
              </select>
            </div>
            <div className="col-sm-6 form-group">
              <label for="sem">Semester</label>{" "}
              <select
                onChange={onChangeHandler}
                value={studentInfo.ssemester}
                id="sem"
                name="ssemester"
                className="form-control browser-default custom-select"
              >
                <option value="">Select Semester</option>
                <option value="first">First</option>
                <option value="second">Second</option>
                <option value="third">Third</option>
                <option value="fourth">Fourth</option>
                <option value="fifth">Fifth</option>
                <option value="sixth">Sixth</option>
                <option value="seven">Seventh</option>
                <option value="eighth">Eighth</option>
              </select>
            </div>

            <div className="col-sm-6 form-group">
              <label for="dept">Department</label>{" "}
              <select
                onChange={onChangeHandler}
                value={studentInfo.sdept}
                id="dept"
                name="sdept"
                className="form-control browser-default custom-select"
              >
                <option value="">Select Department</option>
                <option value="ele">Electrical Engineering</option>
                <option value="mech">Mechanical Engineering</option>
                <option value="civil">Civil Engineering</option>
                <option value="it">Information Technology </option>
                <option value="entc">Electronics Engineering</option>
              </select>
            </div>
            <div className="col-sm-3 form-group">
              <label for="tel">Mobile Number</label>{" "}
              <input
                onChange={onChangeHandler}
                value={studentInfo.smob}
                type="tel"
                name="smob"
                className="form-control"
                id="tel"
                placeholder="Enter Your Contact Number."
                required
              />
            </div>
            <div className="col-sm-3 form-group">
              <label for="photo">Add Photo</label>{" "}
              <input
                onChange={onphotoChangeHandler}
                type="file"
                accept="image/png,image/jpg,image/jpeg"
                name="fpic"
                className="form-control"
                id="photo"
                placeholder="Choose Pic"
                required
              />
            </div>
            <div className="col-sm-6 form-group">
              <label for="pass">Password</label>{" "}
              <input
                onChange={onChangeHandler}
                value={studentInfo.spass}
                type="Password"
                name="spass"
                className="form-control"
                id="pass"
                placeholder="Enter your password."
                required
              />
            </div>
            <div className="col-sm-6 form-group">
              <label for="pass2">Confirm Password</label>{" "}
              <input
                onChange={onChangeHandler}
                value={studentInfo.confirmPass}
                type="Password"
                name="confirmPass"
                className="form-control"
                id="pass2"
                placeholder="Re-enter your password."
                required
              />
            </div>

            <div className="col-sm-12 form-group mb-0">
              <button
                type="reset"
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
