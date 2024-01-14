const Complaints = require("../database/Complaints");

const createNewComplaint = async (fields, values) => {
    return await Complaints.createNewComplaint(fields, values);
}

const getComplaints = async (data) => {
    return await Complaints.getComplaints(data);
}

const deleteComplaint = async (fields, values) => {
    return await Complaints.deleteComplaint(fields, values);
}

module.exports = {
    createNewComplaint,
    getComplaints,
    deleteComplaint,
}