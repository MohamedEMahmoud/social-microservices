import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../errors/bad-request-error";

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const emailFormValidation = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const passwordSpecialCharsValidation = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    const fields = ['username', 'email', 'password', 'gender'];
    fields.map(field => {
        if (field in req.body) {
            if ((field === 'username' && req.body.username.length < 8) || (field === 'password' && req.body.password.length < 8)) {
                throw new BadRequestError(`Field ${field} must be more than 8 characters`);
            }
            if ((field === 'username' && /\s/gi.test(req.body.username)) || (!emailFormValidation.test(req.body.email))) {
                throw new BadRequestError(`Invalid ${field}`);
            }

            if (!passwordSpecialCharsValidation.test(req.body.password)) {
                throw new BadRequestError("Password must contain a special character");
            }

            if (req.body.password.toLowerCase().includes("password") || req.body.password.toLowerCase().includes("qwerty") || req.body.password.toLowerCase().includes("asdf")) {
                throw new BadRequestError("For security reasons! The Password can contain neither 'password' nor 'qwerty' nor 'asdf'.");
            }
            throw new BadRequestError(`Field ${field} is required`);
        }

    });
    next();
};

