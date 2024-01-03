const { update } = require("../database/utils");
const ordersService = require("../services/ordersService");
const dotenv = require("dotenv").config({ path: "../../.env" });
const Joi = require("joi");

const schema = Joi.object({
  order_time: Joi.date(),
  mass: Joi.number(),
  height: Joi.number(),
  width: Joi.number(),
  length: Joi.number(),
  fee: Joi.number(),
  source: Joi.string(),
  destination: Joi.string(),
  parent: Joi.string(),
  container: Joi.string(),
  journey: Joi.string(),
  COD: Joi.number(),
  status_success: Joi.number().integer(),
  miss: Joi.number().integer(),
}).unknown(false);

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
  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      error: true,
      message: "Không tồn tại mục cần đổi",
      details: error.details,
    });
  }
  const order_id = req.params.order_id;
  const fields = Object.keys(req.body);
  const values = Object.values(req.body);

  const conditionFields = ["id"];
  const conditionValues = [order_id];
  try {
    await ordersService.updateUserOrder(
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
