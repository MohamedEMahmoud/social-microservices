import express, { Request, Response } from "express";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";
import { BadRequestError, upload } from "@mesocial/common";
import { Password } from "../services/Password";
import address from "address";
import moment from "moment";

const router = express.Router();

router.post('/api/auth/signin', upload.none(), async (req: Request, res: Response) => {

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        throw new BadRequestError("Invalid credentials");
    }

    if (!user.hasAccess) {
        await Promise.all(
            user.ban.map(userBan => {
                if (userBan.end_in && (new Date(userBan.end_in) === new Date() || new Date(userBan.end_in) > new Date())) {
                    throw new BadRequestError(`${user.email} is ban and reason ${userBan.reason} to ${moment(userBan.end_in).format('DD/MM/YYYY')} time left in ${moment(userBan.end_in, 'YYYY.MM.DD').fromNow()}`);
                }
                if (!userBan.end_in) {
                    throw new BadRequestError(`${user.email} is ban forever and reason ${userBan.reason}`);
                }
            })
        );
    }

    const passwordMatch = await Password.compare(user.password, req.body.password);

    if (!passwordMatch) {
        throw new BadRequestError("Invalid credentials");
    }

    const userJwt = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_KEY!);

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