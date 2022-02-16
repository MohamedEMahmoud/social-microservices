import express, { Request, Response } from "express";
import { requireAuth, BadRequestError, ModelType } from "@mesocial/common";
import { Comment } from "../model/comment.model";
import mongoose from "mongoose";
const router = express.Router();

router.get("/api/comment-user",
    requireAuth,
    async (req: Request, res: Response) => {

        const { isValid } = mongoose.Types.ObjectId;
        const { user, post, product } = req.query;
        if ((!user || !isValid(String(user))) || (post && !isValid(String(post))) || (product && !isValid(String(product)))) {
            for (let i in req.query) {
                throw new BadRequestError(`${req.query[i]} is Invalid`);
            }
        }

        let comment;

        if (post) {
            comment = await Comment.findOne({ userId: user, post });
            return res.status(200).send({ status: 200, comment, success: true });
        } else {
            comment = await Comment.findOne({ userId: user, product });
            return res.status(200).send({ status: 200, comment, success: true });
        }

    });

export { router as showCommentByUserIdRouter };