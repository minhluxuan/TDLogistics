const controllerUtils = require("./utils")
const businessService = require ("../services/businessService");
const utils = require("../../utils");

const businessValidation = new controllerUtils.BusinessValidation();

const verifyBusinesUserSuccess = (req, res) => {
	return res.status(200).json({
		error: false,
		valid: true,
		message: "Xác thực thành công."
	});
}

const verifyBusinesUserFail = (req, res) => {
	return res.status(404).json({
		error: true,
		valid: false,
		message: "Xác thực thất bại. Vui lòng đăng nhập hoặc đăng ký.",
	});
}

const getBusinessUser =async (req , res) =>
{
if (req.user.permission == 1) {
  try {
    const { error } = businessValidation.validateFindingBusinessByBusiness(req.query);

    if (error) {
      return res.status(400).json({
        error: true,
        message: "Thông tin không hợp lệ.",
      });
    }

    if (req.user.business_id !== req.query.business_id) {
      return res.status(401).json({
        error: true,
        message: "Bạn không được phép truy cập tài nguyên này.",
      });
    }

    const keys = Object.keys(req.query);
    const values = Object.values(req.query);

    const result = await businessService.getOneBusinessUser (keys, values); 
    return res.status(200).json({
      error: false,
      data: result,
      message: "Lấy thông tin thành công.",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
}
};

const updatePassword = async (req, res) => {
	if (!req.isAuthenticated() || req.user.permission !== 1) {
		return res.status(401).json({
			error: true,
			message: "Bạn không có quyền truy cập tài nguyên này!",
		});
	}

	const { error } = businessValidation.validateUpdatePassword(req.body);

	if (error) {
		return res.status(400).json({
			error: true,
			message: "Thông tin không hợp lệ.",
		});
	}
	
	const hashedNewPassword = utils.hash(req.body.new_password);

	try {
		await businessService.updatePassword(["password", "status"], [hashedNewPassword, 1], ["business_id"], [req.user.business_id]) ;
		
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
  if (!req.isAuthenticated() || req.user.permission < 1) {
      return res.status(401).json({
      error: true,
      message: "Vui lòng đăng nhập.",
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
          message: "Đã xảy ra lỗi. Vui lòng thử lại.",
      });
  }
};


module.exports = {
  getBusinessUser,
  verifyBusinesUserSuccess,
  verifyBusinesUserFail,
  updatePassword,
  logout,
}