import { useEffect, useState } from "react";
import {
  addSubject,
  getAllSubject,
  updateSubject,
  addDepart,
  deleteSubject,
} from "../../Api/adminApi";

import Menu from "./menu.jsx";

import { takeDepartment, check } from "../Validations/Utility";
import subjectValidation from "../Validations/SubjectValidation";
import xlsx from "json-as-xlsx";

export default function Subject() {
  // const [login, setLogin] = useState({isLogin:"",PRN:"",username:"",token:"",user:""});
  const [login, setLogin] = useState(false);

  const [form, setForm] = useState(false);
  const [message, setMessage] = useState(false);
  const [success, setSuccess] = useState("");
  const [tableDetails, setTableDetails] = useState([]);

  const [count, setCount] = useState(1);
  const [searchItem, setSearchItem] = useState("");
  const [subDataForXSL, setSubDataForXSL] = useState([]);

  const [subjectInfo, setSubjectInfo] = useState({
    sname: "",

    sdept: "",
    ssemester: "",
  });

  const [newDepartment, setNewDepartment] = useState({
    deptname: "",
  });

  var countForIndex = 1;
  var countTest = 1;
  var arrayBig = [];
  //===============================================================================================================
  // --------------------------------------As Page automatically Student List will get

  // Here, useEffect will operate as this Component render at first time  and then as count changes

  useEffect(async () => {
    const isCheck = await check("admin");
    setLogin(isCheck);

    if (isCheck) {
      const temp = await getAllSubject();

      setTableDetails(temp.data);

      let biggestArray = [];
      temp.data.map((item, index) => {
        const keys = Object.keys(item);
        const val = Object.values(item);
        arrayBig = [];
        for (const key in val) {
          if (typeof val[key] === "object") {
            val[key].map((o) => {
              var temp = {
                subID: o.subID,
                name: o.name,
                sem: keys[key],
                dept: val[1],
                lec: o.lecture,
              };

              biggestArray.push(temp);
            });
          }
        }
      });

      setSubDataForXSL(biggestArray);
    }
  }, [count, login]);

  let subjectdata = [
    {
      sheet: "Student Data",
      columns: [
        { label: "ID", value: "subID" }, // Top level data
        { label: "Name", value: "name" }, // Top level data
        { label: "Semester", value: "sem" }, // Top level data
        { label: "Department", value: "dept" }, // Top level data
        // { label: "Department", value: (row) => (row.more ? row.more.phone || "" : "") }, // Run functions
      ],
      content: subDataForXSL,
    },
  ];

  let settings = {
    fileName: "SubjectData", // Name of the resulting spreadsheet
    extraLength: 17, // A bigger number means that columns will be wider
    writeOptions: {}, // Style options from https://github.com/SheetJS/sheetjs#writing-options
  };

  //============================================================================================================

  function onChangeHandler(e) {
    setMessage("");
    setSuccess("");
    const name = e.target.name;
    const value = e.target.value;

    if (name !== "deptname") setSubjectInfo({ ...subjectInfo, [name]: value });
    else {
      setSubjectInfo({ ...subjectInfo, sdept: value });
      setNewDepartment({ [name]: value });
    }
  }

  async function subjectDelete(data) {
    setMessage("");
    setSuccess("");
    let text = `Deleting ${data.name}, Are you sure?`;
    if (window.confirm(text) === true) {
      const temp = `${data.name}.${data.sem}.${data.dept}.${data.lec}`;
      const isDeleteSubject = await deleteSubject(temp);

      if (isDeleteSubject.status === 200) {
        setCount(count + 1);
        setSuccess(`${data.name} is deleted `);
      }
    }
  }

  async function addDepartment() {
    var isAddDepartment = await addDepart(newDepartment);
    // console.log("from serevr isAddDepartment>", isAddDepartment);

    return isAddDepartment.status === 200 ? true : false;
  }

  const setSubmitData = async (e) => {
    e.preventDefault();

    const valideData = subjectValidation(subjectInfo);

    let isValid = 0;
    let isString = "Check ";
    let nameArray = ["Name", "Semester", "Department"];

    //For validation of Data
    for (const key in Object.keys(valideData)) {
      if (Object.values(valideData)[key] === false) {
        ++isValid;
        isString = isString + nameArray[key] + ", ";
      }
    }

    var isNewDepartAdd = false;
    if (newDepartment.deptname.length > 1) {
      isNewDepartAdd = await addDepartment();
    } else {
      isNewDepartAdd = true;
    }

    if (isValid === 0 && isNewDepartAdd) {
      setMessage(false);
      let formData = new FormData();

      for (var key in subjectInfo) {
        formData.append(key, subjectInfo[key]);
      }
      //sending to Axios
      const subjectinfo = await addSubject(subjectInfo);

      subjectinfo.status === 200
        ? setSuccess("Subject is added")
        : setMessage("Problem while adding subject");
      setCount(count + 1);
    } else {
      setMessage(isString);
    }
  };

  //For Hiding and Showing Student Form
  const showFormk = () => {
    var temp = form ? setForm(false) : setForm(true);
    var temp = form ? setSuccess("") : "";
    temp = form
      ? setSubjectInfo({
          sname: "",

          sdept: "",
          ssemester: "",
        })
      : "";
    if (form) {
      setForm(false);
      setSuccess("");
      setSubjectInfo({
        sname: "",

        sdept: "",
        ssemester: "",
      });
      setNewDepartment({ deptname: "" });
    } else setForm(true);
  };

  return (
    <>
      <div className="sub-heading">
        <div>Subject</div>
      </div>
      <div>
        <div className="container row-cols-5 fl-row">
          <button type="button" className="btn btn-primary" onClick={showFormk}>
            <i className="bi bi-file-earmark-plus-fill"></i> Add Subject
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => xlsx(subjectdata, settings)}
          >
            <i className="bi bi-cloud-download-fill"></i> Download Subject Data
            List
          </button>
        </div>

        <section
          className={` col-lg-6 subjectForm ${
            form ? "showForm" : ""
          }  fl-center`}
          id="addStudent"
          name="addStudent"
        >
          <div className="container cms-form">
            <button
              onClick={showFormk}
              className="btn"
              style={{ float: "right", color: "red" }}
            >
              <i className="bi bi-x-square-fill"></i>
            </button>
            <h2 className="text-center">Add Subject</h2>

            {<h5 className="op-error">{message}</h5>}

            {<h3 className="op-success">{success}</h3>}
            <section className="addSubject" id="addSubject" name="addSubject">
              <div className="container">
                <div className="col-sm-12 form-group">
                  <label htmlFor="name-f">Subject Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="sname"
                    id="name-f"
                    placeholder="Enter Subject name"
                    onChange={onChangeHandler}
                    value={subjectInfo.sname}
                    required
                  />
                </div>
                <div className="row">
                  <div className=" col-sm-6 form-group">
                    <label htmlFor="dept">Department</label>
                    <select
                      className="form-control"
                      id="dept"
                      name="sdept"
                      onChange={onChangeHandler}
                      value={subjectInfo.sdept}
                    >
                      <option value="">Choose Department</option>

                      {tableDetails.map((item) => (
                        <option value={item.deptname}>
                          {takeDepartment(item.deptname) !== "Not Mention"
                            ? takeDepartment(item.deptname)
                            : item.deptname}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className=" col-sm-6 form-group">
                    <label htmlFor="dept">Add New Department</label>
                    <input
                      type="text"
                      className="form-control"
                      name="deptname"
                      id="name-f"
                      placeholder="Enter in Short (example: Electrical (ele)  )"
                      onChange={onChangeHandler}
                      value={newDepartment.deptname}
                      required
                    />
                  </div>
                </div>

                <div className=" col-sm-12 form-group">
                  <label htmlFor="semster">Semster</label>
                  <select
                    className="form-control"
                    id="sem"
                    name="ssemester"
                    onChange={onChangeHandler}
                    value={subjectInfo.ssemester}
                  >
                    <option value="">Choose Semester</option>
                    <option value="first">First</option>
                    <option value="second">Second</option>
                    <option value="third">Third</option>
                    <option value="fourth">Fourth</option>
                    <option value="fifth">Fifth</option>
                    <option value="sixth">Sixth</option>
                    <option value="seventh">Seventh</option>
                    <option value="eighth">Eighth</option>
                  </select>
                </div>

                <div className="col-sm-12 form-group mb-0">
                  <button
                    className="btn btn-primary float-right"
                    onClick={setSubmitData}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </section>
          </div>
        </section>

        {/*---------------------- Student Form------------------------- */}

        {/*------------------------------------------------------ Edit Form End------------------------------------------------------------------------------ */}
        <section className="allSubjects">
          {<h3 className="op-success">{success}</h3>}
          <div className="col-sm-4  btn-search ">
            <input
              type="text"
              className="form-control "
              onChange={(e) => setSearchItem(e.target.value)}
              value={searchItem}
              placeholder="Search..."
            />
          </div>
          <div className="cms-table">
            <table className="table table-striped">
              <thead className="bg-light">
                <tr>
                  <th scope="col">Sr.No.</th>

                  <th scope="col">SubId.</th>
                  <th scope="col">Name</th>
                  <th scope="col">Department</th>
                  <th scope="col">Semester</th>
                  <th scope="col">Edit</th>
                </tr>
              </thead>
              <tbody>
                {subDataForXSL

                  .filter((val) => {
                    if (searchItem === "") {
                      return val;
                    } else if (
                      val.subID.toLowerCase().includes(searchItem.toLowerCase())
                    ) {
                      return val;
                    } else if (
                      val.name.toString().includes(searchItem.toLowerCase())
                    ) {
                      return val;
                    } else if (
                      takeDepartment(val.dept)
                        .toString()
                        .toLowerCase()
                        .includes(searchItem.toLowerCase())
                    ) {
                      return val;
                    } else if (
                      val.sem
                        .toString()
                        .toLowerCase()
                        .includes(searchItem.toLowerCase())
                    ) {
                      return val;
                    }
                  })

                  .map((item, ind) => {
                    return (
                      <>
                        <tr key={item.subID}>
                          <td>{countForIndex++}</td>
                          <td>{item.subID}</td>
                          <td>{item.name}</td>
                          <td>
                            {takeDepartment(item.dept) !== "Not Mention"
                              ? takeDepartment(item.dept)
                              : item.dept}
                          </td>
                          <td>{item.sem.toUpperCase()}</td>
                          <td>
                            <button
                              onClick={() => subjectDelete(item)}
                              className="btn btn-danger"
                              name={item._id}
                            >
                              {" "}
                              <i className="bi bi-trash-fill"></i> Delete
                            </button>
                          </td>
                        </tr>
                      </>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
