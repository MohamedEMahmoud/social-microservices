import express, { Request, Response } from "express";
import { requireAuth } from "@mesocial/common";
import { Comment } from "../models/comment.model";

const router = express.Router();

router.get("/api/comment-user",
    requireAuth,
    async (req: Request, res: Response) => {

        let comment;

        if (req.query.post) {
            comment = await Comment.findOne({ userId: req.currentUser!.id, post: req.query.post });
            return res.status(200).send({ status: 200, comment, success: true });
        } else {
            comment = await Comment.findOne({ userId: req.currentUser!.id, product: req.query.product });
            return res.status(200).send({ status: 200, comment, success: true });
        }

    });

export { router as showCommentByUserIdRouter };