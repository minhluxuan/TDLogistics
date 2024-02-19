const crypto = require("crypto");
const bcrypt = require("bcrypt");

const hashPhoneNumber = async (phoneNumber) => {
    const hash = crypto.createHash("sha256");
    hash.update(phoneNumber);
    return hash.digest("hex");
}

const hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(parseInt(process.env.SALTROUNDS));
    const hashPassword = bcrypt.hashSync(password, salt);
    return hashPassword;
}

module.exports = {
    hashPhoneNumber,
    hashPassword,
}