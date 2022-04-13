import jwt from "jwt-decode";

export const takeDepartment = (dept) => {
  switch (dept) {
    case "ele":
      return "Electrical Engineering";
    case "mech":
      return "Mechanical Engineering";
    case "civil":
      return "Civil Engineering";
    case "entc":
      return "Electronics and Telecomunication ";
    case "it":
      return "Information Technology";

    default:
      return "Not Mention";
    //No need of Break statement here bcz return already break statement
  }
};

export async function check(data) {

  const token = JSON.parse(localStorage.getItem("userData")).token;
  const user = JSON.parse(localStorage.getItem("userData")).user;
  const userPersonalDetail = JSON.parse(localStorage.getItem("userPersonalDetail"));
  const checking = jwt(token);
  
  const currentDate = new Date();

  const istokenValid = checking.exp * 1000 > currentDate.getTime();
  let result;
  if (data === "admin" || data === "faculty" || data === "student") {
     result = istokenValid && data === user;
  }else if(data==='lastseen'){
     result = checking.lastLogin;
  }else if(data==='userPersonalDetail'){
    const {isFacultyAllow,isStudentAllow}=userPersonalDetail
    result= {isFacultyAllow,isStudentAllow};
 }


  

  return result;
}
