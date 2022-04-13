import loginStudentModel from "../model/student.js";
import StudentInfoModel from "../model/studentInfo.js";
import StuAcadetailsModel from "../model/studentAcademicInfo.js";
import DepartwiseSubjectModel from "../model/departwiseSubject.js";
import FacultyInfoModel from "../model/facultyInfo.js";

export const getMyAcademicInfo = async (req, res) => {
  // console.log("getMyAcademicInfo dta",req.params.data)
  try {
    const getData = await StuAcadetailsModel.findOne({ sPRN: req.params.data });
    console.log("this is getDta>", getData);
    res.status(200).json(getData);
  } catch (error) {
    console.log("Error in getMyAcademicInfo >", error.message);
    res.status(400).json({ message: error.message });
  }
};

/* export const getMyLecture = async (req, res) => {
  const data = req.params.data.split(".");

  console.log("getMyLecture>>>>>>", data);
  try {
    let myData = [];
    data.map(async (item, i) => {
      const temp = await FacultyInfoModel.findOne(
        { "allocateSubject.name": item },
        {
          femail: 1,
          fname: 1,
          "allocateSubject.name": 1,
          "allocateSubject.lec": 1,
          _id: 0,
        }
      );

      if (temp) {
        var obj = { sub: "", pro: temp.fname, email: temp.femail };
        await temp.allocateSubject.map((subArr) => {
          var k = subArr.name === item ? (obj.sub = subArr) : "";
        });

        myData.push( obj);
      }

      i ===( data.length - 1) ? res.status(200).json(myData) : "";
    });
  } catch (error) {
    console.log("Error in getMyAcademicInfo >", error.message);
    res.status(400).json({ message: error.message });
  }
};

 */

export const getMyLecture = async (req, res) => {
    const data = req.params.data
  
    console.log("getMyLecture>>>>>>", data);
    try {
     
    
        const temp = await FacultyInfoModel.findOne(
          { "allocateSubject.name": data },
          {
            femail: 1,
            fname: 1,
            "allocateSubject.name": 1,
            "allocateSubject.lec": 1,
            _id: 0,
          }
        );
  
        if (temp) {
          var obj = { sub: "", pro: temp.fname, email: temp.femail };
          await temp.allocateSubject.map((subArr) => {
            var k = subArr.name === data ? (obj.sub = subArr) : "";
          })
        }
      

      res.status(200).json(obj)
    } catch (error) {
      console.log("Error in getMyAcademicInfo >", error.message);
      res.status(400).json({ message: error.message });
    }
  };
  

  