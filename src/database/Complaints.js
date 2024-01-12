const mysql = require("mysql2");
const utils = require("./utils");
const REGEX_PHONE_NUMBER = new RegExp(process.env.REGEX_PHONE_NUMBER);
const dbOptions = {
  host: "db4free.net",
  user: "demotdlogistic1",
  password: "demotdlogistic1",
  port: 3306,
  database: "demotdlogistic1",
};

const table = "complaints";

const pool = mysql.createPool(dbOptions).promise();

const createComplaint = async (fields, values) => {
  const requiredFields = ["phone_number", "complaint_type", "datetime", "status"];
  const typeValues = ["Delivery", "Application"];
  const statusValues = ["Ok", "On hold"];

  for (let i = 0; i < requiredFields.length; i++) {
    if (fields.indexOf(requiredFields[i]) === -1 || values[fields.indexOf(requiredFields[i])] === null) {
      throw new Error(`Missing field ${requiredFields[i]}`);
    }
  }
  if (!REGEX_PHONE_NUMBER.test(values[fields.indexOf("phone_number")])) {
    throw new Error(`Invalid phone number: ${values[fields.indexOf("phone_number")]}`);
  }
  if (!typeValues.includes(values[fieldIndex])) {
    throw new Error(`Invalid complaint type: ${values[fieldIndex]}`);
  }
  if (!statusValues.includes(values[fieldIndex])) {
    throw new Error(`Invalid status: ${values[fieldIndex]}`);
  }
  //check for datetime will be made in router/service
  return await utils.insert(pool, table, fields, values);
};

const getAllComplaints = async () => {
  return await utils.find(pool, table);
};

const getComplaint = async (fields, values) => {
  const startDateIndex = fields.indexOf("startDate");
  const startDate = startDateIndex !== -1 ? values[startDateIndex] : null;
  if (startDateIndex !== -1) {
    fields.splice(startDateIndex, 1);
    values.splice(startDateIndex, 1);
  }
  const endDateIndex = fields.indexOf("endDate");
  const endDate = endDateIndex !== -1 ? values[endDateIndex] : null;
  if (endDateIndex !== -1) {
    fields.splice(endDateIndex, 1);
    values.splice(endDateIndex, 1);
  }
  if (startDate && endDate) {
    return await utils.findWithDateRangeAndFilters(pool, table, startDate, endDate, fields, values);
  }
  return await utils.findWithFilters(pool, table, fields, values);
};

const updateComplaint = async (values, conditionFields, conditionValues) => {
  const valueFields = ["Open", "Closed"];
  for (let i = 0; i < values.length; i++) {
    if (!valueFields.includes(values[i])) {
      throw new Error(`Invalid value for status: ${values[i]}`);
    }
  }
  try {
    await utils.update(pool, table, ["status"], values, conditionFields, conditionValues);
    console.log("update success");
  } catch (err) {
    console.log(err);
  }
};

const deleteComplaint = async (id) => {
  try {
    await utils.deleteRecord(pool, table, ["id"], id);
    console.log("delete success");
  } catch (err) {
    console.log(err);
  }
};

// const printAllComplaints = async () => {
//   try {
//     const complaints = await getComplaint(
//       ["id", "status", "startDate", "endDate"],
//       [1, "Open", "2024-01-01T00:00:00Z", "2024-12-31T23:59:59Z"]
//     );
//     console.log(complaints);
//   } catch (error) {
//     console.error("Error getting complaints:", error);
//   }
// };
// createComplaint(
//   ["phone_number", "complaint_type", "complaint_description", "datetime", "status"],
//   ["0976481171", "Application", "valoz", "2024-01-01 00:00:00", "open"]
// );
module.exports = { createComplaint, getAllComplaints, getComplaint, updateComplaint, deleteComplaint };
