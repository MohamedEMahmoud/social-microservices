import express, { Request, Response } from "express";
import { requireAuth, upload } from "@mesocial/common";
import { Comment } from "../model/comment.model";
import { v2 as Cloudinary } from "cloudinary";
import { randomBytes } from "crypto";

const router = express.Router();

router.post("/api/comment",
    upload.fields([{ name: "media" }]),
    requireAuth,
    async (req: Request, res: Response) => {
        const files = req.files as { [fieldname: string]: Express.Multer.File[]; };

        const comment = Comment.build({
            userId: req.currentUser!.id,
            ...req.body
        });

        if (files.media) {
            await new Promise((resolve, reject) => {
                files.media.map(mediaData => {
                    const mediaDataId = randomBytes(16).toString("hex");
                    return Cloudinary.uploader.upload_stream({
                        public_id: `comment-${mediaData.mimetype}/${mediaDataId}-${mediaData.originalname}/social-${comment.userId}`,
                        use_filename: true,
                        tags: `${mediaDataId}-tag`,
                        placeholder: true,
                        resource_type: 'auto'
                    }, (err, result) => {
                        if (err) {
                            console.log(err);
                            reject(err);
                        } else {
                            comment.media.push({ id: mediaDataId, URL: result?.secure_url! });
                            if (files.media.length === comment.media.length) {
                                return resolve(comment.media);
                            }
                        }
                    }).end(mediaData.buffer);
                });
            });
        }

        await comment.save();

        res.status(201).send({ status: 201, comment, success: true });

    });

export { router as newCommentRouter };