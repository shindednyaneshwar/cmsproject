import "../../Assets/Css/menu.css";

import "../../Assets/Css/SDashboard.css";

import { Buffer } from "buffer";

import { useEffect, useState } from "react";
import { getOneNotification } from "../../Api/facultyApi";
export default function SMenu(props) {
  const [notificationData, setNotificationData] = useState([
    { file: "", title: " ", publisher: "No Notice " },
  ]);

  const [pdfFile, setpdfFile] = useState("");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("notiFicationData"));
    if (data) {
      setNotificationData(data);
    }
  }, []);

  function toBase64(sdata) {
    return Buffer.from(
      String.fromCharCode.apply(null, new Uint8Array(sdata)),
      "binary"
    ).toString("base64");
  }
  async function onChangeHandler(id) {
    const dataOneNotificaton = await getOneNotification(id);

    if (dataOneNotificaton.status === 200) {
      setpdfFile(dataOneNotificaton.data.data.data);

    } else {
      setpdfFile("");
   
      alert("File Not Found,Kindly Contact to Publisher");
    }
  }

  return (
    <>
      <div className="stu-nav-side-menu  ">
        <br /> <br />
        <div className="fl-center">
          <h4 className="text-shadow">Notification's</h4>
        </div>
        <div className="menu-notification  my-notify-scroll box-shadow">
          {notificationData.map((item) => {
            return (
              <>
                <div className="notif  ">
                  <a
                    onClick={() => onChangeHandler(item.file)}
                    href={`data:application/pdf;base64,${toBase64(pdfFile)}`}
                    download="Notification"
                  >
                    <i className="bi bi-file-earmark-arrow-down-fill"></i>
                  </a>
                  <p>{item.title}</p>
                  <div>From : {item.publisher}</div>{" "}
                </div>
              </>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ==================================================
