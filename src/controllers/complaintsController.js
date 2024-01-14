const moment = require("moment");
const complaintsService = require("../services/complaintsService");
const utils = require("./utils");

const complaintValidation = new utils.ComplaintValidation();

const createNewComplaint = async (req, res) => {
    if (!req.isAuthenticated() || req.user.permission !== 1) {
		return res.status(401).json({
			error: true,
			message: "Bạn không được phép truy cập tài nguyên này.",
		});
    }

    try {
        const { error } = complaintValidation.validateCreatingComplaint(req.body);

        let currentTime = new Date();
        currentTime = moment(currentTime).format("YYYY-MM-DD HH:mm:ss");

        req.body.time = currentTime;
        req.body.phone_number = req.user.phone_number;
        req.body.status = "open";
        
        const keys = Object.keys(req.body);
        const values = Object.values(req.body);

        if (error) {
            return res.status(400).json({
                error: true,
                message: "Thông tin không hợp lệ.",
            });
        }

        await complaintsService.createNewComplaint(keys, values);

		return res.status(201).json({
            error: false,
            message: "Thêm thành công.",
        });
    } catch (error) {
      	res.status(500).json({
            error: true,
            message: error.message,
        });
    }
};

const getComplaints = async (req, res) => {
    if (!req.isAuthenticated() || req.user.permission !== 1) {
        return res.status(401).json({
            error: true,
            message: "Bạn không được phép truy cập tài nguyên này.",
        });
    }

    try {
        const { error } = complaintValidation.validateFindingComplaint(req.body);

        if (error) {
            return res.status(400).json({
                error: true,
                message: "Thông tin không hợp lệ.",
            });
        }

        if (req.body.hasOwnProperty("start_time") && !req.body.hasOwnProperty("end_time") || !req.body.hasOwnProperty("start_time") && req.body.hasOwnProperty("end_time") || req.body.start_time > req.body.end_time) {
            throw new Error("Thông tin không hợp lệ.");
        }

        req.body.phone_number = req.user.phone_number;

        const result = await complaintsService.getComplaints(req.body);

        return res.status(200).json({
            error: false,
            data: result,
            message: "Lấy thông tin thành công.",
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message,
        });
    }
};

const deleteComplaint = async (req, res) => {
    if (!req.isAuthenticated() || req.user.permission !== 1) {
        return res.status(401).json({
            error: true,
            message: "Bạn không được phép truy cập tài nguyên này.",
        });
    }

    try {
        const result = await complaintsService.deleteComplaint(["id", "phone_number"], [req.query.id, req.user.phone_number]);

        if (result.affectedRows <= 0) {
            return res.status(404).json({
                error: true,
                message: "Khiếu nại đã quá hạn để xóa hoặc không tồn tại.",
            });
        }

        res.status(200).json({
            error: false,
            message: "Xóa khiếu nại thành công.",
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message,
        });
    }
};

module.exports = {
    createNewComplaint,
    getComplaints,
    deleteComplaint,
}
