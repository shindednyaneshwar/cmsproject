import express from "express";
const router = express.Router();




import { verifyAuth } from "../Middleware/login.js";
import { otpSentVarification } from "../Middleware/otpSentVarification.js";
import { verify } from "../Middleware/userVerification.js";
import { verifyOtp } from "../Middleware/verifyOtp.js";
import { changePassword } from "../Middleware/changePassword.js";




import {
  postAttendance,
  setSyllabusFile,
  getAcademicOfStud,
  setAcademicData,
  getAllStudentf,
  checkSyllabusUpload,
  uploadFile,
  saveNotification,
  getnotifications,getOneNotification,deleteOneNotification,getOneSyllabus,deleteOneSyllabus
} from "../controller/userFaculty.js";







// router.post("/addAdmin", addAdmin);
// router.get("/getUser", getUser);
router.post("/login", verifyAuth);
// router.post("/check", verify);

router.post("/addAdminDetails", verify,uploadImg.single("apic"), addAdminDetails);
router.get("/getOneAdmin/:id", verify, getOneAdmin);

router.post("/addStudentDetails", verify,uploadImg.single("spic"), addStudentDetails);
router.get("/getAllStudent", verify, getAllStudent);
router.put("/updateStudent", verify,uploadImg.single("spic"), updateStudent);
router.get("/getOneStudent/:id", verify, getOneStudent);
router.delete("/deleteOneStudent/:id", verify, deleteOneStudent);

router.post("/addFacultyDetails", verify,uploadImg.single("fpic"), addFacultyDetails);
router.get("/getAllFaculty", verify, getAllFaculty);
router.put("/updateFaculty", verify,uploadImg.single("spic"), updateFaculty);
router.get("/getOneFaculty/:id", verify, getOneFaculty);
router.delete("/deleteOneFaculty/:id", verify, deleteOneFaculty);
router.post("/allocateSubToFaculty", verify, allocateSubToFaculty);

router.get("/getAllSubject", verify, getAllSubject);
router.post("/addSubject", verify, addSubject);
router.delete("/deleteSubject/:data", verify, deleteSubject);
router.put("/updateSubject", verify, updateSubject);
router.post("/addDepart", verify, addDepart);


/* 
===========================================================================================================================


Faculty Routes


==============================================================================================================================
*/

router.get("/checkSyllabusUpload/:data", verify, checkSyllabusUpload);

router.get("/getAcademicOfStud/:data", verify, getAcademicOfStud);
router.get("/getAllStudentf/:data", verify, getAllStudentf);
router.post("/setAcademicData", verify, setAcademicData);
router.post(
  "/setSyllabusFile",
  verify,
  uploadFile.single("fileData"),
  setSyllabusFile
);

router.post("/postAttendance", verify, postAttendance);
router.post("/saveNotification", verify,uploadFile.single("file"), saveNotification);
router.get("/getnotifications/:data", verify, getnotifications);
router.get("/getOneNotification/:data",verify, getOneNotification);
router.get("/getOneSyllabus/:data",verify, getOneSyllabus);
router.delete("/deleteOneNotification/:data",verify, deleteOneNotification);
router.delete("/deleteOneSyllabus/:data", deleteOneSyllabus);



/* 
===========================================================================================================================


Student Routes


==============================================================================================================================
*/

router.get('/getMyAcademicInfo/:data',verify,getMyAcademicInfo)
router.get('/getMyLecture/:data',verify,getMyLecture)












router.post('/otpSentVarification',otpSentVarification)
router.post('/verifyOtp',verifyOtp)
router.post('/changePassword',changePassword)









export default router;
