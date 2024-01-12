const complaintsService = require("../services/complaintsService");
const { CustomerUserRequestValidation } = require("./utils");
const dotenv = require("dotenv").config({ path: "../../.env" });
const REGEX_PHONE_NUMBER = new RegExp(process.env.REGEX_PHONE_NUMBER);

/*
Create:
req.body:



*/

const createNewUser = async (req, res) => {
  if (!req.isAuthenticated() || req.user.permission < 1) {
    return res.status(401).json({
      error: true,
      message: "Bạn không được phép truy cập tài nguyên này.",
    });
  }

  const { phone_number } = req.body;

  if (!REGEX_PHONE_NUMBER.test(phone_number) || phone_number !== req.user.phone_number) {
    return res.status(400).json({
      error: true,
      message: "Thông tin đăng ký không hợp lệ!",
    });
  }
};
