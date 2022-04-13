import { useEffect, useState } from "react";
import {
  checkSyllabusUpload,
  getOneSyllabus,
  setSyllabusFile,
  deleteOneSyllabus,
} from "../../Api/facultyApi";
import { check } from "../Validations/Utility";
import Menu from "./menu";
import { Buffer } from "buffer";
import { getOneFaculty } from "../../Api/adminApi";

export default function Subject() {
  const [subjects, setSubjects] = useState([]);
  const [isUpload, setIsUpload] = useState([]);
  const [pdfFile, setpdfFile] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [syllabusFile, setSyllabusFiles] = useState({
    subID: "",
    fileData: "",
  });
  const [countForSylUpload, setCountForSylUpload] = useState(0);
  const [countForNewSyllabus, SetCountForNewSyllabus] = useState(0);

  useEffect(async () => {
    var c = await check("faculty");

    if (c) {
      const userData = await getOneFaculty(
        JSON.parse(localStorage.getItem("userPersonalDetail")).fPRN
      );

      const s = userData.data.allocateSubject;

      if (s) {
        setSubjects(s);

        var subjectsString = "";
        s.map((item, i) => {
          subjectsString =
            i !== 0
              ? subjectsString + "." + item.subID
              : subjectsString + item.subID;
        });

        const isSyllabusUpload = await checkSyllabusUpload(subjectsString);

        if (isSyllabusUpload.status === 200) {
          setIsUpload(isSyllabusUpload.data);
        }
      }
    }
  }, [countForSylUpload, countForNewSyllabus]);

  function toBase64(sdata) {
    return Buffer.from(
      String.fromCharCode.apply(null, new Uint8Array(sdata)),
      "binary"
    ).toString("base64");
  }

  async function operationFun(operation, filename, subname) {
    setMessage(" ");
    setSuccess(" ");
    if (operation === "delete") {
      const dataOneNotificaton = await deleteOneSyllabus(filename);

      if (dataOneNotificaton.status === 200) {
        SetCountForNewSyllabus(countForNewSyllabus + 1);
        setSuccess(`Deleted ${subname} Syllabus Doc `);
      } else {
        setMessage(`Problem while deleting ${subname} Syllabus Doc`);
      }
    } else {
      const dataOneNotificaton = await getOneSyllabus(filename);

      if (dataOneNotificaton.status === 200) {
        setpdfFile(dataOneNotificaton.data.data.data);
      } else {
        setpdfFile("");

        alert("File Not Found,Kindly Contact to Publisher");
      }
    }
  }

  async function onChangeHandler(id, e) {
    setMessage(" ");

    if (e.target.files[0].size < 100000) {
      //check for file, must be below 100kb
      setSyllabusFiles({
        ...syllabusFile,
        fileData: e.target.files[0],
        subID: id,
      });

      let formData = new FormData();

      for (var key in syllabusFile) {
        formData.append(key, syllabusFile[key]);
      }

      if (syllabusFile.fileData) {
        const isFileUpload = await setSyllabusFile(formData);

        if (isFileUpload.status === 200) {
          setCountForSylUpload(countForSylUpload + 1);
          setSuccess("Syllabus Upload Successfully");
          setSyllabusFile({ ...syllabusFile, fileData: null });
        }
      } else {
        setMessage("Try Once Again");
      }
    } else {
      setMessage("File must be Below 100kb");
    }
  }

  return (
    <>
      <div className="sub-heading">
        <div>Subject</div>
      </div>
      <div>
        <div className="container row-cols-5 fl-row"></div>
        <section className="cms-table">
          <div className="cms-table">
            <h3 className="op-error">{message}</h3>
            <h3 className="op-success">{success}</h3>
            <table className="table table-striped">
              <thead className="bg-light">
                <tr>
                  <th scope="col">Sr. No.</th>
                  <th scope="col">Subject ID</th>
                  <th scope="col">Name</th>
                  <th scope="col">Semester</th>
                  <th scope="col">Lectured done</th>
                  <th scope="col">Syllabus Upload Status</th>
                  <th scope="col">Download / Delete</th>

                  <th scope="col">Upload</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((item, index) => {
                  console.log(",,,,,,,,,,,", isUpload);
                  console.log(">>>>>", subjects);
                  return (
                    <>
                      <tr>
                        <td scope="row">{++index}</td>
                        <td>{item.subID}</td>

                        <td>{item.name}</td>

                        <td>{item.sem.toUpperCase()}</td>
                        <td>{item.lec}</td>
                        <td>{isUpload[--index] ? "Uploaded" : "Not Upload"}</td>

                        <td>
                          <a
                            href={`data:application/pdf;base64,${toBase64(
                              pdfFile
                            )}`}
                            download
                          >
                            <button
                              onClick={() =>
                                operationFun("download", item.subID)
                              }
                              className="btn btn-warning"
                            >
                              <i className="bi bi-file-earmark-arrow-down-fill"></i>{" "}
                            </button>
                          </a>

                          <button
                            onClick={() =>
                              operationFun("delete", item.subID, item.name)
                            }
                            className="btn btn-danger zoom"
                          >
                            <i className="bi bi-trash-fill "></i>
                          </button>
                        </td>

                        <td>
                          <label for="file-input">
                            <i
                              class="bi bi-file-earmark-arrow-up-fill zoom "
                              htmlFor="upload"
                            ></i>
                          </label>

                          <input
                            id="file-input"
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => onChangeHandler(item.subID, e)}
                          />
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
