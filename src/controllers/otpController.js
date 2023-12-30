const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const otpService = require("../services/otpService");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "minhfaptv@gmail.com",
        pass: "zuko cgyk uvfj lfnt",
    }
});

const createOTP = async (req, res) => {
    const { phone_number, email } = req.body;

    const otp = randomstring.generate({
        length: 6,
        charset: "numeric",
    });

    try {
        await otpService.createOTP(phone_number, email, otp);

        const mailOptions = {
            from: "minhfaptv@gmail.com",
            to: email,
            subject: "Xác thực OTP của bạn",
            text: `Mã OTP của bạn là ${otp}`,
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                return res.status(500).send("Đã xảy ra lỗi. Vui lòng thử lại.");
            }

            return res.status(200).send("OTP được gửi thành công. Vui lòng kiểm tra số điện thoại và email để xác thực.");
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Lỗi hệ thống. Vui lòng thử lại!",
        });
    }
}

const verifyOTPMiddleware = async (phone_number, otp) => {
    return await otpService.verifyOTP(phone_number, otp);
}

const verifyOTPFail = (req, res) => {
    return res.status(400).json({
        error: false,
        valid: false,
        message: "OTP không hợp lệ. Vui lòng thử lại!",
    });
}

const verifyOTPSuccess = (req, res) => {
    return res.status(200).json({
        error: false,
        valid: true,
        message: "Xác thực thành công!",
    });
}

module.exports = {
    createOTP,
    verifyOTPMiddleware,
    verifyOTPFail,
    verifyOTPSuccess,
}