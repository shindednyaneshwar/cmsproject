import axios from "axios";
// const token=JSON.parse(localStorage.getItem('userData')).token
const token=()=>{
  const temp=JSON.parse(localStorage.getItem('userData')).token
  return temp
}

// const usersUrl = 'http://localhost:3003/users';
const usersUrl = "http://localhost:8008";


export const checkLogger = async (data) => {
  console.log("in validateUser >>>", data);
  
  return await axios.post(`${usersUrl}/login`, data);
};

export const getAllStudent = async (data) => {
  console.log("in getAllStudent  facultyapi No data needed>>> ",data);

  return await axios.get(`${usersUrl}/getAllStudentf/${data}`,{headers:{Autherization:token()}});
};

export const getAcademicOfStud = async (data) => {
  console.log("in getAcademicOfStud clientSide >>>", data);
  
  return await axios.get(`${usersUrl}/getAcademicOfStud/${data}`,{headers:{Autherization:token()}});
};

export const deleteOneNotification = async (data) => {
  console.log("in getAcademicOfStud clientSide >>>", data);
  
  return await axios.delete(`${usersUrl}/deleteOneNotification/${data}`,{headers:{Autherization:token()}});
};




export const setAcademicData = async (data) => {
  console.log("in getAcademicOfStud clientSide >>>", data);
  
  return await axios.post(`${usersUrl}/setAcademicData`,data,{headers:{Autherization:token()}});
};


export const saveNotification = async (data) => {
  console.log("in saveNotification clientSide >>>", data);
   
  return await axios.post(`${usersUrl}/saveNotification`,data,{headers:{Autherization:token()}});
};


export const getnotifications = async (data) => {
  console.log("in saveNotification clientSide >>>", data);
  
  const item=data || "Dummy";

  return await axios.get(`${usersUrl}/getnotifications/${item}`,{headers:{Autherization:token()}});
};



export const getOneSyllabus = async (data) => {
  console.log("in saveNotification clientSide >>>", data);
  
  return await axios.get(`${usersUrl}/getOneSyllabus/${data}`,{headers:{Autherization:token()}});
};



export const getOneNotification = async (data) => {
  console.log("in saveNotification clientSide >>>", data);
  
  return await axios.get(`${usersUrl}/getOneNotification/${data}`,{headers:{Autherization:token()}});
};


export const checkSyllabusUpload = async (data) => {
  console.log("in getAcademicOfStud clientSide >>>",data);
  
  return await axios.get(`${usersUrl}/checkSyllabusUpload/${data}`,{headers:{Autherization:token()}});
};


export const setSyllabusFile = async (data) => {
  console.log("in setSyllabusFile clientSide >>>",data);
  
  return await axios.post(`${usersUrl}/setSyllabusFile`,data,{headers:{Autherization:token()}});
};

export const deleteOneSyllabus = async (data) => {
  console.log("in deleteOneSyllabus clientSide >>>",data);
  
  return await axios.delete(`${usersUrl}/deleteOneSyllabus/${data}`,data,{headers:{Autherization:token()}});
};


export const postAttendance = async (data) => {
  console.log("in postAttendance ");

  console.log(data);

  // id = id || '';

  return await axios.post(`${usersUrl}/postAttendance`, data,{headers:{Autherization:token()}});
};