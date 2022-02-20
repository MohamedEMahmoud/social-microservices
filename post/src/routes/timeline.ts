import express, { Request, Response } from "express";
import { requireAuth, BadRequestError } from "@mesocial/common";
import { Post } from "../models/post.model";
import { User } from "../models/user.model";
const router = express.Router();


router.get("/api/post/timeline",
    requireAuth,
    async (req: Request, res: Response) => {

        const currentUser = await User.findById(req.currentUser!.id);
        if (!currentUser) {
            throw new BadRequestError("User Not Found");
        }

        const followingsPosts = await Promise.all(currentUser.followings.map(async (friendId) => {
            return Post.find({ author: friendId });
        }));

        if (followingsPosts.length === 0) {
            throw new BadRequestError("Posts Not Found");
        }

        const data: any[] = [];

        res.status(200).send({ status: 200, posts: data.concat(...followingsPosts), success: true });

    });

export { router as timeLinePostRouter };