import { useEffect, useState } from "react";
import { addAdminDetails,checkMail } from "../../Api/adminApi";

import AdminValidation from "../Validations/AdminValidation";


import { check } from "../Validations/Utility";

export default function Student() {
  const [form, setForm] = useState(false);
  const [messageWarn, setMessageWarn] = useState(false);
  const [success, setSuccess] = useState(false);
  const [count, setCount] = useState(1);
  const [emailMessage, setEmailMessage] = useState("");
  const [validEmail, setValidEmail] = useState("");

  const [adminInfo, setAdminInfos] = useState({
    aname: "",
    aemail: "",
    aaddress: "",
    astate: "",
    apin: "",
    adob: "",
    agender: "",
    isFacultyAllow:false,
    isStudentAllow:false,
    amob: "",
    apic: "",
    apass: "",
    confirmPass: "",
  });

  //===============================================================================================================
  // --------------------------------------As Page automatically Student List will get

  // Here, useEffect will operate as this Component render at first time  and then as count changes

  useEffect(async () => {
    const k = await check("admin");
    if (k) {
    
    }
  }, [count]);

  function IncreaseCount() {
    setCount(count + 1);
  }

  //============================================================================================================


  // TO save Data to State
  async function onChangeHandler(e) {
    setMessageWarn(null);
    setSuccess(null);

    if (e.target.name === "aemail") {
      setAdminInfos({ ...adminInfo, [e.target.name]: e.target.value });
      setValidEmail(true);
    } else {
      if (
        validEmail === true &&
        adminInfo.aemail.includes("@") &&
        adminInfo.aemail.includes(".")
      ) {
        console.log("asdasasd")
        const isEmailValid = await checkMail(adminInfo.aemail);

        if (isEmailValid.status === 200) {
          setAdminInfos({  fname: "",
          aemail: "",
          aaddress: "",
          apin: "",
          astate: "",
          adob: "",
          amob: "",
          adept: "",
          agender: "",
          apic: "",
          apass: "",
          aconfirm: "",})
          console.log("sucessss");
          setEmailMessage("op-success");
        } else {
        

          const temp = adminInfo.aemail;
          setEmailMessage("op-error");
        }
        setAdminInfos({ ...adminInfo, aemail: e.target.value });

        setValidEmail(false);
      }
      setAdminInfos({ ...adminInfo, [e.target.name]: e.target.value });
      setValidEmail(false);
    }
  }
  


  //this function will call on uploading file
  async function onphotoChangeHandler(e) {

    setMessageWarn('');
    setSuccess('');

    const file = await e.target.files[0];
    const fileSize = await e.target.files[0].size;
    console.log(e.target.files[0].size)
    if (
      (file.type === "image/jpeg" ||
      file.type === "image/jpg" ||
      file.type === "image/png") && fileSize<50000
    ) {
    console.log("lll",e.target.files[0].size)

      setAdminInfos({ ...adminInfo, apic: e.target.files[0] });
    } else {
      setAdminInfos({ ...adminInfo, apic:null });
      setMessageWarn("Image should be JPEG / JPG / PNG (Format)  and Below 50kb (Size) ");
    }
  }

  const setSubmitData = async (e) => {
    e.preventDefault();
console.log(adminInfo)
    const valideData = AdminValidation(adminInfo);
    let isValid = 0;
    let isString = "Check ";
    let nameArray = [
      "Name",
      "Email",
      "Address",
      "State",
      "Pin Code",
      "Date of Birth",
    
      "Mobile No.",
    
      "Gender",
      "Image",
      "Password",
    ];


    //For validation of Data
    for (const key in Object.keys(valideData)) {
      if (Object.values(valideData)[key] === false) {
        ++isValid;
        isString = isString + nameArray[key] + ", ";
      }
    }

    let helper = !validEmail;
    if (validEmail === true) {
      const isEmailValid = await checkMail(adminInfo.aemail);

      if (isEmailValid.status === 200) {
        console.log("sucessss");
        setEmailMessage("op-success");
       
        helper = true;
        
      } else {
       
        helper = false;
        const temp = adminInfo.aemail;
        setEmailMessage("op-error");
      }
    }



    if (isValid === 0 && emailMessage === "op-success" &&
    helper) {
      //converting into Formdata
      setMessageWarn("");
      let formData = new FormData();

      for (var key in adminInfo) {
        formData.append(key, adminInfo[key]);
      }
      //sending to Axios
      const isAdminSave = await addAdminDetails(formData);

      isAdminSave.status === 200
        ? setSuccess("Admin Added Successfully")
        : setSuccess("Facing problem while Adding Admin");
      setCount(count + 1);
    } else {
      setMessageWarn(isString);
      setSuccess("");
    }
  };

  return (
    <>
      
              <div className="sub-heading">
                <div>Admin</div>
              </div>
              <div>
                <div class="container row-cols-5 fl-row">
                  
                 
                </div>

                <section
                  className="addperson showForm"
                  id="addAdmin"
                  name="addAdmin"
                ><br/><br/><br/><br/>
                  <div className="container">
                    
                    <h2 className="text-center">Admin Form</h2>

                    <h5 className="op-error">{messageWarn}</h5>

                   
                      <h3
                       className="op-success"
                      >
                        {success}
                      </h3>
                 
                    <div className="row jumbotron">
                      <div className="col-sm-6 form-group">
                        <label for="name-f">Full Name</label>{" "}
                        <input
                          onChange={onChangeHandler}
                          value={adminInfo.aname}
                          className="form-control"
                          name="aname"
                          id="name-f"
                          type="text"
                          placeholder="Enter your Full name"
                          required
                        />
                      </div>
                      <div className="col-sm-6 form-group">
                        <label for="email">Email{" "} <i  className={emailMessage?`${emailMessage} bi bi-check-circle-fill zoom`:""}></i></label>
                        <input
                          onChange={onChangeHandler}
                          value={adminInfo.aemail.toLowerCase()}
                          type="email"
                          className="form-control"
                          name="aemail"
                          id="email"
                          placeholder="Enter your email."
                          required
                        />
                      </div>
                      <div className="col-sm-6 form-group">
                        <label for="address-1">Address </label>{" "}
                        <input
                          onChange={onChangeHandler}
                          value={adminInfo.aaddress}
                          type="address"
                          className="form-control"
                          name="aaddress"
                          id="a"
                          placeholder="Locality/House/Street no."
                          required
                        />
                      </div>

                      <div className="col-sm-4 form-group">
                        <label for="State">State</label>

                        <select
                          name="astate"
                          id="state"
                          class="form-control"
                          onChange={onChangeHandler}
                          value={adminInfo.astate}
                        >
                          <option value="Andhra Pradesh">Andhra Pradesh</option>
                          <option value="Andaman and Nicobar Islands">
                            Andaman and Nicobar Islands
                          </option>
                          <option value="Arunachal Pradesh">
                            Arunachal Pradesh
                          </option>
                          <option value="Assam">Assam</option>
                          <option value="Bihar">Bihar</option>
                          <option value="Chandigarh">Chandigarh</option>
                          <option value="Chhattisgarh">Chhattisgarh</option>
                          <option value="Dadar and Nagar Haveli">
                            Dadar and Nagar Haveli
                          </option>
                          <option value="Daman and Diu">Daman and Diu</option>
                          <option value="Delhi">Delhi</option>
                          <option value="Lakshadweep">Lakshadweep</option>
                          <option value="Puducherry">Puducherry</option>
                          <option value="Goa">Goa</option>
                          <option value="Gujarat">Gujarat</option>
                          <option value="Haryana">Haryana</option>
                          <option value="Himachal Pradesh">
                            Himachal Pradesh
                          </option>
                          <option value="Jammu and Kashmir">
                            Jammu and Kashmir
                          </option>
                          <option value="Jharkhand">Jharkhand</option>
                          <option value="Karnataka">Karnataka</option>
                          <option value="Kerala">Kerala</option>
                          <option value="Madhya Pradesh">Madhya Pradesh</option>
                          <option value="Maharashtra">Maharashtra</option>
                          <option value="Manipur">Manipur</option>
                          <option value="Meghalaya">Meghalaya</option>
                          <option value="Mizoram">Mizoram</option>
                          <option value="Nagaland">Nagaland</option>
                          <option value="Odisha">Odisha</option>
                          <option value="Punjab">Punjab</option>
                          <option value="Rajasthan">Rajasthan</option>
                          <option value="Sikkim">Sikkim</option>
                          <option value="Tamil Nadu">Tamil Nadu</option>
                          <option value="Telangana">Telangana</option>
                          <option value="Tripura">Tripura</option>
                          <option value="Uttar Pradesh">Uttar Pradesh</option>
                          <option value="Uttarakhand">Uttarakhand</option>
                          <option value="West Bengal">West Bengal</option>
                        </select>
                      </div>
                      <div className="col-sm-2 form-group">
                        <label for="zip">Postal-Code</label>{" "}
                        <input
                          onChange={onChangeHandler}
                          value={adminInfo.apin}
                          type="zip"
                          className="form-control"
                          name="apin"
                          id="zip"
                          placeholder="Postal-Code."
                          required
                        />
                      </div>

                      <div className="col-sm-3 form-group">
                        <label for="Date">Date Of Birth</label>{" "}
                        <input
                          onChange={onChangeHandler}
                          value={adminInfo.adob}
                          type="Date"
                          name="adob"
                          className="form-control"
                          id="Date"
                          required
                        />
                      </div>
                      <div className="col-sm-3 form-group">
                        <label for="gender">Gender</label>{" "}
                        <select
                          onChange={onChangeHandler}
                          value={adminInfo.agender}
                          id="gender"
                          name="agender"
                          className="form-control browser-default custom-select"
                        >
                          <option value="">Select Gender</option>

                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="unspesified">Unspecified</option>
                        </select>
                      </div>
                    

                    
                      <div className="col-sm-3 form-group">
                        <label for="tel">Mobile Number</label>{" "}
                        <input
                          onChange={onChangeHandler}
                          value={adminInfo.amob}
                          type="tel"
                          
                          name="amob"
                          className="form-control"
                          id="tel"
                          placeholder="Enter Your Contact Number."
                          required
                        />
                      </div>
                      <div className="col-sm-3 form-group">
                        <label for="photo">Add Photo</label>{" "}
                        <input
                          onChange={onphotoChangeHandler}
                          type="file"
                          accept="image/png,image/jpg,image/jpeg"
                          name="apic"
                          className="form-control"
                          id="photo"
                          placeholder="Choose Pic"
                          required
                        />
                      </div>
                      <div className="col-sm-6 form-group">
                        <label for="pass">Password</label>{" "}
                        <input
                          onChange={onChangeHandler}
                          value={adminInfo.apass}
                          type="Password"
                          name="apass"
                          className="form-control"
                          id="pass"
                          placeholder="Enter your password."
                          required
                        />
                      </div>
                      <div className="col-sm-6 form-group">
                        <label for="pass2">Confirm Password</label>{" "}
                        <input
                          onChange={onChangeHandler}
                          value={adminInfo.confirmPass}
                          type="Password"
                          name="confirmPass"
                          className="form-control"
                          id="pass2"
                          placeholder="Re-enter your password."
                          required
                        />
                      </div>

                      <div className="col-sm-12 form-group mb-0">
                        <button
                          type="reset"
                          className="btn btn-primary float-right"
                          onClick={(e) => setSubmitData(e)}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

                {/*---------------------- Student Form------------------------- */}

                {/*------------------------------------------------------ Edit Form End------------------------------------------------------------------------------ */}
               
              </div>
            
    </>
  );
}
