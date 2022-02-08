import express, { Request, Response } from "express";
import { requireAuth, BadRequestError } from "@mesocial/common";
import { Post } from "../model/post.model";
const router = express.Router();

router.delete("/api/post",
    requireAuth,
    async (req: Request, res: Response) => {

        const post = await Post.findByIdAndDelete(req.query.id);
        if (!post) {
            throw new BadRequestError("Post Not Found");
        }
        res.status(204).send({});

    });

export { router as deletePostRouter };