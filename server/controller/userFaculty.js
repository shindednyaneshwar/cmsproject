import StudentInfoModel from "../model/studentInfo.js";
// import StudentInfoModel from "../model/studentInfo.js";
// import studentAcademicInfo from "../model/studentAcademicInfo.js"
import StuAcadetailsModel from "../model/studentAcademicInfo.js";
import DepartwiseSubjectModel from "../model/departwiseSubject.js";
import multer from "multer";
import fs from "fs";

import path from "path";
import FacultyInfoModel from "../model/facultyInfo.js";
import notificationModel from "../model/notification.js";

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./upload/syllabus");
    console.log("LLLLLLL", req.body);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export var uploadFile = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1000, //allowing only upto 100kb
  },
  fileFilter: fileFilter,
}); 

export const postAttendance = async (req, res) => {
  const { attendance, speci } = req.body;
  console.log(">>>>>>>speci", speci);
  console.log(">>>>>attendance>>speci", attendance.length);

  
 
  var isSubAttendancesave = "";
  try {

    if(attendance.length !==0){
      attendance.map(
        async (item, index) => {
          const o = `subjects.${speci.name}.attendance`;
  
          const isAttendanceSave = await StuAcadetailsModel.findOneAndUpdate(
            { sPRN: item },
            { $inc: { [o]: 1 } }
          );
  
          const b = `${speci.sem}.subID`;
          const a = `${speci.sem}.$.lecture`;
          const c = { [a]: 1 };
  
          if (index === 0) {
            isSubAttendancesave = await DepartwiseSubjectModel.findOneAndUpdate(
              { deptname: speci.dept, [b]: speci.subID },
              { $inc: c }
            );
            const o = await FacultyInfoModel.findOneAndUpdate(
              { "allocateSubject.subID": speci.subID },
              { $inc: { "allocateSubject.$.lec": 1 } }
            );
  
            console.log("lll", o);
          }
        },
  
        res.status(200).json(isSubAttendancesave)
      );
    }else{
      const b = `${speci.sem}.subID`;
      const a = `${speci.sem}.$.lecture`;
      const c = { [a]: 1 };
      isSubAttendancesave = await DepartwiseSubjectModel.findOneAndUpdate(
        { deptname: speci.dept, [b]: speci.subID },
        { $inc: c }
      );
      const o = await FacultyInfoModel.findOneAndUpdate(
        { "allocateSubject.subID": speci.subID },
        { $inc: { "allocateSubject.$.lec": 1 } }
      );

    
      
    }


   
  } catch (error) {
    console.log("error >", error.message);
  }
};

export async function getAcademicOfStud(req, res) {
  const data = req.params.data.split("-");
  console.log("getAcademicOfStud in  >>", data);

  try {
    const getData = await StuAcadetailsModel.find({
      studentSem: data[0],
      sPRN: { $regex: `${data[1].toUpperCase()}` },
    });
    console.log("getAcademicOfStud in  >>", getData);
    res.status(200).json(getData);
  } catch (error) {
    console.log("Error in getAcademicOfStud >>", error.message);
  }
}

export async function setAcademicData(req, res) {
  const data = req.body;
  console.log("setAcademicData in  >>", data);

  try {
    data.map(async (item) => {
      const { first, second, exam, attendance, ssub } = item;
      const change = `subjects.${ssub}`;
      const getData = await StuAcadetailsModel.findOneAndUpdate(
        { sPRN: item.sPRN },
        {
          $set: {
            [change]: {
              first: first,
              second: second,
              exam: exam,
              attendance: attendance,
            },
          },
        }
      );
    });

    // console.log("getAcademicOfStud in  >>",getData)
    res.status(200).json({ message: "All marks upload Successfully" });
  } catch (error) {
    console.log("Error in getAcademicOfStud >>", error.message);
  }
}

export async function checkSyllabusUpload(req, res) {
  const data = req.params.data.split(".");
  console.log(">>>>:::::::>", data);

  var statusArray = [];

  try {
    data.map((item, index) => {
      if (fs.existsSync(`./upload/syllabus/${item}.pdf`)) {
        statusArray[index] = true;
      } else {
        console.log(",,,,,,,", item);

        statusArray[index] = false;
      }
    });

    console.log(",,,,,,,", statusArray);
    res.status(200).json(statusArray);
  } catch (err) {
    console.error(err);
  }
}

//GetAll student of semester for Attendance
export const getAllStudentf = async (req, res) => {
  // const [filterStu, setFilterStu] = useState({})
  console.log("student>>");
  const name = req.params;
  // delete name["sname"];
  console.log("name>>>>>", name);
  //   const id={sdept}
  try {
    const students = await StuAcadetailsModel.find({}, { spic: 0 });
    console.log("student>>", students);

    res.status(200).json(students);
  } catch (error) {
    console.log("error->", error);
  }
};

export const setSyllabusFile = async (req, res) => {
  console.log(">>:::asasa::", req.file);
  
  try {
    fs.rename(
      `./upload/syllabus/${req.file.originalname}`,
      `./upload/syllabus/${req.body.subID}.pdf`,
      (error, file) => {
        console.log(error);
      }
    );

    res.status(200).json({ message: "File Upload" });
  } catch (error) {
    console.log("error->", error);
    res.status(203).json(error);
  }
};

export async function saveNotification(req, res) {
  console.log("??firstaaaa", req.body);

  const dept = req.body.dept.split(",");
  const sem = req.body.semester.split(",");

  try {
    const current = new Date();
    const name = current.getTime();

    fs.rename(
      `./upload/syllabus/${req.file.originalname}`,
      `./upload/syllabus/${name}.pdf`,
      (error, file) => {
        console.log("isNotificationSave", error);
      }
    );

    const notificationObject = new notificationModel({
      title: req.body.title,
      file: name,
      publisher: req.body.facultyName,
      semester: sem,
      dept: dept,
    });

    console.log("??first", notificationObject);

    const isNotificationSave = await notificationObject.save();

    res.status(200).json({ message: "Data save Successfully" });
  } catch (err) {
    console.error(err);
    res.status(203).json({
      message: "there is problem while saving notification data in database",
    });
  }
}

export async function getnotifications(req, res) {
  const data = req.params.data.split(",");

  console.log(">>???>>????", data);

  var notificationData;
  try {
    if (data[1]) {
      notificationData = await notificationModel.find({
        semester: data[1],
        dept: data[0],
      });
    } else {
      notificationData = await notificationModel.find();
      console.log(">>???>>???? innnnn");
    }

    console.log(">>???>>???? innnnn", notificationData);

    if (notificationData) {
      res.status(200).json(notificationData);
    } else {
      res.status(203).json({ message: "No Notifications" });
    }
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .json({
        message: "there is problem while saving notification data in database",
      });
  }
}

export async function getOneNotification(req, res) {
  console.log("<<>>>>>>", req.params.data);
  console.log("<<>>>>>>", req.params.data + ".pdf");
let notificationFile;
  try {


    if(fs.existsSync(`./upload/syllabus/${req.params.data}.pdf`)){


       notificationFile = {
        data: fs.readFileSync(
          path.join("./upload/syllabus/" + req.params.data + ".pdf"),
          (error, err) => {
            console.log(",,,,....", error + "" + err);
          }
        ),
        contentType: "application/pdf",
      };
    }else{

       notificationFile = {
        data: fs.readFileSync(
          path.join("./upload/syllabus/Demo.pdf"),
          (error, err) => {
            console.log(",,,,....", error + "" + err);
          }
        ),
        contentType: "application/pdf",
      };

    }
  
console.log(notificationFile)
    
    if (notificationFile) {
      res.status(200).json(notificationFile);
    } else {
      res.status(203).json({ message: "File Not Found" });
    }
  } catch (err) {
    console.error("<<<>>>>>>>>>>>", err);
    res.status(203).json({ message: "File Not Found" });
  }
}

export async function deleteOneNotification(req, res) {
  console.log("<<>>>>>>", req.params.data);

  try {
    const isNotifDelete = await notificationModel.deleteOne({
      file: req.params.data,
    });

    console.log("<<>>>>isNotifDelete>>", isNotifDelete);

    fs.unlink(`./upload/syllabus/${req.params.data}.pdf`, (err) => {
      console.log("error while deleting img of student >", err);
    });

    res.status(200).json(isNotifDelete);
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .json({
        message: "there is problem while saving notification data in database",
      });
  }
}

export async function getNotificationForStudent(req, res) {
  console.log("<<>>>>>>", req.params.data.sem);
  console.log("<<>>>>>>", req.params.data.dept);

  try {
    const isNotifDelete = await notificationModel.deleteOne({
      file: req.params.data,
    });

    console.log("<<>>>>isNotifDelete>>", isNotifDelete);

    fs.unlink(`./upload/syllabus/${req.params.data}.pdf`, (err) => {
      console.log("error while deleting img of student >", err);
    });

    res.status(200).json(isNotifDelete);
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .json({
        message: "there is problem while saving notification data in database",
      });
  }
}










export async function getOneSyllabus(req, res) {
  console.log("<<>>>>>>", req.params.data);

  
const splitData=req.params.data.split(',')//[sub,sem,dep"first.subID":1
console.log("<<>>>>>>", splitData.length);


 let id;
try{
   
  const t= `${splitData[1]}.name`
  const s= `${splitData[1]}.subID`
   id=splitData.length===3? await DepartwiseSubjectModel.findOne({deptname:splitData[2], t:splitData[0]},{[s]:1}):null;
   
 /*  
 //id will return
  {
  _id: new ObjectId("62449a698c3c81f14a7ced3e"),
  first: [ { subID: 'SELE003' } ]
} 
*/





  if(id || splitData.length===1 ){
   

    try {


      const notificationFile =  splitData.length===3?  {
        data: fs.readFileSync(
          path.join("./upload/syllabus/"+id.first[0].subID+".pdf"),
          (error, err) => {
            console.log(",,,,....", error + "" + err);
          }
        ),
        contentType: "application/pdf",
      }:{
        data: fs.readFileSync(
          path.join("./upload/syllabus/"+splitData[0]+".pdf"),
          (error, err) => {
            console.log(",,,,....", error + "" + err);
          }
        ),
        contentType: "application/pdf",
      };
  
   
      if (notificationFile) {
        

        res.status(200).json(notificationFile);
      } else {
        res.status(203).json({ message: "File Not Found 2" });
      }
    } catch (error) {
      console.log(",,,,....", error.message);
   
      res.status(203).json({ message: "File Not Found 3" });
    }
  



  }else{
    res.status(203).json({ message: "File Not Found" });
  }

}catch(error){

  res.status(203).json({ message: "File Not Found" });
}




     
  }


  export async function deleteOneSyllabus(req, res) {
    console.log("<<>>>>>>", req.params.data);
  
    try {
      
  
      
  
     var isSyllabusDelete= fs.unlink(`./upload/syllabus/${req.params.data}.pdf`, (err) => {
        console.log("error while deleting File of syllabus >", err);
      });
  
      res.status(200).json(isSyllabusDelete);
    } catch (err) {
      console.error(err);
      res
        .status(400)
        .json({
          message: "there is problem while saving notification data in database",
        });
    }
  }