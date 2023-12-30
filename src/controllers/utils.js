const crypto = require("crypto");
const usersService = require("../services/usersService");

const hashPhoneNumber = async (phoneNumber) => {
    const hash = crypto.createHash("sha256");
    hash.update(phoneNumber);
    return hash.digest("hex");
}

const isExist = async (fields, values) => {
    try {
        const exist = await usersService.isExist(fields, values);
        return exist;
    } catch (error) {
        console.log("Error: ", error);
        throw new Error("Lỗi cơ sở dữ liệu!");
    }
}

module.exports = {
    isExist,
    hashPhoneNumber,
}