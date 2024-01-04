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

const getOneUser = async (fields, values) => {
    return Users.getOneUser(fields, values);
}

const getUser = async (fields, values) => {
    return await Users.getUser(fields, values);
}

const updateUserInfo = async (fields, values, conditionFields, conditionValues) => {
    await Users.updateUserInfo(fields, values, conditionFields, conditionValues);
}

const checkExistSession = async (sessionId) => {
 return await Users.checkExistSession(sessionId);
};


module.exports = {
    checkExistUser,
    createNewUser,
    getAllUsers,
    getOneUser,
    getUser,
    updateUserInfo,
    checkExistSession,
}
