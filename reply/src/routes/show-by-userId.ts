import express, { Request, Response } from "express";
import { requireAuth, BadRequestError } from "@mesocial/common";
import { Reply } from "../model/reply.model";
import mongoose from "mongoose";
const router = express.Router();

router.get("/api/reply-user",
    requireAuth,
    async (req: Request, res: Response) => {

        const { isValid } = mongoose.Types.ObjectId;
        const { user, id } = req.query;
        if (!user || !isValid(String(user)) || !id || !isValid(String(id))) {
            for (let i in req.query) {
                throw new BadRequestError(`${req.query[i]} is Invalid`);
            }
        }

        const reply = await Reply.findOne({ userId: user, comment: id });
        if (!reply) {
            throw new BadRequestError("Reply Not Found");
        }
        res.status(200).send({ status: 200, reply, success: true });

    });

export { router as showCommentByUserIdRouter };