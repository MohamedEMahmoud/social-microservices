import express, { Request, Response } from "express";
import { requireAuth, BadRequestError } from "@mesocial/common";
import { Reply } from "../models/reply.model";
import { ReplyDeletedPublisher } from "../events/publishers/reply-deleted-publisher";
import { natsWrapper } from "../nats-wrapper";
const router = express.Router();

router.delete("/api/reply",
    requireAuth,
    async (req: Request, res: Response) => {

        const reply = await Reply.findByIdAndDelete(req.query.replyId);
        if (!reply) {
            throw new BadRequestError("Reply Not Found");
        }

        await new ReplyDeletedPublisher(natsWrapper.client).publish({
            id: reply.id,
            commentId: reply.comment
        });

        res.status(204).send({});

    });

export { router as deleteReplyRouter };