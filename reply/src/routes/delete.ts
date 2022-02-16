import express, { Request, Response } from "express";
import { requireAuth, BadRequestError } from "@mesocial/common";
import { Reply } from "../model/reply.model";
const router = express.Router();

router.delete("/api/reply",
    requireAuth,
    async (req: Request, res: Response) => {

        const reply = await Reply.findByIdAndDelete(req.query.id);
        if (!reply) {
            throw new BadRequestError("Reply Not Found");
        }
        res.status(204).send({});

    });

export { router as deleteReplyRouter };