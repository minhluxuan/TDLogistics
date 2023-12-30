const mysql = require("mysql2");
const utils = require("./utils");

const dbOptions = {
    host: "sql12.freemysqlhosting.net",
    port: 3306,
    user: "sql12672558",
    password: "mnsK6vV9Hg",
    database: "sql12672558",
};

const table = "customer_user";

const pool = mysql.createPool(dbOptions).promise();

const checkExistUser = async (phoneNumber) => {
    const result = await utils.findOne(pool, table, ["phone"], [phoneNumber]);
    return result.length > 0;
};

const createNewUser = async (newUser) => {
    const { userId, fullname, email, phoneNumber } = newUser;
    await utils.insert(pool, table, ["user_id", "fullname", "email", "phone"], [userId, fullname, email, phoneNumber]);
}

const getAllUsers = async () => {
    return await utils.find(pool, table);
}

const getUser = async (fields, values) => {
    return await utils.find(pool, table, fields, values);
}

const updateUserInfo = async (fields, values, conditionFields, conditionValues) => {
    await utils.update(pool, table, fields, values, conditionFields, conditionValues);
}

module.exports = {
    checkExistUser,
    createNewUser,
    getAllUsers,
    getUser,
    updateUserInfo,
}