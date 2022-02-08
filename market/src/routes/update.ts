import express, { Request, Response } from "express";
import { requireAuth, BadRequestError, upload, validateImage, NotAuthorizedError } from "@mesocial/common";
import { Product } from "../model/product.model";
import { v2 as Cloudinary } from "cloudinary";
import _ from "lodash";
import { randomBytes } from "crypto";

const router = express.Router();

router.patch("/api/product",
    upload.fields([{ name: "images" }]),
    requireAuth,
    validateImage,
    async (req: Request, res: Response) => {
        const files = req.files as { [fieldname: string]: Express.Multer.File[]; };

        const product = await Product.findById(req.query.id);

        if (!product) {
            throw new BadRequestError("Product Not Found");
        }

        if (product.orderId) {
            throw new BadRequestError("Cannot edit a reserved product");
        }

        if (product.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }
        
        if (files.images) {
            await new Promise(async (resolve, reject) => {
                files.images.map(async image => {
                    const imageId = randomBytes(16).toString("hex");
                    return Cloudinary.uploader.upload_stream({
                        public_id: `product-image/${imageId}-${image.originalname}/social-${product.userId}`,
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
                            return setTimeout(() => {
                                resolve(product.images);
                            }, parseInt(`${files.images.length}000`));
                        }
                    }).end(image.buffer);
                });
            });
        }

        if (req.query.imageId) {
            product.images = product.images.filter(image => image.id !== req.query.imageId);
        }

        _.extend(product, req.body);

        await product.save();
        res.status(200).send({ status: 200, product, success: true });

    });

export { router as updateProductRouter };