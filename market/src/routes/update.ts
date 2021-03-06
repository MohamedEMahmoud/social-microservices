import express, { Request, Response } from "express";
import { requireAuth, BadRequestError, upload, validateImage, NotAuthorizedError } from "@mesocial/common";
import { Product } from "../model/product.model";
import { v2 as Cloudinary } from "cloudinary";
import _ from "lodash";
import { randomBytes } from "crypto";
import { natsWrapper } from "../nats-wrapper";
import { ProductUpdatedPublisher } from "../events/publishers/product-updated-publisher";

const router = express.Router();

router.patch("/api/product",
    upload.fields([{ name: "images" }]),
    requireAuth,
    validateImage,
    async (req: Request, res: Response) => {
        const files = req.files as { [fieldname: string]: Express.Multer.File[]; };

        const product = await Product.findById(req.query.productId);

        if (!product) {
            throw new BadRequestError("Product Not Found");
        }

        if (product.orderId) {
            throw new BadRequestError("Cannot edit a reserved product");
        }

        if (product.merchantId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        if (files.images) {
            await new Promise(async (resolve, reject) => {
                files.images.map(async image => {
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

        if (req.query.imageId) {
            product.images = product.images.filter(image => image.id !== req.query.imageId);
        }

        _.extend(product, req.body);

        const productData = await product.save();
        if (productData) {

            const bodyData: { [key: string]: any; } = {};

            _.each(req.body, (value, key: string) => {
                const fields = ["images", "content", "price"];
                fields.forEach(el => {
                    if (key === el) {
                        bodyData[key] = value;
                    }
                });
            });

            await new ProductUpdatedPublisher(natsWrapper.client).publish({
                id: product.id,
                merchantId: product.merchantId,
                ...bodyData,
                version: product.version
            });
        }

        res.status(200).send({ status: 200, product, success: true });

    });

export { router as updateProductRouter };