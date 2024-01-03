const OTP = require("../database/OTP");

const createOTP = async (phoneNumber, email, otp) => {
    await OTP.createOTP(phoneNumber, email, otp)
}

const verifyOTP = async (phoneNumber, otp) => {
    return await OTP.verifyOTP(phoneNumber, otp);
}

module.exports = {
    createOTP,
    verifyOTP,
}