const mysql = require("mysql2");
const SQLutils = require("../lib/dbUtils");

const dbOptions = {
	host: process.env.HOST,
	port: process.env.DBPORT,
	user: process.env.USER,
	password: process.env.PASSWORD,
	database: process.env.DATABASE,
};

const table = "business_user";

const pool = mysql.createPool(dbOptions).promise();

const getOneBusinessUser = async (conditions) => {
	const fields = Object.keys(conditions);
	const values = Object.values(conditions);

  	return await SQLutils.findOneIntersect(pool, table, fields, values);
};

const updateBusinessUser = async (info, conditions) => {
	const fields = Object.keys(info);
	const values = Object.values(info);

	const conditionFields = Object.keys(conditions);
	const conditionValues = Object.values(conditions);

	return await SQLutils.updateOne(pool, table, fields, values, conditionFields, conditionValues);
};

module.exports = {
	getOneBusinessUser,
	updateBusinessUser,
}