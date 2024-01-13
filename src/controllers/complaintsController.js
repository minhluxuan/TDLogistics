const complaintsService = require("../services/complaintsService");
const { CustomerUserRequestValidation, extractRequiredFields, extractFields } = require("./utils");
const dotenv = require("dotenv").config({ path: "../../.env" });

/*
TODO: POST
req.params:  /complaints
req.body:
{
  "phone_number": "0935202824",
  "complaint_type": "Application",
  "complaint_description": "ABC",
  "datetime": "2022-12-31 23:59:59",
  "status": "Open"
  *file //handle in route
}
or:
{
  "user": {
    "phone_number": "0923328923"
    *other properties...
  },
  "complaint_type": "Application",
  "complaint_description": "ABC",
  "datetime": "2022-12-31 23:59:59",
  "status": "Open"
  *file //handle in route
}

TODO: GET
req.params:
/complaints?status=____&type=____&phone_number=____&startdate=____&enddate=____
/complaints  => get all complaints
req.body: null

TODO: PATCH
req.params: complaints/id
req.body:
{
  "status" = "Closed",
}

TODO: DELETE:
req.params: complaints/id
req.body: null
*/

const createComplaint = async (req, res) => {
  // TODO: check cookie and authorization
  // NEED further disscussion about the req.user.permission
  if (!req.isAuthenticated() || req.user.permission < 1) {
    return res.status(401).json({
      error: true,
      message: "Bạn không được phép truy cập tài nguyên này.",
    });
  }
  // End of authorize
  try {
    const phone_number = req.body.user.phone_number;
    let requiredFields = [];
    if (!phone_number) {
      requiredFields = ["phone_number", "complaint_type", "complaint_description", "datetime", "status"];
    } else {
      requiredFields = ["complaint_type", "complaint_description", "datetime", "status"];
    }
    const [fields, values] = extractRequiredFields(req.body, requiredFields);
    const result = await complaintsService.createComplaint(fields, values);
    res.status(201).json(result); // for fixing bugs, will change to messege later
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

const getComplaints = async (req, res) => {
  // TODO: check cookie and authorization
  if (!req.isAuthenticated() || req.user.permission < 1) {
    return res.status(401).json({
      error: true,
      message: "Bạn không được phép truy cập tài nguyên này.",
    });
  }
  // End of authorize

  //TODO: get query and id params
  const extractFields = ["status", "type", "phone_number", "startDate", "endDate"];
  const [fields, values] = extractFields(req.query, extractFields);

  try {
    const result = fields.length
      ? await complaintsService.getComplaints(fields, values)
      : await complaintsService.getAllComplaints();

    res.status(200).json(result); // for fixing bugs, will change to messege later
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

const updateComplaint = async (req, res) => {
  // TODO: check cookie and authorization
  if (!req.isAuthenticated() || req.user.permission < 1) {
    return res.status(401).json({
      error: true,
      message: "Bạn không được phép truy cập tài nguyên này.",
    });
  }
  // End of authorize
  const id = req.params.id;
  const reqiredField = ["status"];
  const [field, value] = extractRequiredFields(req.body, reqiredField);
  try {
    const result = await complaintsService.updateComplaint(value, [id]);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

const deleteComplaint = async (req, res) => {
  // TODO: check cookie and authorization
  if (!req.isAuthenticated() || req.user.permission < 1) {
    return res.status(401).json({
      error: true,
      message: "Bạn không được phép truy cập tài nguyên này.",
    });
  }
  // End of authorize
  const id = req.params.id;
  try {
    const result = await complaintsService.deleteComplaint(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};
