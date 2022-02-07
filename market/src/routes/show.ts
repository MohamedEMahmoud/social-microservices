import express, { Request, Response } from "express";
import { requireAuth, BadRequestError } from "@mesocial/common";
import { Product } from "../model/product.model";
const router = express.Router();

router.get("/api/product",
    requireAuth,
    async (req: Request, res: Response) => {

        const product = await Product.findById(req.query.id);
        if (!product) {
            throw new BadRequestError("Product Not Found");
        }
        res.status(200).send({ status: 200, product, success: true });

    });

export { router as showProductRouter };