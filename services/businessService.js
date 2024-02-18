const Business = require("../database/Business");

const getOneBusinessUser = async (fields, values) => {
    return await Business.getOneBusinessUser(fields, values);
}

const updateBusinessUser = async (info, conditions) => {
    return await Business.updateBusinessUser(info, conditions);
}

module.exports = {
	getOneBusinessUser,
	updateBusinessUser,
}