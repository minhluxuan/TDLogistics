const mysql = require("mysql");
//const moment = require("moment");
const utils = require("./utils");

const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "admin",
  database: "UserDatabase",
});

const table = "orders";

const pool = mysql.createPool(connection);

const updateOrder = async (
  fields,
  values,
  conditionFields,
  conditionValues
) => {
  try {
    const result = await utils.update(
      pool,
      table,
      fields,
      values,
      conditionFields,
      conditionValues
    );
    console.log(result);
  } catch (error) {
    console.error(error);
    console.log("error");
    // Handle the error appropriately
  }
};

updateOrder(["mass"], ["2"], ["id"], ["1"]);

//module.exports = { updateOrder };
