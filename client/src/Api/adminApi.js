import axios from "axios";
// const token=JSON.parse(localStorage.getItem('userData')).token

const token=()=>{
  const temp=JSON.parse(localStorage.getItem('userData')).token
  return temp
}
// const usersUrl = 'http://localhost:3003/users';
const usersUrl = "http://localhost:8008";

//is will check login information (uername,password)
export const checkLogger = async (data) => {
  console.log("in validateUser >>>", data);
  
  return await axios.post(`${usersUrl}/login`, data);
};


//can faculty or student fill there form from login , is set by admin 
export const facultyFormSet = async (data) => {
  console.log("in facultyFormSet >>>", data);
  
  return await axios.post(`${usersUrl}/facultyFormSet`,data,{headers:{Autherization:token()}});
};





//to set New password after Changing Password
export const setNewPass = async (data) => {
  console.log("in setNewPass >>>", data);
  
  return await axios.post(`${usersUrl}/setNewPass`,data);
};




//get all counts of faculty, student , active user, subject
export const getCountOfALL = async () => {
  console.log("in getCountOfALL >>>");
  
  return await axios.get(`${usersUrl}/getCountOfALL`);
};


//Check weather faculty and student form is allow or not
export const isFormAllow = async (data) => {
  console.log("in isFormAllow >>>",data);
  
  return await axios.get(`${usersUrl}/isFormAllow/${data}`);
};


//it will check mail from student/admin/faculty form dynamically weather it already exist or not
export const checkMail = async (data) => {
  console.log("in checkMail >>>", data);
  
  return await axios.get(`${usersUrl}/checkMail/${data}`);
};



export const chechInfo = async () => {
    
    console.log("in validateUser >>>", );
  
  return await axios.post(`${usersUrl}/check`, {headers:{Autherization:token()}});
};



export const getOneAdmin = async (id) => {
  console.log("in AXios Api getOneFacultyInfo the data is >> ", id);

  return await axios.get(`${usersUrl}/getOneAdmin/${id}`,{headers:{Autherization:token()}});
};

export const validateUser = async (data) => {
  console.log("in validateUser >>>", data);

  return await axios.post(`${usersUrl}/add`, data);
};



export const otpSentVarification = async (data) => {
  console.log("in otpSentVarification >>>", data);

  return await axios.post(`${usersUrl}/otpSentVarification`, data);
};


export const verifyOtp = async (data) => {
  console.log("in otpSentVarification >>>", data);

  return await axios.post(`${usersUrl}/verifyOtp`, data);
};




export const addAdminDetails = async (data) => {
  console.log("in clientside addAdminDetails>> ", data);

  return await axios.post(`${usersUrl}/addAdminDetails`, data,{headers:{Autherization:token()}});
};

export const getAllStudent = async () => {
  console.log("in getAllStudent No data needed>>> ");

  return await axios.get(`${usersUrl}/getAllStudent`,{headers:{Autherization:token()}});
};

export const addStudentDetails = async (data) => {
  console.log("in clientside addStudentAcademicDetails>> ", data);

  return await axios.post(`${usersUrl}/addStudentDetails`, data,{headers:{Autherization:token()}});
};

export const updateStudent = async (data) => {
  console.log("in clientside updateStudent >>>>", data);

  return await axios.put(`${usersUrl}/updateStudent`, data,{headers:{Autherization:token()}});
};

export const deleteOneStudent = async (id) => {
  console.log("in clientside deleteOneStudent  data >>>>", id);

  //here Data is Student id
  return await axios.delete(`${usersUrl}/deleteOneStudent/${id}`,{headers:{Autherization:token()}});
};

export const getOneStudent = async (id) => {
  console.log("in AXios Api getOneStudentInfo the data is >> ", id);

  return await axios.get(`${usersUrl}/getOneStudent/${id}`,{headers:{Autherization:token()}});
};




export const addFacultyDetails = async (data) => {
  console.log("in AXios Api  addFacultyDetails >>>>>>>>>>>>>>");

  console.log(data);

  // id = id || '';

  return await axios.post(`${usersUrl}/addFacultyDetails`, data,{headers:{Autherization:token()}});
};

export const getOneFaculty = async (id) => {
  console.log("in AXios Api getOneFacultyInfo the data is >> ", id);

  return await axios.get(`${usersUrl}/getOneFaculty/${id}`,{headers:{Autherization:token()}});
};

export const updateFaculty = async (data) => {
  console.log("in AXios Api  updateFaculty >>>>", data);

  return await axios.put(`${usersUrl}/updateFaculty`, data,{headers:{Autherization:token()}});
};

export const deleteOneFaculty = async (id) => {
  console.log("in AXios Api  deleteOneFaculty  data >>>>", id);

  //here Data is Student id
  return await axios.delete(`${usersUrl}/deleteOneFaculty/${id}`,{headers:{Autherization:token()}});
};

export const getAllFaculty = async () => {
  console.log("in AXios Api  getAllFaculty  No data needed");



  return await axios.get(`${usersUrl}/getAllFaculty`,{headers:{Autherization:token()}});
};

export const allocateSubToFaculty = async (data) => {
  console.log("in AXios Api  allocateSubToFaculty  No data needed",data);



  return await axios.post(`${usersUrl}/allocateSubToFaculty`,data,{headers:{Autherization:token()}});
};


export const addDepart = async (data) => {
  console.log("in AXios Api  clientside addDepart ",data);

  // id = id || '';
  return await axios.post(`${usersUrl}/addDepart`,data,{headers:{Autherization:token()}});
};

export const getAllSubject = async () => {
  console.log("in AXios Api  clientside getAllSubject ",{headers:{Autherization:token()}});


  return await axios.get(`${usersUrl}/getAllSubject`,{headers:{Autherization:token()}});
};

export const addSubject = async (subject) => {
  console.log("in AXios Api  clientside addSubject ",subject);

  // id = id || '';
  return await axios.post(`${usersUrl}/addSubject`, subject,{headers:{Autherization:token()}});
};

export const updateSubject = async (data) => {
  console.log("in AXios Api  clientside updateSubject ",data);

  // id = id || '';
  return await axios.put(`${usersUrl}/updateSubject`, data,{headers:{Autherization:token()}});
};


export const deleteSubject = async (data) => {
  console.log("in AXios Api  clientside deleteSubject ",data);

  // id = id || '';
  return await axios.delete(`${usersUrl}/deleteSubject/${data}`,{headers:{Autherization:token()}} );
};













export const getUsers = async () => {
  // id = id || '';
  return await axios.get(`${usersUrl}/getUser`);
};




// export const addUser = async (user) => {
//     return await axios.post(`${usersUrl}/add`, user);
// }

// export const deleteUser = async (id) => {
//     return await axios.delete(`${usersUrl}/${id}`);
// }

// export const editUser = async (id, user) => {
//     return await axios.put(`${usersUrl}/${id}`, user)
// }
