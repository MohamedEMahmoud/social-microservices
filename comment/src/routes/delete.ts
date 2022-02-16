import express, { Request, Response } from "express";
import { requireAuth, BadRequestError } from "@mesocial/common";
import { Comment } from "../model/comment.model";
const router = express.Router();

router.delete("/api/comment",
    requireAuth,
    async (req: Request, res: Response) => {

        const comment = await Comment.findByIdAndDelete(req.query.id);
        if (!comment) {
            throw new BadRequestError("Comment Not Found");
        }
        res.status(204).send({});

    });

export { router as deleteCommentRouter };