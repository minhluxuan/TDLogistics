const database = require("../database/Complaints");

const createComplaint = async (fields, values) => {
  return await database.createComplaint(fields, values);
};

const getAllComplaints = async () => {
  return await database.getAllComplaints();
};

const getComplaint = async (fields, values) => {
  return await database.getComplaint(fields, values);
};

const updateComplaint = async (statusValue, id) => {
  return await database.updateComplaint(statusValue, id);
};

const deleteComplaint = async (id) => {
  return await database.deleteComplaint(id);
};

module.exports = { createComplaint, getAllComplaints, getComplaint, updateComplaint, deleteComplaint };
