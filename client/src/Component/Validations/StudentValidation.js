export default function studentValidation(data) {
  // { sname: '', semail: '', saddress: '', sstate: '', spin: '', sdob: '', sgender: '', sdept: '', ssemester: '', smob: '', simg: '', spass: '', confirmPass: "" });

  // const data={sname:'Pankaj', semail:'pankaj@gmail', saddress:'aklsndk', sstate:"aknsj", spin:"54644", sdob:'534654', sgender:'', sdept: '', ssemester: '', smob:'3545414785', simg:"", spass: '7411', confirmPass: "7411"}

  const sname =
    data.sname === "" ||
      data.sname === null ||
      data.sname.trim().length < 3 ||
      data.sname.trim().length > 30
      ? false
      : true;
  const semail =
    data.semail === "" ||
      data.semail === null ||
      !data.semail.includes("@") ||
      !data.semail.includes(".")
      ? false
      : true;
  const saddress =
    data.saddress === "" || data.saddress === null ? false : true;
  const sstate =
    data.sstate === "" || data.sstate === null || data.sstate.length < 4
      ? false
      : true;
  const spin =
    data.spin === "" || data.spin === null || data.spin < 4
      ? false
      : true;
  const sdob =
    data.sdob === "" || data.sdob === null || data.sdob.length<2
      ? false
      : true;
  const smob =
    data.smob === "" || data.smob === null || !data.smob.length === 10
      ? false
      : true;
  const sdept = data.sdept === "" || data.sdept === null ? false : true;
  const ssemester =
    data.ssemester === "" || data.ssemester === null ? false : true;
  const spass =
    data.spass === "" ||
      data.spass === null ||
      !(data.spass === data.confirmPass)
      ? false
      : true;
      const  sgender=(data.sgender==="" || data.sgender===null )?false:true;
  const spic=data.spic?true:false; 



  console.log("sname", sname);

  console.log("spic>>>>>>>>>",data.spic)
  console.log("semail", semail);
  console.log("saddress", saddress);
  console.log("sstate", sstate);
  console.log("spin", spin);
  console.log("smob", smob);
  console.log("sdept", sdept);
  console.log("sdob", sdob);
  console.log("sgender", sgender);
  console.log("ssemester", ssemester);
  console.log("spic", spic);
  console.log("spass", spass);

 

  // const result =
  //   sname &&
  //   semail &&
  //   saddress &&
  //   sstate &&
  //   spin &&
  //   smob &&
  //   sdob &&
  //   sdept &&
  //   ssemester &&
  //   spass && sgender && spic;


    return  {sname :sname , semail :semail, saddress :saddress, sstate :sstate, spin :spin,sdob :sdob, ssemester :ssemester, smob :smob, sdept :sdept, sgender :sgender,spic:spic, spass:spass}

}
