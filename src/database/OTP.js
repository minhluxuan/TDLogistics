const mysql = require("mysql2");
const moment = require("moment");
const utils = require("./utils");

const dbOptions = {
    host: process.env.HOST,
    port: process.env.DBPORT,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
};

const table = "otp";

const pool = mysql.createPool(dbOptions).promise();

const createOTP = async (phoneNumber, otp) => {
    let expires = new Date();
    expires.setMinutes(expires.getMinutes() + 5);
    expires = moment(expires).format("YYYY-MM-DD HH:mm:ss");

    try {
        await utils.insert(pool, table, ["phone_number", "otp", "expires"], [phoneNumber, otp, expiration]);
    } catch (error) {
        console.error("Error: ", error);
        throw "Lỗi cơ sở dữ liệu. Vui lòng thử lại!";
    }
};

const verifyOTP = async (phoneNumber, otp) => {
    let currentTime = new Date();
    currentTime = moment(currentTime).format("YYYY-MM-DD HH:mm:ss");

    const query = `SELECT * FROM ${table} WHERE phone_number = ? AND otp = ? AND expires > ?`;

    try {
        const result = await pool.query(query, [phoneNumber, otp, currentTime]);
        
        const isValidOTP = Array.isArray(result[0]) && result[0].length > 0;
        console.log(isValidOTP ? "Valid OTP" : "Invalid OTP");
        return isValidOTP;
    } catch (error) {
        console.log("Error: ", error);
        throw "Lỗi cơ sở dữ liệu. Vui lòng thử lại!";
    }
}

module.exports = {
    createOTP,
    verifyOTP,
}
