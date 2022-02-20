import express, { Request, Response } from "express";
import { requireAuth, BadRequestError } from "@mesocial/common";
import { Reply } from "../models/reply.model";
import mongoose from "mongoose";
const router = express.Router();

router.get("/api/reply-user",
    requireAuth,
    async (req: Request, res: Response) => {

        const { isValid } = mongoose.Types.ObjectId;
        const { id } = req.query;
        if (!id || !isValid(String(id))) {
            throw new BadRequestError("Id is Invalid");
        }

        const reply = await Reply.findOne({ userId: req.currentUser!.id, comment: id });
        if (!reply) {
            throw new BadRequestError("Reply Not Found");
        }
        res.status(200).send({ status: 200, reply, success: true });

    });

export { router as showCommentByUserIdRouter };