const mysql = require("mysql2");
const utils = require("./utils");
//const { PoolCluster } = require("mysql2/typings/mysql/lib/PoolCluster");
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

const updateOrder = async (fields, values, conditionFields, conditionValues) => {
  try {
    const result = await utils.update(pool, table, fields, values, conditionFields, conditionValues);
  } catch (error) {
    console.error(error);
  }
};

const updateOrderJourney = async (newJourneyValue, conditionFields, conditionValues) => {
  try {
    const rensult = await utils.append(
      pool,
      table,
      "journey",
      "value",
      newJourneyValue,
      conditionFields,
      conditionValues
    );
    console.log(rensult);
  } catch (err) {
    console.log(err);
  }
};
// const newJourney = { time: "2023-01-02T00:00:00Z", location: "location4" };
// updatedOrderJourney(newJourney, "id", 3);
module.exports = { updateOrder, updateOrderJourney };
