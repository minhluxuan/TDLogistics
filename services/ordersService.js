const Orders = require("../database/Orders");

const checkExistOrder = async (order_id) => {
    return Orders.checkExistOrder(order_id);
};

const getAllOrders = async () => {
    return await Orders.getAllOrders();
};

const getOrder = async (data) => {
    return await Orders.getOrder(data);
};

const updateOrder = async (fields, values, conditionFields, conditionValues) => {
    return await Orders.updateOrder(fields, values, conditionFields, conditionValues);
};

const createNewOrder = async (newOrder) => {
    return await Orders.createNewOrder(newOrder);
}

const cancelOrder = async (fields, values)=> {
    return await Orders.cancelOrder(fields, values);
};

const getDistrictPostalCode = async (district, province) => {
    return await Orders.getDistrictPostalCode(district, province);
}

const getProvincePostalCode = async (province) => {
    return await Orders.getProvincePostalCode(province);
}

const findingManagedAgency = async (ward, district, province) => {
    return await Orders.findingManagedAgency(ward, district, province);
}

const createOrderInAgencyTable = async (newOrder, postalcode) => {
    return await Orders.createOrderInAgencyTable(newOrder, postalcode);
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