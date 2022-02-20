import express, { Request, Response } from "express";
import { requireAuth, BadRequestError } from "@mesocial/common";
import { User } from "../models/user.model";
import { FollowCreatedPublisher } from "../events/publishers/follow-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.patch("/api/auth/user/follow",
    requireAuth,
    async (req: Request, res: Response) => {

        const user = await User.findById(req.query.id);

        if (!user) {
            throw new BadRequestError("User no longer exists");
        }

        const currentUser = await User.findByIdAndUpdate(req.currentUser!.id, { $push: { followings: user.id } }, { new: true });

        if (!currentUser) {
            throw new BadRequestError("User no longer exists");
        }

        await user.updateOne({ $push: { followers: currentUser!.id } });

        const userData = await user.save();

        const currentUserData = await currentUser.save();

        if (userData && currentUserData) {
            await new FollowCreatedPublisher(natsWrapper.client).publish({
                follower: currentUserData.id,
                currentUserVersion: currentUserData.version,
                following: userData.id,
                userVersion: userData.version,
            });
        }



        res.status(200).send({ status: 200, currentUser, success: true });
    });

export { router as followUserRouter };