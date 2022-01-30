"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploadError = void 0;
const custom_error_1 = require("./custom-error");
class FileUploadError extends custom_error_1.CustomError {
    constructor(message) {
        super(message);
        this.message = message;
        this.statusCode = 400;
        Object.setPrototypeOf(this, FileUploadError.prototype);
    }
    serializeErrors() {
        return [{ message: this.message, success: false }];
    }
}
exports.FileUploadError = FileUploadError;
