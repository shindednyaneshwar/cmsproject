import axios from "axios";
// const token=JSON.parse(localStorage.getItem('userData')).token
const token=()=>{
  const temp=JSON.parse(localStorage.getItem('userData')).token

  console.log("this is token",temp)
  return temp
}

// const usersUrl = 'http://localhost:3003/users';
const usersUrl = "http://localhost:8008";


export const getMyAcademicInfo = async (data) => {
  console.log("inclientside axios getmyAcademicInfo >>>", data);
  
  return await axios.get(`${usersUrl}/getMyAcademicInfo/${data}`,{headers:{Autherization:token()}});
};

export const getMyLecture = async (data) => {
  console.log("in getMyLecture clientSide >>>", data);
  // const data="hhhhhhh"
  return await axios.get(`${usersUrl}/getMyLecture/${data}`,{headers:{Autherization:token()}});
};