import express, { Request, Response } from "express";
import { requireAuth, BadRequestError } from "@mesocial/common";
import { Post } from "../models/post.model";
import { PostDeletedPublisher } from "../events/publishers/post-deleted-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.delete("/api/post",
    requireAuth,
    async (req: Request, res: Response) => {

        const post = await Post.findByIdAndDelete(req.query.postId);

        if (!post) {
            throw new BadRequestError("Post Not Found");
        }

        await new PostDeletedPublisher(natsWrapper.client).publish({
            id: post.id,
        });

        res.status(204).send({});

    });

export { router as deletePostRouter };