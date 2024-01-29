const OTP = require("../database/OTP");

const createOTP = async (phoneNumber, otp) => {
    await OTP.createOTP(phoneNumber, otp)
}

const verifyOTP = async (phoneNumber, otp) => {
    return await OTP.verifyOTP(phoneNumber, otp);
}

module.exports = {
    createOTP,
    verifyOTP,
}
