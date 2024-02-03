const Orders = require("../database/Orders");
const libMap = require("../lib/map");

const checkExistOrder = async (order_id) => {
    return Orders.checkExistOrder(order_id);
};

const getOrdersByUserID = async (user_id, status_code = null) => {
    return await Orders.getOrdersByUserID(user_id, status_code);
}

const getOrderByOrderID = async (order_id) => {
    return await Orders.getOrderByOrderID(order_id);
}

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

const calculateFee = async (address_source, address_dest) => {
    const map = new libMap.Map();

    const addressSource = address_source.split(',');
    const sourceComponent = addressSource.slice(-4).map(part => part.trim());
    const concatSource = sourceComponent.join(', ');
    
    const addressDest = address_dest.split(',');
    const destComponent = addressDest.slice(-4).map(part => part.trim());
    const concatDest = destComponent.join(', ');

    const source = await map.convertAddressToCoordinate(concatSource);
    const destination = await map.convertAddressToCoordinate(concatDest);

    const distance = (await map.calculateDistance(source, destination)).distance;
    const fee = libMap.calculateFee(distance);
    return fee;
}

const getOrderStatus = async (order_id) => {
    return await Orders.getOrderStatus(order_id);
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
    calculateFee,
    getOrderStatus,
};