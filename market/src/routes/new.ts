import express, { Request, Response } from "express";
import { requireAuth, BadRequestError, upload, validateImage } from "@mesocial/common";
import { Product } from "../model/product.model";
import { v2 as Cloudinary } from "cloudinary";
import { randomBytes } from "crypto";
const router = express.Router();

router.post("/api/product/create",
    upload.fields([{ name: "images" }]),
    requireAuth,
    validateImage,
    async (req: Request, res: Response) => {
        const files = req.files as { [fieldname: string]: Express.Multer.File[]; };

        if (!files && !req.body) {
            throw new BadRequestError("Can't Product Empty Request");
        }
        const product = Product.build({
            userId: req.currentUser!.id,
            desc: req.body.desc,
        });

        if (files.images) {
            await new Promise((resolve, reject) => {
                files.images.map(image => {
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
        await product.save();
        res.status(201).send({ status: 201, product, success: true });

    });

export { router as newProductRouter };