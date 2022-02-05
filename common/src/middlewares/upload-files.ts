import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../errors/bad-request-error";
import multer from 'multer';
const storage = multer.memoryStorage();

const upload = multer({ storage });


const uploadFiles = (req: Request, res: Response, next: NextFunction) => {

    const files = req.files as { [fieldname: string]: Express.Multer.File[]; };
    const fields = ["profilePicture", "coverPicture", "image"];
    fields.map(field =>{
        if (field in files) {
            files[field].map(file => {
                if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
                    throw new BadRequestError(`${file.originalname} should be valid image`);
                }
                if (file.size > 1e6) {
                    throw new BadRequestError(`${file.originalname} is larger`);
                }
            });
        }
    })
    next();
};

export { upload, uploadFiles as validateImage };