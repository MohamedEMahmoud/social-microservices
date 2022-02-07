import express, { Request, Response } from "express";
import { requireAuth, BadRequestError } from "@mesocial/common";
import { Product } from "../model/product.model";
const router = express.Router();

router.patch("/api/product/like-unlike",
    requireAuth,
    async (req: Request, res: Response) => {

        const product = await Product.findById(req.query.id);
        if (!product) {
            throw new BadRequestError("Product Not Found");
        }
        if (product.likes.includes(req.currentUser!.id)) {
            product.likes = product.likes.filter(like => like !== req.currentUser!.id);
        }
        else {
            product.likes.push(req.currentUser!.id);
        }
        await product.save();
        res.status(200).send({ status: 200, product, success: true });
    });

export { router as like_unlikeProductRouter };