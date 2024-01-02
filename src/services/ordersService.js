Orders = require("../database/Orders");

const updateUserOrder = async (
  fields,
  values,
  conditionFields,
  conditionValues
) => {
  await Orders.updateOrder(fields, values, conditionFields, conditionValues);
};

module.exports = { updateUserOrder };
