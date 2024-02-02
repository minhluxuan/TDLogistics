const moment = require("moment");
const ordersService = require("../services/ordersService");
const Validation = require("../lib/validation");
const libMap = require("../lib/map");

const OrderValidation = new Validation.OrderValidation();

const checkExistOrder = async (req, res) => {
    try {
        const existed = await ordersService.checkExistOrder(req.query.order_id);
        return res.status(200).json({
            error: false, 
            existed: existed,
            message: existed ? "Đơn hàng đã tồn tại." : "Đơn hàng không tồn tại.",
        }); 
    }
    catch (error) {
        return res.status(500).json({
            error: true,
            message: error,
        });
    }
}

const getOrder = async (req, res) => {
    if(!req.isAuthenticated() || req.user.permission !== 1) {
        return res.status(401).json({
            error: true,
            message: "Bạn không được phép truy cập tài nguyên này.",
        });
    }

    const { error } = OrderValidation.validateFindingOrder(req.body);

    if (error) {
        return res.status(400).json({
            error: true,
            message: "Thông tin không hợp lệ!",
        });
    }

    req.body.user_id = req.user.user_id;
    
    if (req.query.order_id) {
        req.body.order_id = req.query.order_id;
    }

    try {
        const orders = await ordersService.getOrder(req.body);
        return res.status(200).json({
            error: false,
            data: orders,
            message: "Lấy thông tin đơn hàng thành công!",
        }); 
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error,
        });
    }
}

const calculateFee = async (req, res) => {
    // if(!req.isAuthenticated() || req.user.permission !== 1) {
    //     return res.status(401).json({
    //         error: true,
    //         message: "Bạn không được phép truy cập tài nguyên này.",
    //     });
    // }

    try {
        // const { error } = OrderValidation.validateCreatingOrder(req.body);

        // if (error) {
        //     return res.status(400).json({
        //         error: true,
        //         //message: "Thông tin không hợp lệ!",
        //         message: error.message,
        //     });
        // }

        const map = new libMap.Map();
        const source = {
            lat: req.body.lat_source,
            long: req.body.long_source,
        };

        const destination = {
            lat: req.body.lat_destination,
            long: req.body.long_destination,
        };
        const distance = (await map.calculateDistance(source, destination)).distance;
        const fee = libMap.calculateFee(distance);
        return res.status(200).json({
            error: false,
            fee: fee
        });

    } catch(error) {
        return res.status(500).json({
            error: true,
            message: error.message,
        });
    }
}

const createNewOrder = async (req, res) => {
    // if(!req.isAuthenticated() || req.user.permisson < 1) {
    //     return res.status(401).json({
    //         error: true,
    //         message: "Bạn không được phép truy cập tài nguyên này.",
    //     });
    // }

    try {
        //const OrderValidation = new Validation.OrderValidation();
        const { error } = OrderValidation.validateCreatingOrder(req.body);

        if (error) {
            return res.status(400).json({
                error: true,
                message: "Thông tin không hợp lệ!",
                message1: error.message,
            });
        }
        

        const addressSource = req.body.address_source.split(',');
        const provinceSource = addressSource[addressSource.length - 2].trimLeft(); //delete leading space
        const districtSource = addressSource[addressSource.length - 3].trimLeft();
        const wardSource = addressSource[addressSource.length - 4].trimLeft();
        
        

        const { agency_id: managedAgency, postal_code } = await ordersService.findingManagedAgency(wardSource, districtSource, provinceSource);
        

        const orderTime = new Date();
        const formattedOrderTime = moment(orderTime).format("YYYY-MM-DD HH:mm:ss");
        const orderId = "TD" + orderTime.getFullYear().toString() + orderTime.getMonth().toString() + orderTime.getDay().toString() + orderTime.getHours().toString() + orderTime.getMinutes().toString() + orderTime.getSeconds().toString() + orderTime.getMilliseconds().toString();



        const newOrder = new Object({
            //user_id: req.user.user_id || null,
            user_id: "00000001",
            order_id: orderId,
            name_sender: req.body.name_sender,
            phone_sender: req.body.phone_sender,
            name_reciever: req.body.name_reciever,	
            phone_reciever: req.body.phone_reciever,
            order_time: orderTime,
            mass: req.body.mass,
            height: req.body.height,
            width: req.body.width,
            length: req.body.length,
            coordinate_source: JSON.stringify([req.body.long_source, req.body.lat_source]),	
            address_source: req.body.address_source,	
            coordinate_dest: JSON.stringify([req.body.long_destination, req.body.lat_destination]),	 	
            address_dest:req.body.address_dest,	
            fee: req.body.fee,
            COD: req.body.COD,
            express_type: req.body.express_type
        });

        await ordersService.createOrderInAgencyTable(newOrder, postal_code);
        const result = await ordersService.createNewOrder(newOrder);
        
        return res.status(200).json({
            error: false,
            data: result[0],
            message: "Tạo đơn hàng thành công.",
        });
    } catch (error) {

        if(error.message === "Không tìm thấy mã bưu chính!") {
            return res.status(404).json({
                error: true,
                message: error.message,
            });
        }
        else if(error.message === "Không tồn tại bưu cục tại quận/huyện!") {
            return res.status(404).json({
                error: true,
                message: error.message,
            });
        }
        else if(error.message === "Không tồn tại bưu cục tại xã/thị trấn!") {
            return res.status(404).json({
                error: true,
                message: error.message,
            });
        }
        return res.status(500).json({
            error: true,
            message: error.message,
        });
    }
}

const updateOrder = async (req, res) => {
    if (!req.isAuthenticated() || req.user.permission !== 1) {
        return res.status(401).json({
            error: true,
            message: "Bạn không được phép truy cập tài nguyên này.",
        });
    }
    
    const orderId = req.query.order_id;

    if (orderId === undefined || orderId === null || orderId === "") {
        return res.status(400).json({
            error: true,
            message: "Mã đơn hàng không tồn tại.",
        });
    }

    const { error } = OrderValidation.validateUpdatingOrder(req.body);
    
    if (error) {
        return res.status(400).json({
            error: true,
            message: "Thông tin không hợp lệ.",
        });
    }

    const fields = Object.keys(req.body);
    const values = Object.values(req.body);

    const conditionFields = ["order_id", "user_id"];
    const conditionValues = [orderId, req.user.user_id];

    try {
        const result = await ordersService.updateOrder(fields, values, conditionFields, conditionValues);

        if (result.affectedRows <= 0) {
            return res.status(404).json({
                error: true,
                message: "Đơn hàng đã quá hạn để cập nhật hoặc không tồn tại."
            });
        }

        const updatedRow = (await ordersService.getOrder({ order_id: orderId }))[0];

        const source = {
            lat: updatedRow["lat_source"],
            long: updatedRow["long_source"]
        };

        const destination = {
            lat: updatedRow["lat_destination"],
            long: updatedRow["long_destination"]
        };

        const map = new libMap.Map();

        const distance = (await map.calculateDistance(source, destination)).distance;

        const updatingFee = libMap.calculateFee(distance);

        const updatingAddressSource = await map.convertCoordinateToAddress(source);
        const updatingAddressDestination = await map.convertCoordinateToAddress(destination);

        await ordersService.updateOrder(["fee", "address_source", "address_destination"], [updatingFee, updatingAddressSource, updatingAddressDestination], ["order_id"], [orderId]);

        return res.status(200).json({
            error: false,
            message: "Cập nhật thành công.",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error,
        });
    }
};

const cancelOrder = async (req, res) => {
    if (!req.isAuthenticated() || req.user.permission !== 1) {
        return res.status(401).json({
            error: true,
            message: "Bạn không được phép truy cập tài nguyên này.",
        });
    }

    const orderId = req.query.order_id;

   //const { error } = (new Validation.OrderValidation({ order_id: orderId })).validateCancelingOrder();
    const { error } = OrderValidation.validateCancelingOrder({ order_id: orderId });

    if (error) {
        return res.status(401).json({
            error: true,
            message: "Mã đơn hàng không tồn tại.",
        });
    }

    const conditionFields = ["user_id", "order_id"];
    const conditionValues = [req.user.user_id, orderId];

    try {
        const result = await ordersService.updateOrder(["status_code"], [7], conditionFields, conditionValues);

        if (result.affectedRows <= 0) {
            return res.status(404).json({
                error: true,
                message: `Đơn hàng ${orderId} quá hạn để hủy hoặc không tồn tại.`,
            });
        }

        res.status(200).json({
            error: false,
            message: `Hủy đơn hàng ${orderId} thành công.`,
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error,
        });
    }
};

module.exports = {
    checkExistOrder,
    getOrder,
    createNewOrder,
    updateOrder,
    cancelOrder,
}
