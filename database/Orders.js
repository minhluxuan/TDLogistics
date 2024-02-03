const mysql = require("mysql2");
const moment = require("moment");
const SQLutils = require("../lib/dbUtils");
const libMap = require("../lib/map");
const { query } = require("express");
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

const getOrdersByUserID = async (user_id, status_code = null) => {
    let conditionFields = ["user_id"];
    let conditionValues = [user_id];
    if(status_code !== null) {
        conditionFields.push("status_code");
        conditionValues.push(status_code);
    }

    const rows = await SQLutils.find(pool, table, conditionFields, conditionValues);
    const orders = rows.map(row => ({
        order_id: rows[0].order_id,
        name_sender: rows[0].name_sender,
        phone_sender: rows[0].phone_sender,
        name_reciever: rows[0].name_reciever,
        phone_reciever: rows[0].phone_reciever,
        order_time: rows[0].order_time
    }));
    return orders;
}

const getOrderByOrderID = async (order_id) => {
    const [row] = await SQLutils.findOne(pool, table, ["order_id"], [order_id]);
    const {status_message} = await getOrderStatus(row.order_id);
    
    const Order = new Object ({
        order_id: row.order_id,
        name_sender: row.name_sender,
        phone_sender: row.phone_sender,
        name_reciever: row.name_reciever,
        phone_reciever: row.phone_reciever,
        order_time: row.order_time,
        mass: row.mass,
        height: row.height,
        width: row.width,
        length: row.length,	
        address_source: row.address_source,	
        address_dest: row.address_dest,	
        fee: row.fee,
        COD: row.COD,
        express_type: (row.express_type === 1 ? "Giao hàng tiêu chuẩn" : "Giao hàng nhanh"),	
        status_message: status_message
    });
    return Order;
}

// const getAllOrders = async () => {
//     return await SQLutils.find(pool, table);
// };

// const getOrder = async (data) => {
//     let whereClause = ``;

//     const timeInterval = new Array();

//     if (data.hasOwnProperty("start_order_time") && !data.hasOwnProperty("end_order_time") || !data.hasOwnProperty("start_order_time") && data.hasOwnProperty("end_order_time") || data.start_order_time > data.end_order_time) {
//         throw new Error("Thông tin không hợp lệ.");
//     }
//     else if (data.hasOwnProperty("start_order_time") && data.hasOwnProperty("end_order_time")) {
//         whereClause += `? <= order_time AND order_time <= ? AND `;
//         timeInterval.push(data.start_order_time);
//         timeInterval.push(data.end_order_time);
//         delete data["start_order_time"];
//         delete data["end_order_time"];
//     }

//     whereClause += `${Object.keys(data).map(field => `${field} = ?`).join(" AND ")}`;
//     let values = Object.values(data);
//     values = [...timeInterval, ...values];

//     const query = `SELECT order_id, user_id, order_time, mass, height, width, length, long_source, lat_source, long_destination, lat_destination, address_source, address_destination, fee, COD, status_code FROM ${table} WHERE ${whereClause}`;

//     const result = await pool.query(query, values);

//     return result[0];
// };

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

const getOrderStatus = async (order_id) => {

    const ordersTable = "orders";
    const agencyTable = "agency";
    const statusQuery = `SELECT journey, status_code FROM ${ordersTable} WHERE order_id = ?`;
    const [row] = await pool.query(statusQuery, [order_id]);

    if(row.length <= 0) {
        throw new Error("Không tồn tại đơn hàng!");
    }

    const { status_code, journey } = row[0];
    const journeyArray = JSON.parse(journey);
    const lastJourney = journeyArray[journeyArray.length - 1];
    const locationCoordinate = JSON.parse(lastJourney.location);
    const [latitude, longitude] = locationCoordinate;
    const timeInterval = lastJourney.date;

    let agencyName;
    let statusMessage = timeInterval + ": ";
    const agencyQuery = `SELECT agency_name FROM ${agencyTable} WHERE latitude = ? AND longitude = ?`;

    switch (status_code) {
        case 1:
            statusMessage = statusMessage + "Giao hàng thành công";
            break;
        case 2:
            try {
                const [agency] = await pool.query(agencyQuery, [latitude, longitude]);
                agencyName = agency[0].agency_name;
                statusMessage = statusMessage + "Đang được xử lí bởi " + agencyName;
                break;
            } catch (error) {
                throw new Error ("Không tìm thấy bưu cục");
            }
            
        case 3:
            statusMessage = statusMessage + "Chờ lấy hàng";
            break;
        case 4:
            try {
                const [agency] = await pool.query(agencyQuery, [latitude, longitude]);
                agencyName = agency[0].agency_name;
                statusMessage = statusMessage + "Đã tới bưu cục " + agencyName;
                break;
            } catch (error) {
                throw new Error ("Không tìm thấy bưu cục");
            }
        case 5:
            try {
                const [agency] = await pool.query(agencyQuery, [latitude, longitude]);
                agencyName = agency[0].agency_name;
                statusMessage = statusMessage + "Đã rời bưu cục " + agencyName;
                break;
            } catch (error) {
                throw new Error ("Không tìm thấy bưu cục");
            }
        case 6:
            statusMessage = statusMessage + "Đang giao tới người nhận";
            break;
        case 7:
            statusMessage = statusMessage + "Lấy hàng thất bại";
            break;
        case 8:
            statusMessage = statusMessage + "Giao hàng thất bại";
            break;
        case 9:
            statusMessage = statusMessage + "Đang hoàn hàng";
            break;
        case 10:
            statusMessage = statusMessage + "Hoàn hàng thành công";
            break;
        case 11:
            try {
                const [agency] = await pool.query(agencyQuery, [latitude, longitude]);
                agencyName = agency[0].agency_name;
                statusMessage = statusMessage + "Hoàn hàng thất bại, kiện hàng đang ở " + agencyName;
                break;
            } catch (error) {
                throw new Error ("Không tìm thấy bưu cục");
            }
        case 12:
            statusMessage = statusMessage + "Đã hủy yêu cầu vận chuyển";
            break;
        default:
            throw new Error ("Trạng thái không xác định");
    }
    return {
        status_code: status_code,
        status_message: statusMessage
    }
    

    
}

module.exports = {
    checkExistOrder,
    getOrdersByUserID,
    getOrderByOrderID,
    createNewOrder,
    updateOrder,
    cancelOrder,
    getDistrictPostalCode,
    getProvincePostalCode,
    findingManagedAgency,
    createOrderInAgencyTable,
    getOrderStatus,
};