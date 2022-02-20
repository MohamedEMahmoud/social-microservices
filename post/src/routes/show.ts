import express, { Request, Response } from "express";
import { requireAuth, BadRequestError } from "@mesocial/common";
import { Post } from "../models/post.model";
const router = express.Router();

router.get("/api/post",
    requireAuth,
    async (req: Request, res: Response) => {

        const post = await Post.findById(req.query.postId).populate("author");
        if (!post) {
            throw new BadRequestError("Post Not Found");
        }
        res.status(200).send({ status: 200, post, success: true });

    });

export { router as showPostRouter };