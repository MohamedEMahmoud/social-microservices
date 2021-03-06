import express, { Request, Response } from "express";
import { User } from "../models/user.model";
import { requireAuth, BadRequestError, upload } from "@mesocial/common";
import moment from "moment";
import mongoose from "mongoose";
import { AdminCreatedBanPublisher } from "../events/publishers/admin-created-ban-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

interface BanUser {
    id: string;
    period: string;
    reason: string;
    end_in: string;
}

router.patch("/api/auth/admin/ban",
    upload.none(),
    requireAuth,
    async (req: Request, res: Response) => {

        const user = await User.findById(req.currentUser!.id);

        if (user?.roles !== "admin") {
            throw new BadRequestError("User have no this permission");
        }

        if (!req.query.id || !mongoose.Types.ObjectId.isValid(String(req.query.id))) {
            throw new BadRequestError("Id Is Invalid");
        }

        const existingUser = await User.findById(req.query.id);

        if (!existingUser) {
            throw new BadRequestError("User no longer exists");
        }

        if (existingUser.roles === "admin") {
            throw new BadRequestError("Admin User");
        }

        if (!req.body.reason) {
            throw new BadRequestError("Reason Ban is required");
        }

        let num, str;
        if (req.body.period) {
            num = parseInt(req.body.period.match(/\d+/)[0]);
            str = req.body.period.replace(num, "");
            str === "d" ? str = "days" : str === "m" ? str = "months" : str = "years";
        }

        existingUser.hasAccess = false;

        if (existingUser.ban.length === 0) {
            const ban = {
                period: req.body.period ? req.body.period : undefined,
                reason: req.body.reason,
                end_in: req.body.period ? moment().add(num, <moment.unitOfTime.DurationConstructor>str).format() : undefined,
            } as BanUser;

            existingUser.ban.push(ban);
        } else {
            const { end_in } = existingUser.ban[existingUser.ban.length - 1];
            const ban = {
                period: req.body.period ? req.body.period : undefined,
                reason: req.body.reason,
                end_in: req.body.period ? moment(end_in).add(num, <moment.unitOfTime.DurationConstructor>str).format() : undefined,
            } as BanUser;
            existingUser.ban.push(ban);
        }

        await existingUser.save();

        const { id, end_in } = existingUser.ban[existingUser.ban.length - 1];
        if (end_in) {
            await new AdminCreatedBanPublisher(natsWrapper.client).publish({
                id: existingUser.id,
                ban: {
                    id,
                    end_in
                }
            });
        }

        res.status(200).send({ status: 200, existingUser, success: true });

    });

export { router as adminCreateBan };