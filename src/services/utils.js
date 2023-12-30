const OTP = require("../database/OTP");

const isExist = async (fields, values) => {
    try {
        const exist = await Users.isExist(fields, values);
        return exist;
    } catch (error) {
        console.log("Error: ", error);
        throw new Error("Lỗi cơ sở dữ liệu!");
    }
}

const insertDatabase = async (fields, values, table, dbOptions) => {
    try {
        const exist = await OTP.insertDatabase(fields, values, table, dbOptions);
    } catch (error) {
        console.log("Error: ", error);
        throw new Error("Lỗi cơ sở dữ liệu!");
    }
}

module.exports = {
    insertDatabase,
}