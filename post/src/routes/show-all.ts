import express, { Request, Response } from "express";
import { requireAuth, BadRequestError } from "@mesocial/common";
import { Post } from "../models/post.model";
const router = express.Router();

router.get("/api/post/all",
    requireAuth,
    async (req: Request, res: Response) => {

        const posts = await Post.find({ author: req.currentUser!.id }).populate("author");
        if (posts.length === 0) {
            throw new BadRequestError("Posts Not Found");
        }
        res.status(200).send({ status: 200, posts, success: true });

    });

export { router as show_allPostRouter };