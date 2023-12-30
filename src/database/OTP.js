const mysql = require("mysql2");
const moment = require("moment");
const utils = require("./utils");

const dbOptions = {
    host: "sql12.freemysqlhosting.net",
    port: 3306,
    user: "sql12672558",
    password: "mnsK6vV9Hg",
    database: "sql12672558",
};

const table = "otp";

const pool = mysql.createPool(dbOptions).promise();

const createOTP = async (phoneNumber, email, otp) => {
    var expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() + 59);
    expiration = moment(expiration).format("YYYY-MM-DD HH:mm:ss");

    const query = `INSERT INTO ${table} (email, phone_number, otp, expiration) VALUES (?, ?, ?, ?)`;

    try {
        const result = await pool.query(query, [email, phoneNumber, otp, expiration]);
        console.log("Success! ", result);
    } catch (error) {
        console.error("Error: ", error);
        throw "Lỗi cơ sở dữ liệu. Vui lòng thử lại!";
    }
};

const verifyOTP = async (phoneNumber, otp) => {
    var currentTime = new Date();
    currentTime = moment(currentTime).format("YYYY-MM-DD HH:mm:ss");

    const query = `SELECT * FROM ${table} WHERE phone_number = ? AND otp = ? AND expiration > ?`;

    try {
        const [rows, fields] = await pool.query(query, [phoneNumber, otp, currentTime]);
        
        const isValidOTP = Array.isArray(rows) && rows.length > 0;
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