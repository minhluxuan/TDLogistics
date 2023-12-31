const Users = require("../database/Users.js");

const checkExistUser = async (phoneNumber) => {
    return await Users.checkExistUser(phoneNumber);
}

const createNewUser = async (newUser) => {
    await Users.createNewUser(newUser);
}

const getAllUsers = async () => {
    return await Users.getAllUsers();
}

const getUser = async (fields, values) => {
    return await Users.getUser(fields, values);
}

const updateUserInfo = async (fields, values, conditionFields, conditionValues) => {
    await Users.updateUserInfo(fields, values, conditionFields, conditionValues);
}

const getSessionID = async (sessionID) => {
 return await Users.getSessionID(sessionID);
};


module.exports = {
    checkExistUser,
    createNewUser,
    getAllUsers,
    getUser,
    updateUserInfo,
    getSessionID,
}
