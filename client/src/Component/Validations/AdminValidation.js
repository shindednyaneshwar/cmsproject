export default function studentValidation(data) {
  // { aname: '', aemail: '', aaddress: '', astate: '', apin: '', adob: '', agender: '', agender: '', : '', amob: '', simg: '', apass: '', confirmPass: "" });

  // const data={aname:'Pankaj', aemail:'pankaj@gmail', aaddress:'aklsndk', astate:"aknsj", apin:"54644", adob:'534654', agender:'', agender: '', : '', amob:'3545414785', simg:"", apass: '7411', confirmPass: "7411"}

  const aname =
    data.aname === "" ||
      data.aname === null ||
      data.aname.trim().length < 3 ||
      data.aname.trim().length > 30
      ? false
      : true;
  const aemail =
    data.aemail === "" ||
      data.aemail === null ||
      !data.aemail.includes("@") ||
      !data.aemail.includes(".")
      ? false
      : true;
  const aaddress =
    data.aaddress === "" || data.aaddress === null ? false : true;
  const astate =
    data.astate === "" || data.astate === null || data.astate.length < 4
      ? false
      : true;
  const apin =
    data.apin === "" || data.apin === null || data.apin < 4
      ? false
      : true;
  const adob =
    data.adob === "" || data.adob === null || data.adob.length<2
      ? false
      : true;
  const amob =
    data.amob === "" || data.amob === null || !data.amob.length === 10
      ? false
      : true;
  
 
  const apass =
    data.apass === "" ||
      data.apass === null ||
      !(data.apass === data.confirmPass)
      ? false
      : true;
      const  agender=(data.agender==="" || data.agender===null )?false:true;
  const apic=data.apic?true:false; 
  console.log("anameasdas",data.apic );



  console.log("aname", aname);


  console.log("aemail", aemail);
  console.log("aaddress", aaddress);
  console.log("astate", astate);
  console.log("apin", apin);
  console.log("amob", amob);
  console.log("agender", agender);
  console.log("adob", adob);
  console.log("agender", agender);

  console.log("apic", apic);
  console.log("apass", apass);

 

  // const result =
  //   aname &&
  //   aemail &&
  //   aaddress &&
  //   astate &&
  //   apin &&
  //   amob &&
  //   adob &&
  //   agender &&
  //    &&
  //   apass && agender && apic;


    return  {aname :aname , aemail :aemail, aaddress :aaddress, astate :astate, apin :apin,adob :adob, amob :amob, agender :agender, agender :agender,apic:apic, apass:apass}

}
