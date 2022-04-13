

export default function facultyValidation(data){

// {fname:'',femail:'',faddress:'',fpin:'',fstate:"",fdob:'',fmob:'',fedu:'', fdept:'',fgender:'',fpic:'',fpass:'',fconfirm:''});
  console.log(data)

  const fname =
    data.fname === " " ||
    data.fname === null ||
    data.fname.trim().length < 3 ||
    data.fname.trim().length > 40
      ? false
      : true;
  const femail =
    data.femail === "" ||
    data.femail === null ||
    !data.femail.includes("@") ||
    !data.femail.includes(".")
      ? false
      : true;

      
    
const  faddress=(data.faddress==="" || data.faddress===null)?false:true;
const  fstate=(data.fstate==="" || data.fstate===null || data.fstate.length<2)?false:true;
const  fpin=(  data.fpin==="" || data.fpin===null || data.fpin.length<6)?false:true;
const  fdob=(data.fdob==="" || data.fdob===null || data.fdob.length<4)?false:true;
const  fedu=(data.fedu==="" || data.fedu===null || data.fedu.length<4)?false:true;
const  fmob=(data.fmob==="" || data.fmob===null || !data.fmob.length===10)?false:true;
const  fdept=(data.fdept==="" || data.fdept===null )?false:true;
const  fgender=(data.fgender==="" || data.fgender===null )?false:true;
const  fpic=(data.fpic==="" || data.fpic===null)?false:true;
const  fpass=(data.fpass==="" || data.fpass===null || !(data.fpass===data.fconfirm)) ?false:true;



console.log("fname",fname)
// console.log("data",data.fname.trim(").le",).length)
console.log("femail",femail)
console.log("fadd",faddress)
console.log("fstate",fstate)
console.log("fpin",fpin)
console.log("fdob",fdob)
console.log("fedu",fedu)
console.log("fmob",fmob)
console.log("fdep",fdept)
console.log("fgen",fgender)
console.log("fpas",fpass) 
console.log("fpic",fpic)

return  {fname :fname , femail :femail, faddress :faddress, fstate :fstate, fpin :fpin,fdob :fdob, fedu :fedu, fmob :fmob, fdept :fdept, fgender :fgender,fpic:fpic, fpass:fpass}







   
}