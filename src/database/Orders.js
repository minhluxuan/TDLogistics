const mysql = require("mysql2");
const utils = require("./utils");

const dbOptions = {
    host: process.env.HOST,
    port: process.env.DBPOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
};

const table = "orders";

const pool = mysql.createPool(dbOptions).promise();

const checkExitOrder = async (order_id) => {
    const result = await utils.findOne(pool, table, ["order_id"], [order_id]);
    return result.length > 0;
};

const getAllOrders = async () => {
    return await utils.find(pool, table);
};

const getOrder = async (fields, values) => {
    return await utils.find(pool, table, fields, values);
};

const createNewOrder = async (fields, values) => {
    console.log(fields);
    return await utils.insert(pool, table, fields, values);
}

module.exports = {
    checkExitOrder,
    getAllOrders,
    getOrder,
    createNewOrder,
};