import express, { Request, Response } from "express";
import { requireAuth, BadRequestError } from "@mesocial/common";
import { Comment } from "../model/comment.model";
import mongoose from "mongoose";
const router = express.Router();

router.get("/api/comment",
    requireAuth,
    async (req: Request, res: Response) => {
        const { isValid } = mongoose.Types.ObjectId;

        if (!req.query.id || !isValid(String(req.query.id))) {
            throw new BadRequestError("Id is Invalid");
        }

        const comment = await Comment.findById(req.query.id)
            .populate(
                [
                    {
                        model: "Post",
                        path: "post"
                    },
                    {
                        model: "Product",
                        path: "product"
                    }
                ]
            );
        if (!comment) {
            throw new BadRequestError("Comment Not Found");
        }
        res.status(200).send({ status: 200, comment, success: true });

    });

export { router as showCommentRouter };