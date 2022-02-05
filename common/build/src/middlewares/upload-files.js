"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateImage = exports.upload = void 0;
const bad_request_error_1 = require("../errors/bad-request-error");
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
exports.upload = upload;
const uploadFiles = (req, res, next) => {
    const files = req.files;
    const fields = ["profilePicture", "coverPicture", "images"];
    fields.map(field => {
        if (field in files) {
            files[field].map(file => {
                if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
                    throw new bad_request_error_1.BadRequestError(`${file.originalname} should be valid image`);
                }
                if (file.size > 1e6) {
                    throw new bad_request_error_1.BadRequestError(`${file.originalname} is larger`);
                }
            });
        }
    });
    next();
};
exports.validateImage = uploadFiles;
