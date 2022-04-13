export default function subjectValidation(data) {
  // { sname: '', semail: '', saddress: '', sstate: '', spin: '', sdob: '', sgender: '', sdept: '', ssemester: '', smob: '', simg: '', spass: '', confirmPass: "" });

  // const data={sname:'Pankaj', semail:'pankaj@gmail', saddress:'aklsndk', sstate:"aknsj", spin:"54644", sdob:'534654', sgender:'', sdept: '', ssemester: '', smob:'3545414785', simg:"", spass: '7411', confirmPass: "7411"}

  const sname =
    data.sname === "" ||
    data.sname === null ||
    data.sname.trim().length < 3 ||
    data.sname.trim().length > 50
      ? false
      : true;

  const sdept = data.sdept === "" || data.sdept === null ? false : true;

  const ssemester =
    data.ssemester === "" || data.ssemester === null ? false : true;

  console.log("sname", sname);

  console.log("sdept", sdept);

  console.log("ssemester", ssemester);

  return { sname: sname, ssemester: ssemester, sdept: sdept };
}
