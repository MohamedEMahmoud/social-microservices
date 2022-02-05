import express, { Request, Response } from "express";
import { requireAuth, BadRequestError } from "@mesocial/common";
import { Post } from "../model/post.model";
const router = express.Router();

router.patch("/api/post/like-unlike",
    requireAuth,
    async (req: Request, res: Response) => {

        const post = await Post.findById(req.query.id);
        if (!post) {
            throw new BadRequestError("Post Not Found");
        }
        if (post.likes.includes(req.currentUser!.id)) {
            post.likes = post.likes.filter(like => like !== req.currentUser!.id);
        }
        else {
            post.likes.push(req.currentUser!.id);
        }
        await post.save();
        res.status(200).send({ status: 200, post, success: true });
    });

export { router as like_unlikePostRouter };