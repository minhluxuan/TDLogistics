const Joi = require("joi");
const { joiPasswordExtendCore } = require('joi-password') 
const joiPassword = Joi.extend(joiPasswordExtendCore);
require("dotenv").config();

class OrderValidation {

    validateCreatingOrder = (data) => {
        const schema = Joi.object({
            user_id: Joi.string().pattern(new RegExp(process.env.REGEX_USER_ID)).required(),
            name_sender: Joi.string().pattern(new RegExp(process.env.REGEX_NAME)).required(),
            phone_sender: Joi.string().pattern(new RegExp(process.env.REGEX_PHONE_NUMBER)).required(),
            name_reciever: Joi.string().pattern(new RegExp(process.env.REGEX_NAME)).required(),
            phone_reciever: Joi.string().pattern(new RegExp(process.env.REGEX_PHONE_NUMBER)).required(),
            mass: Joi.number().precision(2).min(0).required(),
            height: Joi.number().precision(2).min(0).required(),
            width: Joi.number().precision(2).min(0).required(),
            length: Joi.number().precision(2).min(0).required(),
            province_source:Joi.string().required(),
            district_source:Joi.string().required(),
            ward_source:Joi.string().required(),
            detail_source: Joi.string().required(),
            province_dest: Joi.string().required(),
            district_dest: Joi.string().required(),
            ward_dest:Joi.string().required(),
            detail_dest: Joi.string().required(),
            long_source: Joi.number().min(-180).max(180).required(),
            lat_source: Joi.number().min(-90).max(90).required(),
            long_destination: Joi.number().min(-180).max(180).required(),
            lat_destination: Joi.number().min(-90).max(90).required(),
            COD: Joi.number().min(0),
            service_type: Joi.number().min(0).required()
        }).strict();
        
        return schema.validate(data);
    }
    
    validateFindingOrderByUserID = (data) => {
        const schema = Joi.object({
            status_code: Joi.number().min(0),
        }).strict();
        
        return schema.validate(data);
    }

    validateFindingOrderByOrderID = (data) => {
        const schema = Joi.object({
            order_id: Joi.string().required(),
        }).strict();
        
        return schema.validate(data);
    }
    
    validateUpdatingOrder = (data) => {
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
    
        return schema.validate(data);
    }

    validateCancelingOrder = (data) => {
        const schema = Joi.object({
            order_id: Joi.string().min(16).max(20).required(),
        });

        return schema.validate(data);
    }

    validateFindingOrderStatus = (data) => {
        const schema = Joi.object({
            order_id: Joi.string().min(16).max(20).required(),
        }).strict();

        return schema.validate(data);
    }

}

class ComplaintValidation {
    validateCreatingComplaint = (data) => {
        const schema = Joi.object({
            type: Joi.string().required(),
            description: Joi.string().required(),
        });

        return schema.validate(data);
    }

    validateFindingComplaint = (data) => {
        const schema = Joi.object({
            type: Joi.string(),
            status: Joi.string(),
            start_time: Joi.date(),
            end_time: Joi.date(),
        });

        return schema.validate(data);
    }
}

class BusinessValidation {
    validateFindingBusinessByBusiness = (data) => {
        const schema = Joi.object({
            business_id: Joi.string().pattern(new RegExp("^[0-9]+$")).required(),
        }).strict();

        return schema.validate(data);
    }

    validateUpdatePassword = (data) => {
        const schema = Joi.object({
            new_password: joiPassword
            .string()
            .min(8)
            .minOfSpecialCharacters(1)
            .minOfLowercase(1)
            .minOfUppercase(1)
            .minOfNumeric(0)
            .noWhiteSpaces()
            .required(),
            confirm_password: Joi.string().valid(Joi.ref('new_password')).required()
        }).strict();
        return schema.validate(data);
    }
}

class UserValidation {
    validateCreatingUser = (data) => {
        const schema = Joi.object({
            fullname: Joi.string().pattern(new RegExp(process.env.REGEX_NAME)),
            email: Joi.string().pattern(new RegExp(process.env.REGEX_EMAIL)),
            phone_number: Joi.string().pattern(new RegExp(process.env.REGEX_PHONE_NUMBER)),
        }).strict();
        return schema.validate(data);
    }
    
    validateCheckingExistUser = (data) => {
        const schema = Joi.object({
            phone_number: Joi.string().pattern(new RegExp(process.env.REGEX_PHONE_NUMBER)),
        }).strict();
        return schema.validate(data);
    }
}

module.exports = {
    OrderValidation,
    ComplaintValidation,
    BusinessValidation,
    UserValidation,
}
