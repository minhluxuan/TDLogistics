Orders = require("../database/Orders");

const updateUserOrder = async (fields, values, conditionFields, conditionValues) => {
  if (!Array.isArray(fields) || !Array.isArray(values)) {
    throw new Error("Fields and values must be arrays");
  }
  const journeyIndex = fields.indexOf("journey");

  if (journeyIndex !== -1) {
    //handle this
    Orders.updateOrderJourney(values[journeyIndex], conditionFields, conditionValues);
    fields.splice(journeyIndex, 1);
    values.splice(journeyIndex, 1);
  }
  if (!Array.isArray(fields) || !Array.isArray(values)) {
    throw new Error("Fields and values must be arrays");
  }
  await Orders.updateOrder(fields, values, conditionFields, conditionValues);
};

module.exports = { updateUserOrder };
