import { useEffect, useState } from "react";

import {
  saveNotification,
  getnotifications,
  getOneNotification,
  deleteOneNotification,
} from "../../Api/facultyApi";
import { check, takeDepartment } from "../Validations/Utility";

import { Buffer } from "buffer";
export default function Subject() {
  const [notifications, setNotifications] = useState([]);
  const [userData, setUserData] = useState();
  const [message, setMessage] = useState("");
  const [messageWarn, setMessageWarn] = useState("");
  const [pdfFile, setpdfFile] = useState("");
  const [countForNewNoti, setCountForNewNoti] = useState(0);
  const [searchItem, setSearchItem] = useState("");
  const [success, setSuccess] = useState("");

  const [notificationInfo, setNotificationInfo] = useState({
    title: "",
    file: "",
    facultyName: "",
    semester: [],
    dept: [],
  });

  useEffect(async () => {
    var c = await check("faculty");

    if (c) {
      const dataNotificaton = await getnotifications();

      if (dataNotificaton.status === 200) {
        setNotifications(dataNotificaton.data);
      }

      setUserData(JSON.parse(localStorage.getItem("userPersonalDetail")).fname);
      setNotificationInfo({
        title: "",
        file: "",
        facultyName: "",
        semester: [],
        dept: [],
      });
      setNotificationInfo({
        ...notificationInfo,
        facultyName: JSON.parse(localStorage.getItem("userPersonalDetail"))
          .fname,
      });
    }
  }, [countForNewNoti]);

  function toBase64(sdata) {
    return Buffer.from(
      String.fromCharCode.apply(null, new Uint8Array(sdata)),
      "binary"
    ).toString("base64");
  }

  function onChangeHandler(e) {
    setMessage("");
    setMessageWarn("");
    if (e.target.name === "file" && e.target.files[0].size < 100000) {
      setNotificationInfo({ ...notificationInfo, file: e.target.files[0] });
    } else if (e.target.name === "title") {
      setNotificationInfo({ ...notificationInfo, title: e.target.value });
    } else {
      setMessageWarn("Upload pdf file below 100kb");
    }
  }

  function onChangeHandlerA(e) {
    setMessage("");
    setMessageWarn("");
    if (e.target.name === "dept") {
      if (notificationInfo.dept.includes(e.target.value)) {
        const aa = notificationInfo.dept.filter(
          (item) => item !== e.target.value
        );
        setNotificationInfo({
          ...notificationInfo,
          dept: aa,
        });
      } else {
        setNotificationInfo({
          ...notificationInfo,
          dept: [...notificationInfo.dept, e.target.value],
        });
      }
    } else {
      if (notificationInfo.semester.includes(e.target.value)) {
        const aa = notificationInfo.semester.filter(
          (item) => item !== e.target.value
        );

        setNotificationInfo({
          ...notificationInfo,
          semester: aa,
        });
      } else {
        setNotificationInfo({
          ...notificationInfo,
          semester: [...notificationInfo.semester, e.target.value],
        });
      }
    }
  }

  async function operationFun(operation, filename, title) {
    if (operation === "delete") {
      let text = `Deleting ${title}, \n Are you sure? `;
      if (window.confirm(text) === true) {
        const dataOneNotificaton = await deleteOneNotification(filename);

        if (dataOneNotificaton.status === 200) {
          setSuccess("deleted Notice successfully...!");
          setCountForNewNoti(countForNewNoti + 1);
        }
      }
    } else {
      const dataOneNotificaton = await getOneNotification(filename);

      if (dataOneNotificaton.status === 200) {
        setpdfFile(dataOneNotificaton.data.data.data);
        // setCou('download')
      } else {
        setpdfFile("");

        alert("File Not Found,Kindly Contact to Publisher");
      }
    }
  }

  async function addNotificationFun() {
    let allow = false;
    allow =
      notificationInfo.title !== "" &&
      notificationInfo.file !== "" &&
      notificationInfo.semester !== "" &&
      notificationInfo.dept !== "" &&
      notificationInfo.userData !== "";

    if (allow) {
      let formData = new FormData();

      for (var key in notificationInfo) {
        formData.append(key, notificationInfo[key]);
      }

      const isNotificationSave = await saveNotification(formData);

      if (isNotificationSave.status === 200) {
        setMessage("Notice send Successfully");
        setCountForNewNoti(countForNewNoti + 1);
        setNotificationInfo({
          title: "",
          file: "",
          facultyName: "",
          semester: [],
          dept: [],
        });
      }
    } else {
      setMessageWarn("Fill All Field");
    }
  }

  return (
    <>
      <div className="sub-heading">
        <div>Notification</div>
      </div>
      <div>
        <div className="form fl-centre fl-column">
          <br />
          <div>
            {" "}
            <h4>Add New Notification</h4> <br />
          </div>
          <h6 style={{ color: "green" }}>{message}</h6>
          <h6 style={{ color: "red" }}>{messageWarn}</h6>
          <div className="container col-lg-10 fl-column  fl-center">
            <div className="row jumbotron">
              <div className="col-sm-12 form-group">
                <label for="name-l">Add title</label>

                <input
                  onChange={(e) => onChangeHandler(e)}
                  value={notificationInfo.title}
                  name="title"
                  type="text-area"
                  className="form-control"
                  id="name-l"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="col-sm-12 form-group">
                {" "}
                <br />
                <label for="sem">Semester</label>
                <table className="cms-table">
                  <tbody>
                    <tr>
                      {" "}
                      <td>
                        {" "}
                        <input
                          type="checkbox"
                          name="sem"
                          // checked={isSemChecked.first}
                          onChange={(e) => onChangeHandlerA(e)}
                          value="first"
                        />{" "}
                        First <br />
                      </td>{" "}
                      <td>
                        {" "}
                        <input
                          type="checkbox"
                          name="sem"
                          // checked={isSemChecked.second}
                          onChange={(e) => onChangeHandlerA(e)}
                          value="second"
                        />{" "}
                        Second <br />
                      </td>
                      <td>
                        {" "}
                        <input
                          type="checkbox"
                          name="sem"
                          // checked={isSemChecked.third}
                          onChange={(e) => onChangeHandlerA(e)}
                          value="third"
                        />{" "}
                        Third
                        <br />
                      </td>{" "}
                      <td>
                        {" "}
                        <input
                          type="checkbox"
                          name="sem"
                          // checked={isSemChecked.fourth}
                          onChange={(e) => onChangeHandlerA(e)}
                          value="fourth"
                        />{" "}
                        Fourth
                        <br />
                      </td>{" "}
                      <td>
                        {" "}
                        <input
                          type="checkbox"
                          name="sem"
                          // checked={isSemChecked.fifth}
                          onChange={(e) => onChangeHandlerA(e)}
                          value="fifth"
                        />{" "}
                        Fifth
                        <br />
                      </td>{" "}
                      <td>
                        {" "}
                        <input
                          type="checkbox"
                          name="sem"
                          // checked={isSemChecked.sixth}
                          onChange={(e) => onChangeHandlerA(e)}
                          value="sixth"
                        />{" "}
                        Sixth
                        <br />
                      </td>{" "}
                      <td>
                        {" "}
                        <input
                          type="checkbox"
                          name="sem"
                          // checked={isSemChecked.seven}
                          onChange={(e) => onChangeHandlerA(e)}
                          value="seven"
                        />{" "}
                        Seventh
                        <br />
                      </td>{" "}
                      <td>
                        {" "}
                        <input
                          type="checkbox"
                          name="sem"
                          // checked={isSemChecked.eighth}
                          onChange={(e) => onChangeHandlerA(e)}
                          value="eighth"
                        />{" "}
                        Eighth
                        <br />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="col-sm-12 form-group">
                {" "}
                <br />
                <label for="sem">for Department</label>
                <table className="cms-table">
                  <tbody>
                    <tr>
                      {" "}
                      <td>
                        {" "}
                        <input
                          type="checkbox"
                          name="dept"
                          onChange={(e) => onChangeHandlerA(e)}
                          value="ele"
                        />{" "}
                        Electrical Engineering
                      </td>
                    </tr>{" "}
                    <tr>
                      {" "}
                      <td>
                        {" "}
                        <input
                          type="checkbox"
                          name="dept"
                          onChange={(e) => onChangeHandlerA(e)}
                          value="mech"
                        />{" "}
                        Mechanical Engineering
                      </td>
                    </tr>
                    <tr>
                      {" "}
                      <td>
                        {" "}
                        <input
                          type="checkbox"
                          name="dept"
                          onChange={(e) => onChangeHandlerA(e)}
                          value="civil"
                        />{" "}
                        Civil Engineering
                      </td>
                    </tr>{" "}
                    <tr>
                      {" "}
                      <td>
                        {" "}
                        <input
                          type="checkbox"
                          name="dept"
                          onChange={(e) => onChangeHandlerA(e)}
                          value="it"
                        />{" "}
                        Information Technology
                      </td>
                    </tr>{" "}
                    <tr>
                      {" "}
                      <td>
                        {" "}
                        <input
                          type="checkbox"
                          name="dept"
                          onChange={(e) => onChangeHandlerA(e)}
                          value="entc"
                        />{" "}
                        Electronics Engineering
                      </td>
                    </tr>{" "}
                  </tbody>
                </table>
              </div>
              <div className="col-sm-6 form-group">
                <label for="name-l">Upload File</label>

                <input
                  onChange={(e) => onChangeHandler(e)}
                  name="file"
                  type="file"
                  className="form-control"
                  id="name-l"
                  accept="application/pdf"
                  required
                />
              </div>
              <div className="col-sm-12 form-group mb-0">
                <button
                  type="submit"
                  className="btn btn-primary float-right"
                  onClick={(e) => addNotificationFun(e)}
                >
                  Add Notification
                </button>
              </div>
              <br /> <br />
            </div>
          </div>
        </div>

        <div className="container row-cols-5 fl-row "></div>
        <section className="cms-table">
          <div className="cms-table">
            <h3 className="op-success">{success}</h3>
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
                  <th scope="col">Sr. No.</th>
                  <th scope="col">Publisher</th>
                  <th scope="col">Notification Subject</th>
                  <th scope="col">Semester</th>
                  <th scope="col">Department </th>

                  <th scope="col">Download / Delete</th>

                  {/*     <th scope="col">Upload</th> */}
                </tr>
              </thead>
              <tbody>
                {notifications
                  .filter((val) => {
                    if (searchItem === "") {
                      return val;
                    } else if (
                      val.publisher
                        .toLowerCase()
                        .includes(searchItem.toLowerCase())
                    ) {
                      return val;
                    } else if (
                      val.semester.toString().includes(searchItem.toLowerCase())
                    ) {
                      return val;
                    } else if (
                      val.dept
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
                        <tr>
                          <td scope="row">{++index}</td>
                          <td>{item.publisher}</td>

                          <td>{item.title} </td>
                          <td>
                            {item.semester.map((i) => (
                              <>
                                {" "}
                                {i.toUpperCase()}
                                <br />{" "}
                              </>
                            ))}{" "}
                          </td>
                          <td>
                            {item.dept.map((i) =>
                              i !== "it"
                                ? ` - ${takeDepartment(i).split(" ")[0]} - `
                                : "Information Techno."
                            )}{" "}
                          </td>

                          <td>
                            <a
                              href={`data:application/pdf;base64,${toBase64(
                                pdfFile
                              )}`}
                              download
                            >
                              <button
                                onClick={() =>
                                  operationFun("download", item.file)
                                }
                                className="btn btn-warning"
                              >
                                <i class="bi bi-file-earmark-arrow-down-fill"></i>{" "}
                              </button>
                            </a>

                            {userData === item.publisher ? (
                              <button
                                onClick={() =>
                                  operationFun("delete", item.file, item.title)
                                }
                                className="btn btn-danger zoom"
                              >
                                <i class="bi bi-trash-fill "></i>
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  alert(
                                    "You are not Allow to delete, Beacause this notice created by someoneelse "
                                  )
                                }
                                className="btn btn-danger zoom"
                              >
                                <i class="bi bi-file-x-fill"></i>
                              </button>
                            )}
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
      {/*  </div>
          </section>
        </div>
      </div> */}
    </>
  );
}
