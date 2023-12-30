const crypto = require("crypto");

const hashPhoneNumber = async (phoneNumber) => {
    const hash = crypto.createHash("sha256");
    hash.update(phoneNumber);
    return hash.digest("hex");
}


module.exports = {
    hashPhoneNumber,
}