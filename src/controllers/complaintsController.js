const moment = require("moment");
const fs = require("fs");
const path = require("path");
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
        let currentTime = new Date();
        currentTime = moment(currentTime).format("YYYY-MM-DD HH:mm:ss");

        const { error } = complaintValidation.validateCreatingComplaint(req.body);

        const files = req.files;
        const img = new Array();

        req.body.time = currentTime;
        req.body.phone_number = req.user.phone_number;
        req.body.status = "open";

        if (files && files.length > 0) {
            files.forEach(file => {
                img.push(file.filename);
            });
            req.body.img = JSON.stringify(img);
        }
        else {
            req.body.img = JSON.stringify(new Array());
        }

        const keys = Object.keys(req.body);
        const values = Object.values(req.body);

        if (error) {
            return res.status(400).json({
                error: true,
                message: "Thông tin không hợp lệ.",
            });
        }

        await complaintsService.createNewComplaint(keys, values);

        if (files && files.length > 0) {
            await Promise.all(files.map(async (file) => {
                const tempFolderPath = path.join("img", "complaints_temp");
                if (!fs.existsSync(tempFolderPath)) {
                    await fs.promises.mkdir(tempFolderPath, {recursive: true});
                }

                const officialFolderPath = path.join("img", "complaints");
                if (!fs.existsSync(officialFolderPath)) {
                    await fs.promises.mkdir(officialFolderPath, {recursive: true});
                }

                const tempFilePath = path.join(tempFolderPath, file.filename);
                const officialFilePath = path.join(officialFolderPath, file.filename);
                
                await fs.promises.rename(tempFilePath, officialFilePath);
            }));
        }

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
