import { useEffect, useState } from "react";
//---------------------------------------------------------------------------------
import {
  deleteOneFaculty,
  getAllSubject,
  getOneFaculty,
  updateFaculty,
  allocateSubToFaculty,
  checkLogger,
} from "../../Api/adminApi";

import { Buffer } from "buffer";

import facultyValidation from "../Validations/FacultyValidation";

import { takeDepartment } from "../Validations/Utility";

export default function TableFormat(props) {
  const [editform, setEditForm] = useState(false);
  const [searchItem, setSearchItem] = useState("");

  const [formAllocateSubjects, setFormAllocateSubjects] = useState(false);
  const [tableDetails, setTableDetails] = useState([]);

  const [messageWarn, setMessageWarn] = useState("");

  const [success, setSuccess] = useState("");
  const [countforAlloSub, setCountforAlloSub] = useState(0);

  const [imag, setImag] = useState([]);

  const [allocatedSub, setAllocatedSub] = useState({
    fPRN: "",
  });
  var serial = 1;
  const [facultyInfo, setFacultyInfo] = useState({
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
  var table_details = props.data;

  useEffect(async () => {
    var temp = await getAllSubject();

    var tableArray = [];
    temp.data.map((item, index) => {
      const keys = Object.keys(item);
      const val = Object.values(item);
      

      for (const key in val) {
        if (typeof val[key] === "object") {
          val[key].map((o) => {
            if (!o.isAllocate) {
              var temp = {
                subID: o.subID,
                name: o.name,
                sem: keys[key],
                dept: val[1],
                lec: o.lecture,
              };

              tableArray.push(temp);
            }
          });
        }
      }

      setTableDetails(tableArray);
    });
  }, [countforAlloSub]);

  var table_head = [
    "Sr.No.",
    "PRN",
    "Name",
    "Department",
    "Gmail",
    "Education",
    "State",
    "Edit",
  ];

  // var table_details = props.data;
  var index = "";

  const deleteFaculty = async (id, name) => {
    let text = `Deleting faculty ${name} ,\n Are you sure ? `;
    if (window.confirm(text) == true) {
      const deleteData = await deleteOneFaculty(id);

      if (deleteFaculty.status == 200) {
        props.IncreaseCount();
        setSuccess(`Deleted ${name} , PRN ${id} delete from Database `);
      } else {
        setMessageWarn(
          `Problem while deleting ${name}, PRN ${id} delete from Database `
        );
      }
    }
  };

  var arrayOfAlloSub = [];
  const allocateSubFun = (item) => {
    if (arrayOfAlloSub.includes(item)) {
      const temp = arrayOfAlloSub;
      arrayOfAlloSub = temp.filter((ele) =>
        ele.name !== item.name ? item : ""
      );
    } else {
      arrayOfAlloSub.push(item);
    }
  };

  async function editFaculty(fPRN) {
    setMessageWarn("");

    picData = await getOneFaculty(fPRN);

    if (picData.status === 200) {
      setEditForm(true);
      setImag(picData.data.fpic.data.data);
      setFacultyInfo(picData.data);
    } else {
      setMessageWarn("Can't load faulty information");
    }
  }

  const closeForm = () => {
    setMessageWarn("");
    setSuccess("");
    setEditForm(false);
  };

  var picData = "";

  function onChangeHandler(e) {
    setMessageWarn("");
    setSuccess("");

    if (e.target.name === "faculty") {
      setAllocatedSub({ ...allocatedSub, fPRN: e.target.value });
    } else setFacultyInfo({ ...facultyInfo, [e.target.name]: e.target.value });
  }

  function toBase64(sdata) {
    return Buffer.from(
      String.fromCharCode.apply(null, new Uint8Array(sdata)),
      "binary"
    ).toString("base64");
  }

  const setAllocateSubData = async () => {
    setMessageWarn("");
    const dataForBackend = { fPRN: "", subjects: "" };
    dataForBackend["fPRN"] = allocatedSub.fPRN;
    dataForBackend["subjects"] = arrayOfAlloSub;

    // setAllocatedSub({...allocatedSub,subjects:[arrayOfAlloSub]})

    if (allocatedSub.fPRN !== "" && arrayOfAlloSub.length > 0) {
      var isSubAllocate = await allocateSubToFaculty(dataForBackend);
      if (isSubAllocate.status === 200) {
        setCountforAlloSub(countforAlloSub + 1);
        setSuccess("Subjects are/is Allocate SuccessFylly");
      }

      setTableDetails([]);
    } else {
      setMessageWarn("Select Faculty Or Subject properly");
    }
  };
  // const data="";

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

    if (isValid === 0) {
      //converting into Formdata
      setMessageWarn("");
      let formData = new FormData();
      // delete facultyInfo.spic;
      for (var key in facultyInfo) {
        var temp3 =
          key === "spic" ? "" : formData.append(key, facultyInfo[key]);
      }

      //sending to Axios
      const facultyinfo = await updateFaculty(formData);

      const get = await props.IncreaseCount();

      if (facultyInfo.status === 200) {
        setImag("");
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
        setSuccess("There is proble while saving the data");
      }
    } else {
      setMessageWarn(isString);
    }
  };

  return (
    <>
      <section
        className={`addperson ${
          props.formAllocateSubjects || formAllocateSubjects ? "showForm" : ""
        }`}
        id="addFaculty"
        name="addFaculty"
      >
        <div className="container">
          <button
            onClick={() => {
              props.showForm("formAllocateSubjects");
              closeForm();
            }}
            className="btn"
            style={{ float: "right", color: "red" }}
          >
            <i class="bi bi-x-square-fill"></i>
          </button>
          <h2 className="text-center">Faculty Subject Allocation Form</h2>

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
            <div className=" col-lg-12 form-group">
              <label for="dept">Choose Faculty</label>

              <select
                className="form-control"
                id="dept"
                name="faculty"
                onChange={onChangeHandler}
                // value={allocateSubjectInfo.name}
              >
                <option value="">Select Faculty</option>
                {table_details.map((item) => {
                  return (
                    <>
                      <option value={item.fPRN}>
                        {item.fname} @({takeDepartment(item.fdept)}){" "}
                      </option>
                    </>
                  );
                })}
              </select>
            </div>

            {/* <button className="btn btn-dark col-2" onClick={getAllSubjects} style={{margin:"10px"}}>
              Get Subject List
            </button> */}
            <br />
            <br />

            <div className=" col-lg-12 form-group">
              <label for="dept">Choose Subject</label>{" "}
              <h6>Below sub are not allocate yet</h6>
              <div className=" alloc-table my-scroll cms-table  ">
                <table className="table table-striped ">
                  <thead className="bg-light">
                    <tr>
                      <th scope="col">SubId.</th>
                      <th scope="col">Name</th>
                      <th scope="col">Semester</th>
                      <th scope="col">Department</th>

                      <th scope="col">Select to Asign</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableDetails
                      .filter((i) => {
                        if (allocatedSub.fPRN.includes("ELE")) {
                          return i.dept === "ele" ? i : "";
                        } else if (allocatedSub.fPRN.includes("CIVIL")) {
                          return i.dept === "civil" ? i : "";
                        } else if (allocatedSub.fPRN.includes("IT")) {
                          return i.dept === "it" ? i : "";
                        } else if (allocatedSub.fPRN.includes("ENTC")) {
                          return i.dept === "entc" ? i : "";
                        } else if (allocatedSub.fPRN.includes("MECH")) {
                          return i.dept === "mech" ? i : "";
                        }

                        return i;
                      })
                      .map((item) => {
                        console.log("kkkkk",item)
                        return (
                          <>
                            <tr>
                              <td scope="col">{item.subID}</td>
                              <td scope="col">{item.name}</td>
                              <td scope="col">{item.sem.toUpperCase()}</td>

                              <td scope="col">{takeDepartment(item.dept)}</td>

                              <td scope="col">
                                <input
                                  type="checkbox"
                                  onChange={() => allocateSubFun(item)}
                                />
                              </td>
                            </tr>
                          </>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="col-12 form-group mb-0">
              <button
                type="submit"
                className="btn btn-primary float-right"
                onClick={setAllocateSubData}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </section>

      <section
        className={`addperson ${editform ? "editForm" : ""}`}
        id="editFaculty"
        name="editFaculty"
      >
        <div className="container">
          <button
            onClick={closeForm}
            className="btn"
            style={{ float: "right", color: "red" }}
          >
            <i class="bi bi-x-square-fill"></i>
          </button>
          <h2 className="text-center">Update Faculty Details</h2>

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
            <div className="col-sm-2 form-group">
              <label for="name-l">Faculty PRN</label>
              <input
                onChange={onChangeHandler}
                value={facultyInfo.fPRN}
                type="text"
                className="form-control"
                name="fname"
                id="name-l"
                placeholder="Enter your last name."
                disabled
                required
              />
            </div>
            <div className="col-sm-4 form-group">
              <label for="name-l">Full Name</label>
              <input
                onChange={onChangeHandler}
                value={facultyInfo.fname}
                type="text"
                className="form-control"
                name="fname"
                id="name-l"
                placeholder="Enter your last name."
                disabled
                required
              />
            </div>
            <div className="col-sm-6 form-group">
              <label for="email">Email</label>
              <input
                onChange={onChangeHandler}
                value={facultyInfo.femail}
                type="email"
                className="form-control"
                name="femail"
                id="email"
                disabled
                placeholder="Enter your email."
                required
              />
            </div>
            <div className="col-sm-6 form-group">
              <label for="address-1">Address</label>

              <input
                onChange={onChangeHandler}
                value={facultyInfo.faddress}
                type="faddress"
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
                name="sstate"
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
                type="texr"
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
                <option name="Choose">Choose</option>
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
            <div className=" col-sm-3 form-group">
              <label for="dept">Department</label>
              <select className="form-control" id="dept" name="fdept" disabled>
                <option name="">{takeDepartment(facultyInfo.fdept)}</option>
              </select>
            </div>

            <div className="userPic">
              <img
                src={`data:image/jpeg;base64,${toBase64(imag)}`}
                alt="No Pic Found"
              />
            </div>
            <div className="col-sm-12 form-group mb-0">
              <button
                className="btn btn-primary float-right"
                onClick={(e) => setSubmitData(e)}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </section>
      <h3 className="op-error">{messageWarn}</h3>
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

                console.log(takeDepartment(val.fdept))
                if (searchItem === "") {
                  return val;
                } else if (val.fPRN.includes(searchItem.toLowerCase())) {
                  return val;
                } else if (val.fname.includes(searchItem.toLowerCase())) {
                  return val;
                } else if (
                  val.femail.toLowerCase().includes(searchItem.toLowerCase())
                ) {
                  return val;
                } else if (
                                    takeDepartment(val.fdept)
                                      .toString()
                                      .toLowerCase()
                                      .includes(searchItem.toLowerCase())
                                  ) {
                  return val;
                }
              })
              .map((item, index) => {
                return (
                  <>
                    <tr key={index}>
                      <td>{serial++}</td>

                      <td>{item.fPRN}</td>

                      <td>{item.fname}</td>
                      <td>{takeDepartment(item.fdept)}</td>
                      <td>{item.femail}</td>

                      <td>{item.fedu}</td>
                      <td>{item.fstate}</td>

                      <td>
                        <button
                          onClick={() => editFaculty(item.fPRN)}
                          className="btn btn-warning"
                          name={item._id}
                        >
                          <i className="bi bi-pencil-square"></i>View & Edit
                        </button>

                        <button
                          onClick={() => deleteFaculty(item.fPRN, item.fname)}
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
