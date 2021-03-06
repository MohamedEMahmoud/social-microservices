import express, { Request, Response } from "express";
import { requireAuth, upload, validateImage } from "@mesocial/common";
import { Post } from "../models/post.model";
import { v2 as Cloudinary } from "cloudinary";
import { randomBytes } from "crypto";
import { PostCreatedPublisher } from "../events/publishers/post-created-publisher";
import { natsWrapper } from "../nats-wrapper";
const router = express.Router();

router.post("/api/post",
    upload.fields([{ name: "images" }]),
    requireAuth,
    validateImage,
    async (req: Request, res: Response) => {
        const files = req.files as { [fieldname: string]: Express.Multer.File[]; };

        const post = Post.build({
            author: req.currentUser!.id,
            content: req.body.content,
        });

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

        const postData = await post.save();

        if (postData) {
            await new PostCreatedPublisher(natsWrapper.client).publish({
                id: postData.id,
                author: postData.author,
                version: postData.version,
            });
        }

        res.status(201).send({ status: 201, post, success: true });

    });

export { router as newPostRouter };