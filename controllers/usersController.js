const usersService = require("../services/usersService");
const Validation = require("../lib/validation");

const UserValidation = new Validation.UserValidation();

const checkExistUser = async (req, res) => {
    try {
        const { error } = UserValidation.validateCheckingExistUser(req.body);

        if (error) {
            return res.status(400).json({
                error: true,
                message: error.message,
            });
        }

        const existed = await usersService.checkExistUser(req.body);

        return res.status(200).json({
            error: false,
            existed: existed,
            message: existed ? "Số điện thoại đã tồn tại." : "Số điện thoại chưa tồn tại.",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error.message,
        });
    }
}

const createNewUser = async (req, res) => {
    try {
        const { error } = UserValidation.validateCreatingUser(req.body);

        if (error) {
            return res.status(400).json({
                error: true,
                message: error.message,
            });
        }

        if (await usersService.checkExistUser({ phone_number: req.body.phone_number })) {
            return res.status(400).json({
                error: true,
                message: "Số điện thoại đã tồn tại!",
            });
        }

        const resultCreatingNewUser = await usersService.createNewUser(req.body);

        if (!resultCreatingNewUser || resultCreatingNewUser.affectedRows === 0) {
            return res.status(409).json({
                error: true,
                message: "Tạo người dùng mới thất bại.",
            });
        }

        return res.status(201).json({
            error: false,
            message: "Tạo người dùng mới thành công!",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error.message,
        });
    }
}

const getOneUser = async (req, res) => {
    try {
        const result = await usersService.getOneUser({ phone_number: req.user.phone_number });

        return res.status(200).json({
            error: false,
            data: result,
            message: "Lấy dữ liệu thành công!",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error.message,
        });
    }
}

const updateUserInfo = async (req, res) => {
    try {
        const { error } = UserValidation.validateUpdatingUser(req.body);

        if (error) {
            return res.status(400).json({
                error: true,
                message: error.message,
            });
        }

        const resultUpdatingUser = await usersService.updateUserInfo(req.body, { phone_number: req.user.phone_number });

        if (!resultUpdatingUser || resultUpdatingUser.affectedRows <= 0) {
            return res.status(409).json({
                error: true,
                message: "Cập nhật thông tin người dùng thất bại!",
            });
        }

        return res.status(201).json({
            error: false,
            message: "Cập nhật thành công!",
        })
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error,
        });
    }
}

const logout = async (req, res) => {
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
    checkExistUser,
    createNewUser,
    getOneUser,
    updateUserInfo,
    logout,
}
