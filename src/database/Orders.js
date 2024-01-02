const mysql = require("mysql2");
//const moment = require("moment");
const utils = require("./utils");

const dbOptions = {
  host: process.env.HOST,
  port: process.env.DBPORT,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
};

const table = "orders";

const pool = mysql.createPool(dbOptions).promise();

const updateOrder = async (
  fields,
  values,
  conditionFields,
  conditionValues
) => {
  await utils.update(
    pool,
    table,
    fields,
    values,
    conditionFields,
    conditionValues
  );
};

module.exports = { updateOrder };
