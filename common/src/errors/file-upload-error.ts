import { CustomError } from "./custom-error";

export class FileUploadError extends CustomError {
    statusCode = 400;

    constructor(public message: string) {
        super(message);
        Object.setPrototypeOf(this, FileUploadError.prototype);
    }

    serializeErrors() {
        return [{ message: this.message, success: false }];
    }
    
}