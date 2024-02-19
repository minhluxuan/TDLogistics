const businessService = require ("../services/businessService");
const Validation = require("../lib/Validation2");
const Hash = require("../lib/Hash2");

const businessValidation = new Validation.BusinessValidation();

const getOneBusinessUser = async (req , res) => {
	try {
		const resultGettingOneBusiness = await businessService.getOneBusinessUser({ business_id: req.user.business_id });
		
		if (!resultGettingOneBusiness || resultGettingOneBusiness.length <= 0) {
			return res.status(404).json({
				error: true,
				message: `Khách hàng doanh nghiệp có mã khách hàng ${req.user.business_id} chưa tồn tại.`,
			});
		}
		
		delete resultGettingOneBusiness[0].password;

		return res.status(200).json({
			error: false,
			data: resultGettingOneBusiness,
			message: "Lấy thông tin thành công.",
		});
	} catch (error) {
		return res.status(500).json({
			error: true,
			message: error.message,
		});
	}
};

const updatePassword = async (req, res) => {
	try {
		const { error } = businessValidation.validateUpdatePassword(req.body);

		if (error) {
			return res.status(400).json({
				error: true,
				message: error.message,
			});
		}
	
		const updatedInfo = new Object({
			password: Hash.hashPassword(req.body.new_password),
			active: true,
		});
		
		const resultUpdatingPassword = await businessService.updateBusinessUser(updatedInfo, { business_id: req.user.business_id });
		
		if (!resultUpdatingPassword || resultUpdatingPassword.affectedRows <= 0) {
			return res.status(404).json({
				error: true,
				message: `Khách hàng doanh nghiệp có mã doanh nghiệp ${req.user.business_id} không tồn tại.`,
			});
		}

		req.user.active = true;

		return res.status(200).json({
			error: false,
			message: "Cập nhật mật khẩu thành công.",
		});
	} catch (error) {
		res.status(500).json({
			error: true,
			message: error.message,
		});
	}
}

const logout = async (req, res) => {
	if (!req.isAuthenticated() || req.user.permission !== 1) {
		return res.status(401).json({
			error: true,
			message: "Bạn không được phép truy cập tài nguyên này.",
		});
	}

	try {
		res.clearCookie("connect.sid");

		req.logout(() => {
			req.session.destroy();
		});

		res.status(200).json({
			error: false,
			message: "Đăng xuất thành công.",
		});
	} catch (error) {
		res.status(500).json({
			status: "error",
			message: error.message,
		});
	}
};


module.exports = {
	getOneBusinessUser,
	updatePassword,
	logout,
}