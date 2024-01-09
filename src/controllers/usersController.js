const usersService = require("../services/usersService");
const dotenv = require("dotenv").config({ path: "../../.env" });

const REGEX_NAME = new RegExp(process.env.REGEX_NAME);
const REGEX_EMAIL = new RegExp(process.env.REGEX_EMAIL);
const REGEX_PHONE_NUMBER = new RegExp(process.env.REGEX_PHONE_NUMBER);

const checkExistUser = async (req, res) => {
    try {
        const existed = await usersService.checkExistUser(req.body["phone_number"]);
        return res.status(200).json({
            error: false,
            existed: existed,
            message: existed ? "Số điện thoại đã tồn tại." : "Số điện thoại chưa tồn tại.",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error,
        });
    }
}

const createNewUser = async (req, res) => {
    if (!req.isAuthenticated() || req.user.permission < 1) {
        return res.status(401).json({
            error: true,
            message: "Bạn không được phép truy cập tài nguyên này.",
        });
    }

    const { fullname, email, phone_number } = req.body;

    if (!REGEX_NAME.test(fullname.toLowerCase()) || !REGEX_EMAIL.test(email) || !REGEX_PHONE_NUMBER.test(phone_number) || phone_number !== req.user.phone_number) {
        return res.status(400).json({
            error: true,
            message: "Thông tin đăng ký không hợp lệ!",
        });
    }

    if (await usersService.checkExistUser(phone_number)) {
        return res.status(400).json({
            error: true,
            message: "Số điện thoại đã tồn tại!",
        });
    }

    try {
        const newUser = {
            fullname: fullname,
            email: email,
            phoneNumber: phone_number,
        }

        await usersService.createNewUser(newUser);

        const user = await usersService.getOneUser(["phone"], [req.user.phone_number]);

        if (user.length == 0) {
            return res.status(500).json({
                error: true,
                message: "Đã xảy ra lỗi. Vui lòng thử lại.",
            });
        }

        req.user.user_id = user[0]["user_id"];

        return res.status(200).json({
            error: false,
            message: "Thêm thành công!",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error,
        });
    }
}

const getAllUsers = async (req, res) => {
    if (!req.isAuthenticated() || req.user.permission < 1) {
        return res.status(401).json({
            error: true,
            message: "Bạn không được phép truy cập tài nguyên này.",
        });
    }

    try {
        const users = await usersService.getAllUsers();
        res.json({
            error: false,
            data: users,
            message: "Lấy thông tin thành công!",
        });
    } catch (error) {
        console.error('Error: ', error);
        res.status(500).json({
            error: true,
            message: "Lỗi hệ thống. Vui lòng thử lại!"
        });
    }
}

const getUser = async (req, res) => {
    if (!req.isAuthenticated() || req.user.permission < 1) {
        return res.status(401).json({
            error: true,
            message: "Bạn không được phép truy cập tài nguyên này.",
        });
    }

    const keys = new Array();
    const values = new Array();

    for (const key in req.query) {
        if (req.query.hasOwnProperty(key) && req.query[key] !== null && req.query[key] !== undefined && req.query[key] != "") {
            keys.push(key);
            values.push(req.query[key]);
        }
    }

    if (keys.length < 0) {
        return res.status(400).json({
            error: true,
            message: "Vui lòng không để trống tất cả các trường!",
        });
    }

    try {
        const result = await usersService.getUser(keys, values);

        return res.status(200).json({
            error: false,
            data: result,
            message: "Lấy dữ liệu thành công!",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error,
        });
    }
}

const updateUserInfo = async (req, res) => {
    if (!req.isAuthenticated() || req.user.permission < 1) {
        return res.status(401).json({
            error: true,
            message: "Bạn không được phép truy cập tài nguyên này.",
        });
    }

    if (!req.body.hasOwnProperty("phone_number") || !req.body["phone_number"] || !REGEX_PHONE_NUMBER.test(req.body["phone_number"]) || req.body["phone_number"] !== req.user.phone_number) {
        console.log("Phone number cannot be empty!");
        return res.status(400).json({
            error: true,
            message: "Số điện thoại không hợp lệ!",
        });
    }

    const keys = new Array();
    const values = new Array();

    for (let key in req.body) {
        if (req.body.hasOwnProperty(key)) {
            if (key === "fullname") {
                if (REGEX_NAME.test(req.body[key].toLowerCase())) {
                    keys.push(key);
                    values.push(req.body[key]);
                }
                else {
                    console.log("Error: Fullname does not valid!");
                    return res.status(400).json({
                        error: true,
                        message: "Họ và tên không hợp lệ.",
                    });
                }
            }
            else if (key === "email") {
                if (REGEX_EMAIL.test(req.body[key])) {
                    keys.push(key);
                    values.push(req.body[key]);
                }
                else {
                    console.log("Error: Email does not valid!");
                    return res.status(400).json({
                        error: true,
                        message: "Email không hợp lệ.",
                    });
                }
            }
            else if (key === "avatar") {
                
            }
        }
    }

    try {
        await usersService.updateUserInfo(keys, values, ["phone"], [req.body["phone_number"]]);
        return res.status(200).json({
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
    checkExistUser,
    createNewUser,
    getAllUsers,
    getUser,
    updateUserInfo,
    logout,
}
