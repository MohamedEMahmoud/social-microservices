import express, { Request, Response } from "express";
import { requireAuth, BadRequestError } from "@mesocial/common";
import { User } from "../models/user.model";

const router = express.Router();

router.patch("/api/auth/user/unfollow",
    requireAuth,
    async (req: Request, res: Response) => {

        const user = await User.findById(req.query.id);

        if (!user) {
            throw new BadRequestError("User no longer exists ");
        }

        const currentUser = await User.findByIdAndUpdate(req.currentUser!.id, { $pull: { followings: user.id } }, { new: true });

        await user.updateOne({ $pull: { followers: currentUser!.id } });

        res.status(200).send({ status: 200, currentUser, success: true });
    });

export { router as unfollowUserRouter };