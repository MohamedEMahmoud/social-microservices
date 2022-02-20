import express, { Request, Response } from "express";
import { requireAuth, upload, BadRequestError } from "@mesocial/common";
import { Comment } from "../models/comment.model";
import { v2 as Cloudinary } from "cloudinary";
import { randomBytes } from "crypto";
import { CommentCreatedPublisher } from "../events/publishers/comment-created-publisher";
import { natsWrapper } from "../nats-wrapper";
import { Post } from "../models/post.model";
import { Product } from "../models/product.model";
const router = express.Router();

router.post("/api/comment",
    upload.fields([{ name: "media" }]),
    requireAuth,
    async (req: Request, res: Response) => {
        const files = req.files as { [fieldname: string]: Express.Multer.File[]; };

        if (Number(req.query.length) === 0) {
            throw new BadRequestError("Must Be Defined postId Or productId");
        }

        const post = await Post.findById(req.query.postId);
        const product = await Product.findById(req.query.productId);
        const comment = Comment.build({
            userId: req.currentUser!.id,
            post: post?.id,
            product: product?.id,
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


        const commentData = await comment.save();

        if (commentData) {
            await new CommentCreatedPublisher(natsWrapper.client).publish({
                id: commentData.id,
                userId: commentData.userId,
                postId: commentData.post,
                productId: commentData.product,
                version: commentData.version,
            });
        }

        res.status(201).send({ status: 201, comment, success: true });

    });

export { router as newCommentRouter };