import express, { Request, Response } from "express";
import { BadRequestError, requireAuth, upload } from "@mesocial/common";
import { Reply } from "../models/reply.model";
import { v2 as Cloudinary } from "cloudinary";
import { randomBytes } from "crypto";
import { ReplyCreatedPublisher } from "../events/publishers/reply-created-publisher";
import { natsWrapper } from "../nats-wrapper";
import { Comment } from "../models/comment.model";
const router = express.Router();

router.post("/api/reply",
    upload.fields([{ name: "media" }]),
    requireAuth,
    async (req: Request, res: Response) => {
        const files = req.files as { [fieldname: string]: Express.Multer.File[]; };

        const comment = await Comment.findById(req.query.commentId);

        if (!comment) {
            throw new BadRequestError("Comment Not Found");
        }

        const reply = Reply.build({
            userId: req.currentUser!.id,
            comment: comment.id,
            ...req.body
        });

        if (files.media) {
            await new Promise((resolve, reject) => {
                files.media.map(mediaData => {
                    const mediaDataId = randomBytes(16).toString("hex");
                    return Cloudinary.uploader.upload_stream({
                        public_id: `reply-${mediaData.mimetype}/${mediaDataId}-${mediaData.originalname}/social-${reply.userId}`,
                        use_filename: true,
                        tags: `${mediaDataId}-tag`,
                        placeholder: true,
                        resource_type: 'auto'
                    }, (err, result) => {
                        if (err) {
                            console.log(err);
                            reject(err);
                        } else {
                            reply.media.push({ id: mediaDataId, URL: result?.secure_url! });
                            if (files.media.length === reply.media.length) {
                                return resolve(reply.media);
                            }
                        }
                    }).end(mediaData.buffer);
                });
            });
        }

        const replyData = await reply.save();

        if (replyData) {
            await new ReplyCreatedPublisher(natsWrapper.client).publish({
                id: replyData.id,
                commentId: replyData.comment
            });
        }

        res.status(201).send({ status: 201, reply, success: true });

    });

export { router as newReplyRouter };