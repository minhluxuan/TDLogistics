const express = require("express");
const router = express.Router();
const multer = require("multer");
const sizeOf = require("image-size");
// const imageType = require("image-type");

const complaintsController = require("../controllers/complaintsController");
const Auth = require("../lib/auth2");

const storage = multer.diskStorage({
    destination: function (req, file, done) {
        done(null, 'img/complaints_temp');
    },
    filename: function (_req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname);
    },
});

const fileFilter = (req, file, done) => {
    const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
    if (!allowedTypes.includes(file.mimetype)) {
        return done(new Error("Kiểu file không hợp lệ. Chỉ cho phép các file PNG, JPG, JPEG"));
    }

    const maxFileSize = 5 * 1024 * 1024;
    if (file.size > maxFileSize) {
        done(new Error("File có kích thước quá lớn. Tối đa 5MB được cho phép"));
    }
    
    if (file.filename.length > 20) {
        done(new Error("Tên file quá dài. Tối đa 20 ký tự được cho phép."));
    }

    return done(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
});

router.post("/create", Auth.isAuthenticated(1), upload.array("images", 5), complaintsController.createNewComplaint);
router.post("/search", complaintsController.getComplaints);
router.delete("/delete", complaintsController.deleteComplaint);

module.exports = router;