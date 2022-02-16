import express, { Request, Response } from "express";
import { requireAuth, BadRequestError, upload, validateImage } from "@mesocial/common";
import { Product } from "../model/product.model";
import { v2 as Cloudinary } from "cloudinary";
import { randomBytes } from "crypto";
import { natsWrapper } from "../nats-wrapper";
import { ProductCreatedPublisher } from "../events/publishers/product-created-publisher";
const router = express.Router();

router.post("/api/product",
    upload.fields([{ name: "images" }]),
    requireAuth,
    validateImage,
    async (req: Request, res: Response) => {
        const files = req.files as { [fieldname: string]: Express.Multer.File[]; };

        if (!req.body.price) {
            throw new BadRequestError("Price is required");
        }

        if (req.body.price < 5) {
            throw new BadRequestError("Price is must be greater than 5 ");
        }

        const product = Product.build({
            merchantId: req.currentUser!.id,
            content: req.body.content,
            price: req.body.price,
        });

        if (files.images) {
            await new Promise((resolve, reject) => {
                files.images.map(image => {
                    const imageId = randomBytes(16).toString("hex");
                    return Cloudinary.uploader.upload_stream({
                        public_id: `product-image/${imageId}-${image.originalname}/social-${product.merchantId}`,
                        use_filename: true,
                        tags: `${imageId}-tag`,
                        width: 500,
                        height: 500,
                        crop: "scale",
                        placeholder: true,
                        resource_type: 'auto'
                    }, async (err, result) => {
                        if (err) {
                            console.log(err);
                            reject(err);
                        } else {
                            product.images.push({ id: imageId, URL: result?.secure_url! });
                            if (files.images.length === product.images.length) {
                                return resolve(product.images);
                            }
                        }
                    }).end(image.buffer);
                });
            });
        }
        await product.save();

        await new ProductCreatedPublisher(natsWrapper.client).publish({
            id: product.id,
            merchantId: product.merchantId,
            images: product.images,
            content: product.content,
            price: product.price,
            version: product.version
        });

        res.status(201).send({ status: 201, product, success: true });

    });

export { router as newProductRouter };