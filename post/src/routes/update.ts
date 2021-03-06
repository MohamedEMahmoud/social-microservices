import express, { Request, Response } from "express";
import { requireAuth, BadRequestError, upload, validateImage } from "@mesocial/common";
import { Post } from "../models/post.model";
import { v2 as Cloudinary } from "cloudinary";
import _ from "lodash";
import { randomBytes } from "crypto";
import { PostUpdatedPublisher } from "../events/publishers/post-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.patch("/api/post",
    upload.fields([{ name: "images" }]),
    requireAuth,
    validateImage,
    async (req: Request, res: Response) => {
        const files = req.files as { [fieldname: string]: Express.Multer.File[]; };

        const post = await Post.findById(req.query.postId);

        if (!post) {
            throw new BadRequestError("Post Not Found");
        }

        if (files.images) {
            await new Promise((resolve, reject) => {
                files.images.map(image => {
                    const imageId = randomBytes(16).toString("hex");
                    return Cloudinary.uploader.upload_stream({
                        public_id: `post-image/${imageId}-${image.originalname}/social-${post.author}`,
                        use_filename: true,
                        tags: `${imageId}-tag`,
                        width: 500,
                        height: 500,
                        crop: "scale",
                        placeholder: true,
                        resource_type: 'auto'
                    }, (err, result) => {
                        if (err) {
                            console.log(err);
                            reject(err);
                        } else {
                            post.images.push({ id: imageId, URL: result?.secure_url! });
                            if (files.images.length === post.images.length) {
                                return resolve(post.images);
                            }
                        }
                    }).end(image.buffer);
                });
            });
        }

        if (req.query.imageId) {
            post.images = post.images.filter(image => image.id !== req.query.imageId);
        }

        _.extend(post, req.body);

        const postData = await post.save();
        if (postData) {
            await new PostUpdatedPublisher(natsWrapper.client).publish({
                id: postData.id,
                version: postData.version
            });
        }
        res.status(200).send({ status: 200, post, success: true });

    });

export { router as updatePostRouter };