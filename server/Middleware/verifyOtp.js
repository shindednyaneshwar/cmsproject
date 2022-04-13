import otpVerificationModel from "../model/otpVerification.js";

export async function verifyOtp(req, res) {
  try {
    const currentTime = new Date();
    const isVerify = await otpVerificationModel.findOne({ otp: req.body.otp });

    if (
      isVerify &&
      isVerify.validity - currentTime.getTime() > 0 &&
      req.body.username === isVerify.username
    ) {
      try {
        const isDeleteOTP = await otpVerificationModel.deleteOne({
          otp: req.body.otp,
        });
      } catch (error) {
        console.log("error in verify Otp>>>>>", error.message);
      }

      res.status(200).json({ message: "OTP is Confirm" });
    } else {
      res
        .status(203)
        .json({ message: "OTP is not Valid  or username is Wrong" });
    }
  } catch (error) {
    res.status(203).json({ message: "Invalid OTP" });
  }
}
