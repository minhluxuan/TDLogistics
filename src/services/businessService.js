const Business = require("../database/Business");

const getOneBusinessUser = async (fields, values) => {
  return await Business.getOneBusinessUser(fields, values);
}

const updatePassword = async (fields, values, conditionFields, conditionValues) => {
  return await Staffs.updatePassword(fields, values, conditionFields, conditionValues);
}

module.exports = {
  getOneBusinessUser,
  updatePassword,
}