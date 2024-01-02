const { update } = require("../database/utils");
const ordersService = require("../services/ordersService");
const dotenv = require("dotenv").config({ path: "../../.env" });

const updateUserOrder = async (req, res) => {
  if (!req.isAuthenticated() || req.user.permission < 1) {
    return res.status(401).json({
      error: true,
      message: "Bạn không được phép truy cập tài nguyên này.",
    });
  }

  if (
    !req.body.hasOwnProperty("phone_number") ||
    !req.body["phone_number"] ||
    !REGEX_PHONE_NUMBER.test(req.body["phone_number"]) ||
    req.body["phone_number"] !== req.user.phone_number
  ) {
    console.log("Phone number cannot be empty!");
    return res.status(400).json({
      error: true,
      message: "Số điện thoại không hợp lệ!",
    });
  }
  const order_id = req.params;
  const fields = Object.keys(req.body);
  const values = Object.values(req.body);

  const conditionFields = ["order_id"];
  const conditionValues = [order_id];
  try {
    ordersService.updateUserOrder(
      fields,
      values,
      conditionFields,
      conditionValues
    );
    res.status(200).json({
      err: false,
      message: "Cập nhật thành công",
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Lỗi khi cập nhật đơn hàng",
    });
  }
};
module.exports = { updateUserOrder };
