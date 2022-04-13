
import loginStudentModel from "../model/student.js"
import StudentInfoModel from "../model/studentInfo.js"
import StuAcadetailsModel from "../model/studentAcademicInfo.js"
import DepartwiseSubjectModel from "../model/departwiseSubject.js";



export const addUser = async (request, response) => {


    const user = request.body;
    const newUser = new loginStudentModel(user);
    // Step -1 // Test API
    // response.send(newUser);

    try {
        // finding something inside a model is time taking, so we need to add await
        const users = await newUser.save();
        response.status(200).json(users);
    } catch (error) {
        response.status(404).json({ message: error.message })
    }
}

export const getUser = async (request, response) => {

    // Step -1 // Test API
    // response.send(newUser);
    // console.log('in getUser function');
    try {
        // finding something inside a model is time taking, so we need to add await
        const users = await loginStudentModel.find();
        response.status(200).json(users);
    } catch (error) {
        response.status(404).json({ message: error.message })
    }
}




export const addStudentDetails = async (request, response) => {

    
const student = request.body;
   
const status=addStudentAcademicDetails(student);

    const newUser = new StudentInfoModel(student);
    // console.log(newUser)


    try {
        // finding something inside a model is time taking, so we need to add await
        const users = await newUser.save();
        // console.log("addStudentAcademicDetails intry  serverside")

        response.status(200).json(users);
    } catch (error) {
        response.status(404).json({ message: error.message })
    }
}




//make object of StudentAcademic Details so that every student Academic details will store there
// prn :String,
// sname:String,
//subjects:[{math:{first:"",second:"",exam:"",attendance:""}}]

export const addStudentAcademicDetails = async (student) => {

    const stuObject=await createObject(student)
    const newUser = new StuAcadetailsModel(stuObject);

     try {
        // finding something inside a model is time taking, so we need to add await
        const users = await newUser.save();


        // response.status(200).json(users);
    } catch (error) {
        // response.status(404).json({ message: error.message })
    }
}


const createObject=async(student)=>{

    var alldta=[];
    const vv=student.ssemester;
    
try{    
    alldta = await DepartwiseSubjectModel.find({deptname:"newEle"},{[vv]:1,_id:0});
    // console.log(alldta[0].first)//give total subject of perticulr semestr
}catch(error){
    console.log("error--->",error.message)
}

const sub =alldta[0]._doc;
const subArray=Object.values(sub)[0]
//  console.log(Object.values(sub)[0])

const subComArray={}
subArray.map((item, index) => 
subComArray[item] = { first: null, second: null, exam: null, attendance: null } 
    )
  
  const StuObj={prn:`${student.prn}`,studentName:`${student.sname}`,subjects:subComArray}
  console.log("StuObj>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

  console.log(StuObj);
    
  

   return StuObj;

}