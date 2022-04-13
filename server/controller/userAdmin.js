// import { DepartwiseSubjectModel } from "../model/departwiseSubject.js";
import subjectModel from "../model/subjectInfo.js";
// var multer  = require('multer');
import multer from "multer";
import bcrypt from "bcryptjs";
import jwt from "jwt-decode";
// import UploadPicModel from "../model/uploadPic.js";
import fs from "fs";
import path from "path";
import StudentInfoModel from "../model/studentInfo.js";
import PrnGeneratorModel from "../model/prnGenerator.js";

import StuAcadetailsModel from "../model/studentAcademicInfo.js";
import DepartwiseSubjectModel from "../model/departwiseSubject.js";
import FacultyInfoModel from "../model/facultyInfo.js";
import authDataModel from "../model/authenticationData.js";
import AdminInfoModel from "../model/admin.js";

const getPrnSequence = async (data) => {
  const temp = { faculty: 1, student: 1, subject: 1, admin: 1 };

  try {
    const departObject = new PrnGeneratorModel(temp);

    const mat = await PrnGeneratorModel.find();

    return mat;
  } catch (error) {
    console.log("error===>", error.message);
  }
};

export const addDepart = async (req, res) => {
  const deprtname = req.body;

  try {
    const departObject = new DepartwiseSubjectModel(deprtname);

    const mat = await departObject.save();

    res.status(200).json(deprtname);
  } catch (error) {
    res.status(203).json({ messge: error.message });
  }
};

//get all counts of faculty, student , active user, subject
export const getCountOfALL = async (req, res) => {
  try {
    const facultyCount = await FacultyInfoModel.count();
    const adminCount = await AdminInfoModel.count();

    const studentCount = await StudentInfoModel.count();
    const users = await authDataModel.count({ lastLogin: { $ne: null } });

    const counterData = { facultyCount, studentCount, users, adminCount };
    res.status(200).json(counterData);
  } catch (error) {
    console.log("error===>", error.message);
    res.status(203).json({ message: error.message });
  }
};

//to set Neww Pass
export const setNewPass = async (req, res) => {
  try {
    
    const crypted = await bcrypt.hash(req.body.password, 4);

    const isNewPassSave = await authDataModel.updateOne(
      { username: req.body.username },
      { password: crypted }
    );
  

    return res.status(200).json(isNewPassSave);
  } catch (error) {
   
    res.status(203).json({ message: error.message });
  }
};

export const addAdminDetails = async (request, response) => {
  const admin = request.body;

  var prn = await getPrnSequence();

  var number =
    prn[0].admin > 10
      ? prn[0].admin > 100
        ? prn[0].admin > 1000
          ? `0${prn[0].admin}`
          : `00${prn[0].admin}`
        : `000${prn[0].admin}`
      : `0000${prn[0].admin}`;
  prn = `ADMIN${number}`;
  // console.log("Genetaedd PRN",prn)

  fs.rename(
    `./upload/img/${request.file.filename}`,
    `./upload/img/${prn}.jpg`,
    (err) => {
      console.log("Errrorr>>>>>>", err);
    }
  );

  const adminObj = {
    aPRN: prn,
    aname: admin.aname,
    aemail: admin.aemail,
    adept: admin.adept,
    aaddress: admin.aaddress,
    astate: admin.astate,
    apin: admin.apin,
    adob: admin.adob,
    agender: admin.agender,

    isFacultyAllow: false,
    isStudentAllow: false,
    amob: admin.amob,
  };

  const newUser = new AdminInfoModel(adminObj);

  // console.log("newUser------>", newUser);

  try {
    // finding something inside a model is time taking, so we need to add await
    const isUserSave = await newUser.save();
    console.log("?>>>isUserSave", isUserSave);
    console.log("?>>>asa", isUserSave);

    const isAuthDataSave = await saveAuthData({
      user: "admin",
      username: admin.aemail,
      prn: prn,
      password: admin.apass,
    });

    // console.log("isAuthDataSave>>>>>>>>>>>>>>>>>>", isAuthDataSave);

    const incrementId = await PrnGeneratorModel.findOneAndUpdate(
      { name: "prnGenerator" },
      { $inc: { admin: 1 } }
    );

    console.log("incrementId>>>>>>>>>>>>>>>>>>", incrementId);
    // console.log(   "?>>>newUsernew>student"  );
    // console.log(isUserSave);
    response.status(200).json(isUserSave);
  } catch (error) {
    response.status(2003).json({ message: error.message });
  }
};


//this will check weather any faculty allow to student or faculty fill the form from login dashboard
export const isFormAllow = async (request, response) => {
  try {
    let isFacultyFormAllow;
    let isStudentFormAllow;
    if (request.params.data !== "fromLogin") {
      isFacultyFormAllow = await AdminInfoModel.findOne({
        aPRN: request.params.data,
        isFacultyAllow: true,
      });
      isStudentFormAllow = await AdminInfoModel.findOne({
        aPRN: request.params.data,
        isStudentAllow: true,
      });
    } else {
      isFacultyFormAllow = await AdminInfoModel.findOne({
        isFacultyAllow: true,
      });
      isStudentFormAllow = await AdminInfoModel.findOne({
        isStudentAllow: true,
      });
    }

    let data = { faculty: false, student: false };

    if (isFacultyFormAllow) {
      data = { ...data, faculty: true };
    }
    if (isStudentFormAllow) {
      data = { ...data, student: true };
    }

    response.status(200).json(data);
  } catch (error) {
    response.status(203).json({ message: error.message });
  }
};

export const facultyFormSet = async (request, response) => {
  const admin = request.body;
  console.log("llll", admin);
  try {
    const isDataSave = await AdminInfoModel.findOneAndUpdate(
      { aPRN: request.body.aPRN },
      {
        isFacultyAllow: request.body.faculty,
        isStudentAllow: request.body.student,
      }
    );
    console.log(";;;;///", isDataSave);
    response.status(200).json(isDataSave);
  } catch (error) {
    response.status(203).json({ message: error.message });
  }
};
export const getOneAdmin = async (req, res) => {
  const id = { aPRN: `${req.params.id}` };
  console.log(">>iddddddddd", id);

  try {
    const oneAdmin = await AdminInfoModel.findOne(id);
    console.log("oneADMIN>>>", oneAdmin);
    let object;
    if (oneAdmin) {
      if (fs.existsSync("./upload/img/" + oneAdmin.aPRN + ".jpg")) {
        const imgobj = {
          data: fs.readFileSync(
            path.join("./upload/img/" + oneAdmin.aPRN + ".jpg")
          ),
          contentType: "image/jpg",
        };
        object = { ...oneAdmin._doc, apic: imgobj };
        console.log(">>IMGG", imgobj);
      } else {
        const imgobj = {
          data: fs.readFileSync(path.join("./upload/img/ideal.jpg")),
          contentType: "image/jpg",
        };
        object = { ...oneAdmin._doc, apic: imgobj };
        console.log(">>IMGG", imgobj);
      }
    }

    res.status(200).json(object);
  } catch (error) {
    console.log("error___>>", error.message);
    res.status(203).json(oneAdmin);
  }
};

/* 
==========================================================================================================

//                Upload Image

================================================================================================================
 */

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./upload/img");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export var uploadImg = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 50, //allowing only upto 50kb
  },
  fileFilter: fileFilter,
});

// ====================================================================================================================================================

//-----------------------------------Foruploading single file below program can use---------------------------------------

const saveAuthData = async (data) => {
  console.log("secreteData secreteData", data);

  const crypted = await bcrypt.hash(data.password, 4);
  console.log("Hashed password", crypted);

  // const decrptd = await bcrypt.compare("myPAssword", crypted);
  //console.log("Hashed password",decrptd);
  console.log("secreteData secreteData");

  //make object of data
  const secreteData = {
    username: data.username,
    PRN: data.prn,
    password: crypted,
    status: data.user,
    lastLogin: null,
  };
  console.log("secreteData secreteData", secreteData);
  var isDataSave = "";
  try {
    const tempData = new authDataModel(secreteData);
    isDataSave = tempData.save();
  } catch (error) {
    console.log("error from saveAuthData >>", error.message);
  }
  return isDataSave;
};

// ====================================================================================================================================================

/*>>>>>>>>>>>>>>>>>>>>>>                     Add details student    >>>>>>>>>>>>>>>>>>> */

export const addStudentDetails = async (request, response, next) => {
  const student = request.body;

  console.log(">>>>>>>student", student);

  // response.status(200).json(photo);
  //   console.log('./uploads/' + req.file.filename)
  // console.log('./uploads/' + req.file.filename)

  var prn = await getPrnSequence();
  // var prn=[{faculty:11}]
  // console.log("pernnnn>>>>>>>>",prn[0].student)
  var dept = student.sdept.toUpperCase();
  var number =
    prn[0].student > 10
      ? prn[0].student > 100
        ? prn[0].student > 1000
          ? `0${prn[0].student}`
          : `00${prn[0].student}`
        : `000${prn[0].student}`
      : `0000${prn[0].student}`;
  prn = `ST${dept}${number}`;
  // console.log("Genetaedd PRN",prn)

  fs.rename(
    `./upload/img/${request.file.filename}`,
    `./upload/img/${prn}.jpg`,
    (err) => {
      //  console.log("Errrorr>>>>>>",err)
    }
  );

  // console.log("studeObj  prnnnnn>>>>>>",prn)

  const studeObj = {
    sPRN: prn,
    sname: student.sname,
    semail: student.semail,
    sdept: student.sdept,
    saddress: student.saddress,
    sstate: student.sstate,
    spin: student.spin,
    sdob: student.sdob,
    sgender: student.sgender,
    ssemester: student.ssemester,

    smob: student.smob,
  };

  // console.log(
  //   "?>>>studeObj>>>>>>student"
  // );
  // console.log(studeObj);

  const status = await addStudentAcademicDetails(studeObj);

  // console.log("?>>>addStudentAcademicDetails", status );

  const newUser = new StudentInfoModel(studeObj);

  console.log("newUser------>", newUser);

  try {
    // finding something inside a model is time taking, so we need to add await
    const isUserSave = await newUser.save();
    console.log("?>>>isUserSave", isUserSave);
    console.log("?>>>asa", isUserSave);

    const isAuthDataSave = await saveAuthData({
      user: "student",
      username: student.semail,
      prn: prn,
      password: student.spass,
    });

    console.log("isAuthDataSave>>>>>>>>>>>>>>>>>>", isAuthDataSave);

    const incrementId = await PrnGeneratorModel.findOneAndUpdate(
      { name: "prnGenerator" },
      { $inc: { student: 1 } }
    );

    console.log("incrementId>>>>>>>>>>>>>>>>>>", incrementId);
    // console.log(   "?>>>newUsernew>student"  );
    // console.log(isUserSave);
    response.status(200).json(isUserSave);
  } catch (error) {
    response.status(404).json({ message: error.message });
  }
};

export const addStudentAcademicDetails = async (student) => {
  // console.log(
  //   "Student in addStudentAcademicDetails>>>>>>>>>>>>>>>>   ",
  //   student
  // );
  const stuObject = await createObject(student);
  console.log("Student in createObject>>>>>>>>>>>>>>>>   ", stuObject);

  const newUser = new StuAcadetailsModel(stuObject);

  try {
    // finding something inside a model is time taking, so we need to add await
    const isStuAcadetailsave = await newUser.save();
    console.log("isStuAcadetailsModel>>>>>>>>>>>>>>>   ", isStuAcadetailsave);

    return isStuAcadetailsave;
  } catch (error) {
    console.log("isStuAcadetailsModel>>>>>", error);
  }
};

const createObject = async (student) => {
  // console.log("Student in createObject>>>>>>>>>>>>>>>>   ", student);

  var alldta = [];
  const stuSem = student.ssemester;
  const dept = student.sdept;

  // console.log("dept", dept);

  // console.log("Stdent sem", stuSem);

  try {
    // alldta = await DepartwiseSubjectModel.find();

    alldta = await DepartwiseSubjectModel.find(
      { deptname: dept },
      { [stuSem]: 1, _id: 0 }
    );
  } catch (error) {
    console.log("error--->", error.message);
  }

  // console.log("alldta<>>///////////////////>>>>>>>>>>>>>>>>>>>>", alldta);

  // console.log(alldta[0]);
  const sub = alldta[0]; //{  second: [ { name: 'bhi', lecture: 0 }, { name: 'bhai', lecture: 0 } ]  }

  // console.log("sub<>>///////////////////>>>>>>>>>>>>>>>>>>>>", sub);

  const subArray = sub[stuSem]; //subarray=[ { name: 'Math', lecture: 0 }, { name: 'English', lecture: 0 } ]
  // const subArray = Object.values(sub)
  // console.log("aaa", subArray);

  const subComArray = {};
  subArray.map(
    (item, index) =>
      (subComArray[item.name] = {
        first: 0,
        second: 0,
        exam: 0,
        attendance: 0,
      })
  );

  const StuObj = {
    sPRN: `${student.sPRN}`,
    studentName: `${student.sname}`,
    studentSem: `${student.ssemester}`,
    subjects: subComArray,
  };

  // console.log("aaa>>>>>", StuObj);

  return StuObj;
};

export const updateStudent = async (req, res, next) => {
  const data = req.body;
  // console.log(">>>>>>>>>>>data from updateStudent", data);
  // console.log(data);

  // console.log(">>>>>>>>>>>data freq.file", req.file);

  const imgobj = req.file
    ? {
        data: fs.readFileSync(path.join("./upload/img/" + req.file.filename)),
        contentType: "image/png",
      }
    : req.body.spic;

  const updatedObj = {
    saddress: data.saddress,
    sstate: data.sstate,
    spin: data.spin,
    sdob: data.sdob,
    sgender: data.sgender,
    smob: data.smob,
    // spic: imgobj,
    // address:data.saddress,
    // state:data.sstate,
    // pin:data.spin,
    // dob:data.sdob,
    // gender:data.sgender,
    // mob:data.smob,
  };

  // console.log("updatedObj>>>>", updatedObj)

  try {
    // const subObject = { name: subject.subname, lecture: 0, id: subject.subid };

    // const subjectData = { [subject.semester]: subObject };

    const id = { _id: req.body._id };

    const change = { $set: updatedObj };
    //want to add basic ele in "first" Array
    //  const s=new DepartwiseSubjectModel();
    const resDbs = await StudentInfoModel.findOneAndUpdate(id, change);
    console.log("in appendSubject  serverside try");
    // console.log("in appendSubject Responce from server------------<>>>", resDbs);

    res.status(200).json(resDbs);
  } catch (error) {
    console.log("error--->", error.message);
  }
};

//GetAll student of semester for Attendance
export const getAllStudent = async (req, res) => {
  console.log("headers->", req.headers.autherization);

  try {
    const students = await StudentInfoModel.find({}, { spic: 0 });
    console.log("student>>", students);

    res.status(200).json(students);
  } catch (error) {
    console.log("error->", error);
    res.status(203).json({ message: "something Problem " });
  }
};

export const getOneStudent = async (req, res) => {
  const id = { sPRN: `${req.params.id}` };

  console.log("===============>req.paramsoo", id);

  try {
    const oneStudent = await StudentInfoModel.findOne(id);
    console.log("in getOneStudent  serverside try");
    console.log("in getPic Responce from server------------<>>>", oneStudent);
    let object;
    if (oneStudent) {
      if (fs.existsSync("./upload/img/" + oneStudent.sPRN + ".jpg")) {
        const imgobj = {
          data: fs.readFileSync(
            path.join("./upload/img/" + oneStudent.sPRN + ".jpg")
          ),
          contentType: "image/jpg",
        };
        object = { ...oneStudent._doc, spic: imgobj };
        console.log(">>IMGG", imgobj);
      } else {
        const imgobj = {
          data: fs.readFileSync(path.join("./upload/img/ideal.jpg")),
          contentType: "image/jpg",
        };
        object = { ...oneStudent._doc, spic: imgobj };
        console.log(">>IMGG", imgobj);
      }
    }

    console.log("this is>>>>>", object);

    res.status(200).json(object);
  } catch (error) {
    console.log("error___>>", error.message);
  }
};

export const deleteOneStudent = async (req, res) => {
  const id = { sPRN: `${req.params.id}` };
  const ida = { PRN: `${req.params.id}` };

  console.log("===============>req.paramsdd", req.params.id);

  try {
    const isStuDelete = await StudentInfoModel.deleteOne(id);
    const isAcademicDelete = await StuAcadetailsModel.deleteOne(id);
    const isAuthFacultyDelete = await authDataModel.deleteOne(ida);
    fs.unlink(`./upload/img/${req.params.id}.jpg`, (err) => {
      console.log("error while deleting img of student >", err);
    });

    console.log("deleteOneStudent");
    console.log("in getPic Responce from server------------<>>>", isStuDelete);

    res.status(200).json(isStuDelete);
  } catch (error) {
    console.log("error___>>", error.message);
  }
};

/* /////////////////////////////////////////////////////////////////////////////////////////////////////////////


................................Add Faculty .......................................................................


 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

export const addFacultyDetails = async (request, response, next) => {
  const faculty = request.body;
  //   const photo = request;
  // console.log(photo)

  // response.status(200).json(photo);
  console.log("data--->>", faculty);

  /* 
  
  //Below code is use to get image from ./upload folder
  const imgobj = {
    data: fs.readFileSync(path.join("./upload/" + request.file.filename)),
    contentType: "image/png",
  };
  
  */

  var prn = await getPrnSequence();
  // var prn=[{faculty:11}]
  console.log("pernnnn>>>>>>>>", prn[0].faculty);
  var dept = faculty.fdept.toUpperCase();
  var number =
    prn[0].faculty > 10
      ? prn[0].faculty > 100
        ? prn[0].faculty > 1000
          ? `0${prn[0].faculty}`
          : `00${prn[0].faculty}`
        : `000${prn[0].faculty}`
      : `0000${prn[0].faculty}`;
  prn = `F${dept}${number}`;
  console.log("Genetaedd PRN", prn);

  fs.rename(
    `./upload/img/${request.file.filename}`,
    `./upload/img/${prn}.jpg`,
    (err) => {
      console.log("Errrorr>>>>>>", err);
    }
  );

  const facultyObj = {
    fPRN: prn,
    fname: faculty.fname,
    femail: faculty.femail,
    faddress: faculty.faddress,
    fpin: faculty.fpin,
    fstate: faculty.fstate,
    fdob: faculty.fdob,
    fmob: faculty.fmob,
    fedu: faculty.fedu,
    fgender: faculty.fgender,
    fdept: faculty.fdept,

    fpic: "",
  };

  console.log(facultyObj);

  // const forAcaemic=studeObj;
  // delete forAcaemic["img"]
  console.log(
    "?>>>facultyObj>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>student"
  );
  // console.log(facultyObj);

  const newUser = new FacultyInfoModel(facultyObj);
  // console.log(
  //   "newUser>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
  // );

  // console.log(newUser)

  try {
    // finding something inside a model is time taking, so we need to add await
    const users = await newUser.save();
    const isAuthDataSave = await saveAuthData({
      username: faculty.femail,
      user: "faculty",
      prn: prn,
      password: faculty.fpass,
    });
    if (users) {
      const incrementId = await PrnGeneratorModel.findOneAndUpdate(
        { name: "prnGenerator" },
        { $inc: { faculty: 1 } }
      );
    }
    response.status(200).json(users);
  } catch (error) {
    response.status(404).json({ message: error.message });
  }
};

//GetAll student of semester for Attendance
export const getAllFaculty = async (req, res) => {
  try {
    const faculties = await FacultyInfoModel.find({}, { fpic: 0 });
    // console.log(" returning all faculties>>>>>>>>",faculties)

    res.status(200).json(faculties);
  } catch (error) {
    console.log("error->", error);
  }
};

export const getOneFaculty = async (req, res) => {
  const header = jwt(req.headers.autherization);

  console.log("error___>>", header.user);

  if (header.user === "faculty" || header.user === "admin") {
    const id = { fPRN: `${req.params.id}` };

    console.log("error innnn>>", header.user);
    let object;
    try {
      const oneFaculty = await FacultyInfoModel.findOne(id);
      console.log("error innnn>>", oneFaculty);

      if (oneFaculty) {
        if (fs.existsSync("./upload/img/" + oneFaculty.fPRN + ".jpg")) {
          const imgobj = {
            data: fs.readFileSync(
              path.join("./upload/img/" + oneFaculty.fPRN + ".jpg")
            ),
            contentType: "image/jpg",
          };
          object = { ...oneFaculty._doc, fpic: imgobj };
          console.log(">>1IMGG", imgobj);
        } else {
          console.log(">>IsasMGG");

          const imgobj = {
            data: fs.readFileSync(path.join("./upload/img/ideal.jpg")),
            contentType: "image/jpg",
          };
          object = { ...oneFaculty._doc, fpic: imgobj };
          console.log(">>fsdsdas");
        }
      } else {
        return res.status(203).json({ message: "user Not Found" });
      }
      console.log(">>IMsasGG", object);

      return res.status(200).json(object);
    } catch (error) {
      console.log("error___>>", error.message);
      return res.status(203).json({});
    }
  }

  res.status(404).json({});
};

export const allocateSubToFaculty = async (req, res) => {
  const data = req.body;
  console.log(">>>>>>>>>>>>>>>>", data);
  var resDbs = "";
  try {
    data.subjects.map(async (item) => {
      const id = { fPRN: data.fPRN };
      const change = { $push: { allocateSubject: item } };
      const resDbs = await FacultyInfoModel.findOneAndUpdate(id, change, {
        fpic: 0,
      });

      //  console.log("resDbs>>???>>>>",resDbs);
    });
    const isUpdate = await updateSubject(data);

    // // console.log("in getPic Responce from server------------<>>>", resDbs);

    res.status(200).json(resDbs);
  } catch (error) {
    console.log("error___>>", error.message);
  }
};

export const deleteOneFaculty = async (req, res) => {
  const id = { fPRN: `${req.params.id}` };
  const ida = { PRN: `${req.params.id}` };

  console.log("===============>req.paramsdd", req.params.id);

  try {
    const isFacultyDelete = await FacultyInfoModel.deleteOne(id);
    const isAuthFacultyDelete = await authDataModel.deleteOne(ida);
    fs.unlink(`./upload/img/${req.params.id}.jpg`, (err) => {
      console.log("error while deleting img of student >", err);
    });

    console.log("deleteOneFaculty");
    console.log(
      "in getPic Responce from server------------<>>>",
      isFacultyDelete
    );

    res.status(200).json(isFacultyDelete);
  } catch (error) {
    console.log("deleteOneFaculty >Error >>", error.message);
  }
};

export const updateFaculty = async (req, res, next) => {
  const data = req.body;
  console.log(">>>>>>>>>>>data from updateFaculty", data);
  console.log(data);

  console.log(">>>>>>>>>>>data freq.file", req.file);

  const imgobj = req.file
    ? {
        data: fs.readFileSync(path.join("./upload/img" + req.file.filename)),
        contentType: "image/png",
      }
    : req.body.spic;

  const updatedObj = {
    faddress: data.faddress,
    fstate: data.fstate,
    fpin: data.fpin,
    fdob: data.fdob,
    fgender: data.fgender,
    fmob: data.fmob,

    fedu: data.fedu,
  };

  // console.log("updatedObj>>>>", updatedObj)

  try {
    // const subObject = { name: subject.subname, lecture: 0, id: subject.subid };

    // const subjectData = { [subject.semester]: subObject };

    const id = { fPRN: req.body.fPRN };

    const change = { $set: updatedObj };
    //want to add basic ele in "first" Array
    //  const s=new DepartwiseSubjectModel();
    const resDbs = await FacultyInfoModel.findOneAndUpdate(id, change);
    console.log("in appendSubject  serverside try");
    // console.log("in appendSubject Responce from server------------<>>>", resDbs);

    res.status(200).json(resDbs);
  } catch (error) {
    console.log("error--->", error.message);
  }
};

export const addSubject = async (req, res) => {
  console.log("in appendSubject  serverside");

  const subject = req.body;
  //subid:'',subname:'',year:'',semester:''.....>parameter from client

  var prn = await getPrnSequence();
  // var prn=[{faculty:11}]
  console.log("pernnnn>>>>>>>>", prn[0].faculty);
  var dept = subject.sdept.toUpperCase();
  var number =
    prn[0].subject > 10
      ? prn[0].subject > 100
        ? prn[0].subject > 1000
          ? `0${prn[0].subject}`
          : `00${prn[0].subject}`
        : `000${prn[0].subject}`
      : `0000${prn[0].subject}`;
  prn = `S${dept}${number}`;
  console.log("Genetaedd PRN", prn);

  const subObject = {
    subID: prn,
    name: subject.sname,
    lecture: 0,
    isAllocate: false,
  };

  const subjectData = { [subject.ssemester]: subObject };
  console.log("subjectData====>", subjectData); //{first: 'basic ele' }

  console.log(subjectData); //{first: 'basic ele' }
  try {
    const id = { deptname: subject.sdept };

    const change = { $push: subjectData }; //want to add basic ele in "first" Array
    //  const s=new DepartwiseSubjectModel();
    const isUpdate = await DepartwiseSubjectModel.findOneAndUpdate(id, change);
    var incrementId = "";
    if (isUpdate) {
      incrementId = await PrnGeneratorModel.findOneAndUpdate(
        { name: "prnGenerator" },
        { $inc: { subject: 1 } }
      );
    }
    console.log("in appendSubject  serverside try");

    res.status(200).json(incrementId);
  } catch (error) {
    console.log("error===>", error.message);
  }
};

export const getAllSubject = async (req, res) => {
  console.log("subject>>", res.locals.mydata);

  const name = req.body;

  try {
    const subjects = await DepartwiseSubjectModel.find();
    console.log("subjects>>", subjects);

    res.status(200).json(subjects);
  } catch (error) {
    console.log("error->", error);
  }
};

export const updateSubject = async (data) => {
  console.log("updateSubject>>");

  console.log("data>>;;;;", data);

  // const id = {deptname:data[2] };
  const temp = data[1];

  data.subjects.map(async (item) => {
    const b = `${item.sem}.subID`;
    const a = `${item.sem}.$.isAllocate`;
    const c = { [a]: true };
    try {
      const students = await DepartwiseSubjectModel.findOneAndUpdate(
        { deptname: item.dept, [b]: item.subID },
        { $set: c }
      );
      console.log("student>>", students);
    } catch (error) {
      console.log("error->", error);
    }
  });
};

export const deleteSubject = async (req, res) => {
  const subData = req.params;

  var data = subData.data.split(".");

  try {
    const id = { deptname: data[2] };
    const temp = data[1];
    const change = { $pull: { [temp]: { name: data[0] } } };
    // const change = { $set:  };
    //want to add basic ele in "first" Array
    //  const s=new DepartwiseSubjectModel();

    const resDbs = await DepartwiseSubjectModel.updateOne(id, change);

    res.status(200).json(resDbs);
  } catch (error) {
    console.log("error___>>", error.message);
    res.status(203).json({ message: "Problem while deleting Subject" });
  }
};
