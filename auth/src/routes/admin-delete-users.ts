import express, { Request, Response } from "express";
import { User } from "../models/user.model";
import { requireAuth, BadRequestError } from "@mesocial/common";
import mongoose from "mongoose";
import { UserDeletedPublisher } from "../events/publishers/user-deleted-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.delete("/api/auth/admin",
    requireAuth,
    async (req: Request, res: Response) => {

        const user = await User.findById(req.currentUser!.id);

        if (user?.roles !== "admin") {
            throw new BadRequestError("User have no this permission");
        }

        if (!req.query.id || !mongoose.Types.ObjectId.isValid(String(req.query.id))) {
            throw new BadRequestError("Id Is Invalid");
        }

        const deletedUser = await User.findByIdAndDelete(req.query.id);

        await new UserDeletedPublisher(natsWrapper.client).publish({
            id: deletedUser!.id,
        });

        res.status(204).send({});

    });

export { router as adminDeleteUsers };