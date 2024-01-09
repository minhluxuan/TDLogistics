const crypto = require("crypto");
const Joi = require("joi");
require("dotenv").config();

const hashPhoneNumber = async (phoneNumber) => {
    const hash = crypto.createHash("sha256");
    hash.update(phoneNumber);
    return hash.digest("hex");
}

class OrderValidation {
    constructor(data) {
        this._data = data;
    }

    validateCreatingOrder = () => {
        const schema = Joi.object({
            mass: Joi.number().precision(2).min(0).required(),
            height: Joi.number().precision(2).min(0).required(),
            width: Joi.number().precision(2).min(0).required(),
            length: Joi.number().precision(2).min(0).required(),
            long_source: Joi.number().min(-180).max(180).required(),
            lat_source: Joi.number().min(-90).max(90).required(),
            long_destination: Joi.number().min(-180).max(180).required(),
            lat_destination: Joi.number().min(-90).max(90).required(),
            parent: Joi.string().alphanum().min(6).max(6),
            container: Joi.string().alphanum().min(6).max(6),
            journey: Joi.string().alphanum(),
            COD: Joi.number().precision(3).min(0),
            status_code: Joi.boolean(),
        });
        
        return schema.validate(this._data);
    }
    
    validateFindingOrder = () => {
        const schema = Joi.object({
            order_id: Joi.string(),
            start_order_time: Joi.date(),
            end_order_time: Joi.date(),
            province_source_code: Joi.number().min(0).max(63),
            province_destination_code: Joi.number().min(0).max(63),
            district_source_code: Joi.number().min(0),
            district_destination_code: Joi.number().min(0),
            town_source_code: Joi.number().min(0),
            town_destination_code: Joi.number().min(0),
            status_code: Joi.boolean(),
        });
        
        return schema.validate(this._data);
    }
    
    validateUpdatingOrder = () => {
        const schema = Joi.object({
            mass: Joi.number().precision(2).min(0),
            height: Joi.number().precision(2).min(0),
            width: Joi.number().precision(2).min(0),
            length: Joi.number().precision(2).min(0),
            long_source: Joi.number().min(-180).max(180),
            lat_source: Joi.number().min(-90).max(90),
            long_destination: Joi.number().min(-180).max(180),
            lat_destination: Joi.number().min(-90).max(90),
            COD: Joi.number().precision(3).min(0),
        });
    
        return schema.validate(this._data);
    }

    validateCancelingOrder = () => {
        const schema = Joi.object({
            order_id: Joi.string().min(16).max(20).required(),
        });

        return schema.validate(this._data);
    }
}

module.exports = {
    hashPhoneNumber,
    OrderValidation,
}
