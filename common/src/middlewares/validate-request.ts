import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../errors/bad-request-error";

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const emailFormValidation = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const passwordSpecialCharsValidation = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    const fieldRequired = ['name', 'username', 'email', 'password', 'gender'];
    const fieldName = [...Object.keys(req.body)];
    for (let i in fieldRequired) {
        if (!fieldName.includes(fieldRequired[i])) {
            if ((fieldRequired[i] === 'username' && req.body.username.length < 8) || (fieldRequired[i] === 'password' && req.body.password.length < 8)) {
                throw new BadRequestError(`Field ${fieldRequired[i]} must be more than 8 characters`);
            }
            if ((fieldRequired[i] === 'username' && /\s/gi.test(req.body.username)) || (!emailFormValidation.test(req.body.email))) {
                throw new BadRequestError(`Invalid ${fieldRequired[i]}`);
            }

            if (!passwordSpecialCharsValidation.test(req.body.password)) {
                throw new BadRequestError("Password must contain a special character");
            }

            if (req.body.password.toLowerCase().includes("password") || req.body.password.toLowerCase().includes("qwerty") || req.body.password.toLowerCase().includes("asdf")) {
                throw new BadRequestError("For security reasons! The Password can contain neither 'password' nor 'qwerty' nor 'asdf'.");
            }
            throw new BadRequestError(`Field ${fieldRequired[i]} is required`);
        }
    }

    next();
};