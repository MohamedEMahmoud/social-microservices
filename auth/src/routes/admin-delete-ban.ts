import express, { Request, Response } from "express";
import { User } from "../models/user.model";
import { requireAuth, BadRequestError } from "@mesocial/common";
import mongoose from "mongoose";
import { UserUpdatedPublisher } from "../events/publishers/user-updated-publisher";
import { natsWrapper } from "../nats-wrapper";
const router = express.Router();


router.delete("/api/auth/admin/ban",
    requireAuth,
    async (req: Request, res: Response) => {

        const user = await User.findById(req.currentUser!.id);

        if (user?.roles !== "admin") {
            throw new BadRequestError("User have no this permission");
        }

        const { id, banId } = req.query;
        const { isValid } = mongoose.Types.ObjectId;

        if (!id || !isValid(String(id)) || !banId || !isValid(String(banId))) {
            for (let i in req.query) {
                throw new BadRequestError(`${req.query[i]} Is Invalid`);
            }
        }

        const existingUser = await User.findById(id);

        if (!existingUser) {
            throw new BadRequestError("User no longer exists");
        }

        existingUser.ban = existingUser.ban.filter(el => el.id !== banId);

        if (existingUser.ban.length === 0) {
            existingUser.hasAccess = true;
        }

        await existingUser.save();

        await new UserUpdatedPublisher(natsWrapper.client).publish({
            id: existingUser.id,
            version: existingUser.version
        });

        res.status(200).send({ status: 200, existingUser, success: true });

    });

export { router as adminDeleteBan };