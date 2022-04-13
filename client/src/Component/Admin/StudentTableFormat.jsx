import { useEffect, useState } from "react";
import {
  deleteOneStudent,
  getOneStudent,
  updateStudent,
} from "../../Api/adminApi";

import { Buffer } from "buffer";

import studentValidation from "../Validations/StudentValidation.js";

import { takeDepartment } from "../Validations/Utility";

export default function TableFormat(props) {
  const [editform, setEditForm] = useState(false);
  const [searchItem, setSearchItem] = useState("");

  const [message, setMessage] = useState("");

  const [success, setSuccess] = useState("");

  const [imag, setImag] = useState([]);

  const [studentInfo, setStudentInfo] = useState({
    sPRN: "",
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
  var table_details = props.data;

  var table_head = [
    "Sr.No.",
    "PRN",
    " Name",
    "Department",
    "Gmail",
    "Semester",
    "State",
    "Edit",
  ];

  const deleteStudent = async (item) => {
    let text = `Deleting student ${item.sname} ,\n Are you sure ? `;
    if (window.confirm(text) == true) {
      const deleteData = await deleteOneStudent(item.sPRN);

      if (deleteData.status == 200) {
        props.IncreaseCount();
        setSuccess(
          `Deleted ${item.sname} , PRN ${item.sPRN} delete from Database `
        );
      } else {
        setMessage(
          `Problem while deleting ${item.sname}, PRN ${item.sPRN} delete from Database `
        );
      }
    }
  };

  async function editStudent(item) {
    var picData = await getOneStudent(item.sPRN);

    setEditForm(true);
    setSuccess("");
    setMessage("");
    setImag(picData.data.spic.data.data);

    setStudentInfo(picData.data);
  }

  const closeForm = () => {
    setEditForm(false);
  };

  function onChangeHandler(e) {
    setMessage("");
    setSuccess("");

    setStudentInfo({ ...studentInfo, [e.target.name]: e.target.value });
  }

  //Converting Image Binary Data base 64 bit Data
  function toBase64(sdata) {
    return Buffer.from(
      String.fromCharCode.apply(null, new Uint8Array(sdata)),
      "binary"
    ).toString("base64");
  }

  // Student Adding in Databasr After Validation
  const setSubmitData = async (e) => {
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

    for (const key in Object.keys(valideData)) {
      if (Object.values(valideData)[key] === false) {
        ++isValid;
        isString = isString + nameArray[key] + ", ";
      }
    }

    if (isValid === 0) {
      let formData = new FormData();
      // delete facultyInfo.spic;
      for (var key in studentInfo) {
        var temp3 =
          key === "spic" ? "" : formData.append(key, studentInfo[key]);
      }

      //sending to Axios
      const isStudentUpdate = await updateStudent(formData);

      setSuccess("The Student information Update Successfully");
      const get = await props.IncreaseCount();
      var t =
        isStudentUpdate.status === 200
          ? setSuccess("The Student information Update Successfully")
          : "";

      setImag("");

      const temp2 =
        studentInfo.status === 200
          ? setStudentInfo({
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
            })
          : "";
    } else {
      setMessage(isString);
    }
  };

  return (
    <>
      <section
        className={`addperson  ${editform ? "editForm" : ""}`}
        id="EditStudent"
        name="EditStudent"
      >
        <div className="container">
          <button
            onClick={closeForm}
            className="btn"
            style={{ float: "right", color: "red", zoom: 2 }}
          >
            <i class="bi bi-x-square-fill"></i>
          </button>
          <h2 className="text-center">Update Student Details</h2>

          {<h5 className="op-error">{message}</h5>}

          {<h5 className="op-success">{success}</h5>}
          <div className="row jumbotron">
            <div className="col-sm-2 form-group">
              <label for="name-f">Student PRN</label>
              <input
                onChange={onChangeHandler}
                value={studentInfo.sPRN}
                className="form-control"
                name="sname"
                id="name-f"
                type="text"
                placeholder="Enter your Full name"
                required
                disabled
              />{" "}
            </div>
            <div className="col-sm-4 form-group">
              <label for="name-f">Full Name</label>
              <input
                onChange={onChangeHandler}
                value={studentInfo.sname}
                className="form-control"
                name="sname"
                id="name-f"
                type="text"
                placeholder="Enter your Full name"
                required
                disabled
              />{" "}
            </div>
            <div className="col-sm-6 form-group">
              <label for="email">Email</label>
              <input
                onChange={onChangeHandler}
                value={studentInfo.semail}
                type="email"
                className="form-control"
                name="semail"
                id="email"
                placeholder="Enter your email."
                required
                disabled
              />
            </div>
            <div className="col-sm-6 form-group">
              <label for="address-1">Address Line-1</label>
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
              <label for="zip">Postal-Code</label>
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
              <label for="Date">Date Of Birth</label>
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
              <label for="gender">Gender</label>
              <select
                onChange={onChangeHandler}
                value={studentInfo.sgender}
                id="gender"
                name="sgender"
                className="form-control browser-default custom-select"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="unspesified">Unspecified</option>
              </select>
            </div>

            <div className="col-sm-3 form-group">
              <label for="zip">Semester</label>
              <input
                onChange={onChangeHandler}
                value={studentInfo.ssemester}
                type="zip"
                className="form-control"
                name="ssemester"
                id="zip"
                placeholder="Semester"
                required
                disabled
              />
            </div>

            <div className="col-sm-3 form-group">
              <label for="zip">Department</label>
              <input
                onChange={onChangeHandler}
                value={takeDepartment(studentInfo.sdept)}
                type="zip"
                className="form-control"
                name="sdept"
                id="zip"
                placeholder="Department"
                required
                disabled
              />
            </div>

            <div className="col-sm-3 form-group">
              <label for="tel">Phone</label>
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
            {/* <div className="col-sm-3 form-group">
                <label for="photo">Add Photo</label>
                <input
                  onChange={onphotoChangeHandler}
                  
                  type="file"
                    
                    accept="image/*"
                    name="fpic"
                  className="form-control"
                  id="photo"
                  placeholder="Change Pic"
                  required
                />                                                     
              </div> */}
            <div className="userPic">
              <img
                src={`data:image/jpeg;base64,${toBase64(imag)}`}
                alt="No Pic Found"
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
      <h3 className="op-error">{message}</h3>
      <h3 className="op-success">{success}</h3>
      <div className="cms-table">
        <div className="col-sm-4  btn-search ">
          <input
            type="text"
            className="form-control "
            onChange={(e) => setSearchItem(e.target.value)}
            value={searchItem}
            placeholder="Search..."
          />
        </div>
        <table className="table table_striped">
          <thead className="bg-light">
            <tr>
              {table_head.map((item, index) => {
                return (
                  <>
                    <th scope="col" key={index}>
                      {item}
                    </th>
                  </>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {table_details
              .filter((val) => {
                if (searchItem === "") {
                  return val;
                } else if (val.sPRN.includes(searchItem.toLowerCase())) {
                  return val;
                } else if (val.sname.includes(searchItem.toLowerCase())) {
                  return val;
                } else if (
                  val.sdept.toLowerCase().includes(searchItem.toLowerCase())
                ) {
                  return val;
                } else if (
                  val.ssemester.toLowerCase().includes(searchItem.toLowerCase())
                ) {
                  return val;
                } else if (
                  val.semail.toLowerCase().includes(searchItem.toLowerCase())
                ) {
                  return val;
                }
              })
              .map((item, index) => {
                return (
                  <>
                    <tr key={index}>
                      <td>{++index}</td>

                      <td>{item.sPRN}</td>

                      <td>{item.sname}</td>
                      <td>{takeDepartment(item.sdept)}</td>
                      <td>{item.semail}</td>
                      <td>{item.ssemester.toUpperCase()}</td>
                      <td>{item.sstate}</td>

                      <td>
                        <button
                          onClick={() => editStudent(item)}
                          className="btn btn-warning"
                          name={item._id}
                        >
                          <i className="bi bi-pencil-square"></i> View & Edit
                        </button>

                        <button
                          onClick={(e) => deleteStudent(item)}
                          className="btn btn-danger"
                          name={item._id}
                        >
                          {" "}
                          <i className="bi bi-trash-fill"></i>
                        </button>
                      </td>
                    </tr>
                  </>
                );
              })}
          </tbody>
        </table>
      </div>
    </>
  );
}
