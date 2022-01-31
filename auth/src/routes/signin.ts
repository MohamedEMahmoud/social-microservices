import express, { Request, Response } from "express";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";
import { BadRequestError, upload, requireAuth } from "@mesocial/common";
import { Password } from "../services/Password";
import address from "address";

const router = express.Router();

router.post('/api/auth/signin', upload.none(), async (req: Request, res: Response) => {

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        throw new BadRequestError("Invalid credentials");
    }

    // todo:check if user have ban or not

    const passwordMatch = await Password.compare(user.password, req.body.password);

    if (!passwordMatch) {
        throw new BadRequestError("Invalid credentials");
    }

    const userJwt  = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_KEY!);

    req.session = {
        jwt: userJwt 
    };

    await address.mac((err, addr) => {
        if (err) {
            throw new BadRequestError("Can not reach to MAC Address");
        }
        else {
            user.macAddress.map(el => {
                if (el.MAC !== addr) {
                    return user.macAddress.push({ MAC: addr });
                }
            });
        }
    });

    res.status(200).send({ status: 200, user, success: true });

});

export { router as signinRouter };