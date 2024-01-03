const mysql = require("mysql2");
const utils = require("./utils");
const dbOptions = {
  host: "db4free.net",
  user: "demotdlogistic1",
  password: "demotdlogistic1",
  port: 3306,
  database: "demotdlogistic1",
};

const table = "orders";
const sessionTable = "sessions";

const pool = mysql.createPool(dbOptions).promise();

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
  } catch (error) {
    console.error(error);
  }
};

//updateOrder(["mass"], [2], ["id"], [1]);

module.exports = { updateOrder };
