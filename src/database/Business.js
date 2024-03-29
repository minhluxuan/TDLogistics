const mysql = require("mysql2");
const utils = require("./utils");

const dbOptions = {
	host: process.env.HOST,
	port: process.env.DBPORT,
	user: process.env.USER,
	password: process.env.PASSWORD,
	database: process.env.DATABASE,
};

const table = "business_user";

const pool = mysql.createPool(dbOptions).promise();

const getOneBusinessUser = async (fields, values) => {
  	return await utils.findOne(pool, table, fields, values);
};

const updatePassword = async (fields, values, conditionFields, conditionValues) => {
	return await utils.update(pool, table, fields, values, conditionFields, conditionValues);
};

module.exports = {
	getOneBusinessUser,
	updatePassword
}