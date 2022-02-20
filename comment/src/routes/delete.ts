import express, { Request, Response } from "express";
import { requireAuth, BadRequestError } from "@mesocial/common";
import { Comment } from "../models/comment.model";
import { CommentDeletedPublisher } from "../events/publishers/comment-deleted-publisher";
import { natsWrapper } from "../nats-wrapper";
const router = express.Router();

router.delete("/api/comment",
    requireAuth,
    async (req: Request, res: Response) => {

        const comment = await Comment.findByIdAndDelete(req.query.commentId);

        if (!comment) {
            throw new BadRequestError("Comment Not Found");
        }

        await new CommentDeletedPublisher(natsWrapper.client).publish({
            id: comment.id,
            postId: comment.post,
            productId: comment.product
        });

        res.status(204).send({});

    });

export { router as deleteCommentRouter };