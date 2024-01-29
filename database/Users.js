const mysql = require("mysql2");
const SQLutils = require("../lib/SQLutils");

const dbOptions = {
    host: process.env.HOST,
    port: process.env.DBPORT,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
};

const table = "customer_user";
const sessionTable="sessions";

const pool = mysql.createPool(dbOptions).promise();

const checkExistUser = async (phoneNumber) => {
    const result = await SQLutils.findOne(pool, table, ["phone"], [phoneNumber]);
    return result.length > 0;
};

const createNewUser = async (newUser) => {
    const lastUser = await utils.getLastRow(pool, table);

    let userId = "000000000";

    if (lastUser) {
        userId = (parseInt(lastUser["user_id"]) + 1).toString().padStart(9, "0");
    }

    const { fullname, email, phoneNumber } = newUser;
    await SQLutils.insert(pool, table, ["user_id", "fullname", "email", "phone"], [userId, fullname, email, phoneNumber]);
}

const getAllUsers = async () => {
    return await SQLutils.find(pool, table);
}

const getOneUser = async (fields, values) => {
    return await SQLutils.findOne(pool, table, fields, values);
}

const getUser = async (fields, values) => {
    return await SQLutils.find(pool, table, fields, values);
}

const updateUserInfo = async (fields, values, conditionFields, conditionValues) => {
    await SQLutils.update(pool, table, fields, values, conditionFields, conditionValues);
}

const checkExistSession = async (sessionId) => {
  const result = await SQLutils.findOne(pool, sessionTable, ["session_id"], [sessionId]);
  return result.length > 0;
};

module.exports = {
    checkExistUser,
    createNewUser,
    getAllUsers,
    getUser,
    getOneUser,
    updateUserInfo,
    checkExistSession,
}
