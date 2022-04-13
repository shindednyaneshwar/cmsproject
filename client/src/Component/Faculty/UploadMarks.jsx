import { useEffect, useState } from "react";
// import { checkLogger, getAllSubject } from "../../Api/adminApi";
import { getAcademicOfStud, setAcademicData } from "../../Api/facultyApi";
import { check } from "../Validations/Utility";

import xlsx from "json-as-xlsx";
export default function UploadMarks(props) {
  const [message, setMessage] = useState("");
  const [searchItem, setSearchItem] = useState("");
  const [isDisable, setIsDisable] = useState("disabled");

  const [selectSub, setSelectSub] = useState({
    subID: "",
    name: "",
    sem: "",
    dept: "",
    lec: "",
  });
  const [stateStudentMarks, setStateStudentMarks] = useState([]);

  const [subjects, setSubjects] = useState([]);

  useEffect(async () => {
    if (await check("faculty")) {
      const q = JSON.parse(
        localStorage.getItem("userPersonalDetail")
      ).allocateSubject;
      if (q) {
        setSubjects(q);
      }
    }
  }, []);

  let StudentAcdata = [
    {
      sheet: "Faculty Data",
      columns: [
        { label: "PRN", value: "sPRN" }, // Top level data

        { label: "Name", value: "sname" }, // Top level data
        { label: "1st Test", value: "first" }, // Top level data
        { label: "2nd Test", value: "second" }, // Top level data
        { label: "Exam", value: "exam" }, // Top level data
        { label: "Attendance", value: "attendance" }, // Top level data

        // { label: "Department", value: (row) => (row.more ? row.more.phone || "" : "") }, // Run functions
      ],
      content: stateStudentMarks,
    },
  ];

  let settings = {
    fileName: "Student.Academic.Data", // Name of the resulting spreadsheet
    extraLength: 17, // A bigger number means that columns will be wider
    writeOptions: {}, // Style options from https://github.com/SheetJS/sheetjs#writing-options
  };

  async function setAcademicDataFun() {
    const isAcademicData = await setAcademicData(stateStudentMarks);

    setMessage(isAcademicData.data.message);
  }

  function update(e) {
    if (e.target.value !== " ") {
      const temp = e.target.value;
      const item = subjects.filter((item) =>
        item.name === temp ? item : ""
      )[0];

      setSelectSub({
        subID: item.subID,
        name: item.name,
        sem: item.sem,
        dept: item.dept,
        lec: item.lec,
      });
    }
  }

  function onChangeHandler(prn, e) {
    setMessage("");
    const { name, value } = e.target;
    setStateStudentMarks((stateStudentMarks) =>
      stateStudentMarks.map((id) =>
        id.sPRN === prn ? { ...id, [name]: value } : id
      )
    );

 
  }

  const getList = async () => {
    if (selectSub.name !== "") {
     

      var temp = `${selectSub.sem}-${selectSub.dept}`;
      const academicOfStu = await getAcademicOfStud(temp);
      if (academicOfStu.status === 200) {
        setIsDisable(false);
        var tempObj = [];
        academicOfStu.data.map((item) => {
          const temp = extractSub(item);
          const temp1 = {
            sPRN: item.sPRN,
            sname: item.studentName,
            ssem: item.studentSem,
            ssub: selectSub.name,
            first: temp[0].first,
            second: temp[0].second,
            exam: temp[0].exam,
            attendance: temp[0].attendance,
          };
         tempObj.push(temp1);
        });

        setStateStudentMarks(tempObj);
      } else {
        setMessage("Not Getting Data");
      }
    } else {
      setMessage("Select Subject");
    }
  };

  function extractSub(item) {
    for (const keys of Object.keys(item)) {
           if (keys === "subjects") {
        
        return Object.values(item[keys]);
      }
    }
  }

  return (
    <>
      <div className="sub-heading">
        <div>Upload Marks</div>
      </div>
      <div className="getList fl-column">
        <h5 style={{ color: "orangered" }}>{message}</h5>
        <div className="form-group flex">
          <label htmlFor="semster" className="col-lg-2">
            Select Subject
          </label>
          <select
            className="form-control"
            id="subjects"
            name="subjects"
            onChange={update}
          >
            <option value="Select Subject">Select Subject</option>
            {subjects.length > 0 ? (
              subjects.map((item, index) => {
                return (
                  <>
                    <option value={item.name}>{item.name}</option>
                  </>
                );
              })
            ) : (
              <option value={""}>Subjects are not Allocate Yet</option>
            )}
          </select>
        </div>
        <div></div>

        <div className="container row-cols-5 fl-row">
          <button type="button" className="btn btn-primary" onClick={getList}>
            <i className="bi bi-cloud-download"></i> <span>Get List</span>
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={isDisable}
            onClick={() => xlsx(StudentAcdata, settings)}
          >
            <i className="bi bi-cloud-download"></i> <span>Download Data</span>
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={setAcademicDataFun}
          >
            <i className="bi bi-cloud-upload"></i> Submit
          </button>
        </div>
      </div>

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

        <table className="table table-striped">
          <thead className="bg-light">
            <tr>
              <th scope="col" className="col-sm-1">
                Sr. No.
              </th>

              <th scope="col" className="col-sm-2">
                Student PRN
              </th>
              <th scope="col" className="col-sm-3">
                Name
              </th>
              <th scope="col" className="col-lg-1">
                Test1
              </th>
              <th scope="col" className="col-lg-1">
                Test2
              </th>
              <th scope="col" className="col-lg-1">
                Exam
              </th>
              <th scope="col" className="col-lg-2">
                Attendance
              </th>
            </tr>
          </thead>
          <tbody>
            {stateStudentMarks
              .filter((val) => {
                if (searchItem === "") {
                  return val;
                } else if (
                  val.sPRN.toLowerCase().includes(searchItem.toLowerCase())
                ) {
                  return val;
                } else if (
                  val.sname.toLowerCase().includes(searchItem.toLowerCase())
                ) {
                  return val;
                }
              })
              .map((item, index) => {
                console.log("tableDetails", item);

                return (
                  <>
                    <tr>
                      <td scope="col">{++index}</td>

                      <td scope="col">{item.sPRN}</td>
                      <td scope="col">{item.sname}</td>

                      <td scope="col">
                        <input
                          onChange={(e) => onChangeHandler(item.sPRN, e)}
                          value={item.first || 0}
                          type="number"
                          min="0"
                          max="50"
                          className="form-control"
                          name="first"
                          id="address-1"
                          placeholder="Test 1"
                          required
                        />
                      </td>
                      <td scope="col">
                        <input
                          onChange={(e) => onChangeHandler(item.sPRN, e)}
                          value={item.second}
                          type="number"
                          min="0"
                          max="50"
                          className="form-control"
                          name="second"
                          id="address-1"
                          placeholder="Test 2"
                          required
                        />
                      </td>
                      <td scope="col">
                        <input
                          onChange={(e) => onChangeHandler(item.sPRN, e)}
                          value={item.exam}
                          type="number"
                          className="form-control"
                          name="exam"
                          min="0"
                          max="100"
                          id="address-1"
                          placeholder="Exam"
                          required
                        />
                      </td>

                      <td scope="col">{item.attendance}</td>
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
