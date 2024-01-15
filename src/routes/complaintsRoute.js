const express = require("express");
const router = express.Router();
const multer = require("multer");
const complaintsController = require("../controllers/complaintsController");

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

router.post("/create", (req, res, next) => {
    let folderName = req.body.phone_number + "_" + Date.now();
    req.body.folderName = folderName;

    const storage = multer.diskStorage({
        destination: function (_req, _file, cb) {
            let dir = "./uploads/" + folderName;
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            cb(null, dir);
        },
        filename: function (_req, file, cb) {
            cb(null, file.originalname);
        },
    });

    const upload = multer({
        storage: storage,
        fileFilter: fileFilter,
    });

    upload.array("image", 12)(req, res, (err) => {
        if (err) {
            // handle error
            console.log("lỗi khi gửi tệp tin");
        } else {
            //req.body.image = folderName;
            complaintsController.createNewComplaint(req, res, next);
        }
    });
});
router.post("/search", complaintsController.getComplaints);
router.delete("/delete", complaintsController.deleteComplaint);

module.exports = router;
