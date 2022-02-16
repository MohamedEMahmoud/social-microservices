import express, { Request, Response } from "express";
import { requireAuth, BadRequestError } from "@mesocial/common";
import { Post } from "../model/post.model";
const router = express.Router();


router.get("/api/post/timeline",
    requireAuth,
    async (req: Request, res: Response) => {

        const posts = await Post.find({ author: req.currentUser!.id });
        if (posts.length === 0) {
            throw new BadRequestError("Posts Not Found");
        }

        // todo: waiting to publish data from followings route and listen to show followings posts
        // const followingsPosts = await Promise.all(
        //     currentUser.followings.map((friendId) => {
        //       return Post.find({ author: friendId });
        //     })
        //   );
        //   res.json(userPosts.concat(...followingsPosts))

        res.status(200).send({ status: 200, posts, success: true });

    });

export { router as timeLinePostRouter };