const mysql = require("mysql2");
const SQLutils = require("../lib/dbUtils");

const dbOptions = {
    host: process.env.HOST,
    port: process.env.DBPOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
};

const table = "complaint";

const pool = mysql.createPool(dbOptions).promise();

const createNewComplaint = async (fields, values) => {
    return await SQLutils.insert(pool, table, fields, values);
};

const getComplaints = async (data) => {
    let whereClause = ``;
    const timeInterval = new Array();

    try {
        if (data.hasOwnProperty("start_time") && data.hasOwnProperty("end_time")) {
            whereClause += `? < time AND time < ? AND `;
            timeInterval.push(data.start_time);
            timeInterval.push(data.end_time);
            delete data.start_time;
            delete data.end_time;
        }
    
        whereClause += `${Object.keys(data).map(field => `${field} = ?`).join(" AND ")}`;
        let values = Object.values(data);
        values = [...timeInterval, ...values];
    
        const query = `SELECT * FROM ${table} WHERE ${whereClause}`;

        const result = await pool.query(query, values);

        return result[0];
    } catch (error) {
        console.log("Error: ", error);
        throw new Error("Đã xảy ra lỗi. Vui lòng thử lại sau ít phút!");
    }
};

const deleteComplaint = async (fields, values) => {
    const result = await SQLutils.deleteOne(pool, table, fields, values);
    return result[0];
};

module.exports = {
    createNewComplaint, 
    getComplaints, 
    deleteComplaint,
};
