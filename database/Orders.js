const mysql = require("mysql2");
const moment = require("moment");
const SQLutils = require("../lib/dbUtils");
const libMap = require("../lib/map");
const dbOptions = {
    host: process.env.HOST,
    port: process.env.DBPOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
};

const table = "orders";

const pool = mysql.createPool(dbOptions).promise();

const checkExistOrder = async (order_id) => {
    const result = await SQLutils.findOne(pool, table, ["order_id"], [order_id]);
    return result.length > 0;
};

const getAllOrders = async () => {
    return await SQLutils.find(pool, table);
};

const getOrder = async (data) => {
    let whereClause = ``;

    const timeInterval = new Array();

    if (data.hasOwnProperty("start_order_time") && !data.hasOwnProperty("end_order_time") || !data.hasOwnProperty("start_order_time") && data.hasOwnProperty("end_order_time") || data.start_order_time > data.end_order_time) {
        throw new Error("Thông tin không hợp lệ.");
    }
    else if (data.hasOwnProperty("start_order_time") && data.hasOwnProperty("end_order_time")) {
        whereClause += `? <= order_time AND order_time <= ? AND `;
        timeInterval.push(data.start_order_time);
        timeInterval.push(data.end_order_time);
        delete data["start_order_time"];
        delete data["end_order_time"];
    }

    whereClause += `${Object.keys(data).map(field => `${field} = ?`).join(" AND ")}`;
    let values = Object.values(data);
    values = [...timeInterval, ...values];

    const query = `SELECT order_id, user_id, order_time, mass, height, width, length, long_source, lat_source, long_destination, lat_destination, address_source, address_destination, fee, COD, status_code FROM ${table} WHERE ${whereClause}`;

    const result = await pool.query(query, values);

    return result[0];
};

const createNewOrder = async (newOrder) => {
    return await SQLutils.insert(pool, table, Object.keys(newOrder), Object.values(newOrder));
}

const updateOrder = async (fields, values, conditionFields, conditionValues) => {
    const currentTime = new Date();
    currentTime.setMinutes(currentTime.getMinutes() - 30);
    const formattedTime = moment(currentTime).format("YYYY-MM-DD HH:mm:ss");
    
    const setClause = `${fields.map(field => `${field} = ?`).join(", ")}`;
    const whereClause = `${conditionFields.map(field => `${field} = ?`).join(" AND ")} AND order_time > ?`;

    const query = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;

    const result = await pool.query(query, [...values, ...conditionValues, formattedTime]);
    return result[0];
};

const cancelOrder = async (fields, values) => {
    const currentTime = new Date();
    currentTime.setMinutes(currentTime.getMinutes() - 30);
    const formattedTime = moment(currentTime).format("YYYY-MM-DD HH:mm:ss");
    const whereClause = `${fields.map(field => `${field} = ?`).join(" AND ")} AND order_time > ?`;
    const query = `DELETE FROM ${table} WHERE ${whereClause}`;
    
    const result = await pool.query(query, [...values, formattedTime]);
    return result[0];
};

const getDistrictPostalCode = async (district, province) => {
    
    const table = "district";
    const query = `SELECT postal_code FROM ${table} WHERE district = ? AND province = ?`;
    const result = await pool.query(query, [district, province]);
    return result[0][0].postal_code;
}


const getProvincePostalCode = async (province) => {
    const table = "province";
    const query = `SELECT postal_code FROM ${table} WHERE province = ?`;
    const result = await pool.query(query, [province]);
    return result[0][0].postal_code;
}

// SELECT COUNT(*) as table_exists
// FROM information_schema.tables
// WHERE table_schema = 'tdlogistics'
// AND table_name = 'agency';

const findingManagedAgency = async (ward, district, province) => {

    const postal_code = await getDistrictPostalCode(district, province);
    if(!postal_code) {
        throw new Error("Không tìm thấy mã bưu chính!");
    } 
    const agencyTable = postal_code + "_orders";
    const checkAgencyExistQuery = `
                SELECT COUNT(*) as table_exists
                FROM information_schema.tables
                WHERE table_schema = ?
                AND table_name = ?;`
    const checkAgencyExist = await pool.query(checkAgencyExistQuery, [process.env.DATABASE, agencyTable]);
    if(checkAgencyExist[0][0].table_exists === 0) {
        throw new Error("Không tồn tại bưu cục tại quận/huyện!");
    }

    const table = "ward";
    const query = `SELECT agency_id FROM ${table} WHERE ward = ? AND district = ? AND province = ?`;
    const result = await pool.query(query, [ward, district, province]);
    console.log(result[0][0].agency_id);
    if(!result[0][0].agency_id) {
        throw new Error("Không tồn tại bưu cục tại xã/thị trấn!");
    }
    return {
        agency_id: result[0][0].agency_id,
        postal_code: postal_code
    }
}

const createOrderInAgencyTable = async (newOrder, postal_code) => {
    const agencyTable = postal_code + "_orders";
    return await SQLutils.insert(pool, agencyTable, Object.keys(newOrder), Object.values(newOrder));
}

module.exports = {
    checkExistOrder,
    getAllOrders,
    getOrder,
    createNewOrder,
    updateOrder,
    cancelOrder,
    getDistrictPostalCode,
    getProvincePostalCode,
    findingManagedAgency,
    createOrderInAgencyTable,
};