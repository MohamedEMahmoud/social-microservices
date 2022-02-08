import express, { Request, Response } from "express";
import { requireAuth, BadRequestError } from "@mesocial/common";
import { Product } from "../model/product.model";
const router = express.Router();

router.delete("/api/product",
    requireAuth,
    async (req: Request, res: Response) => {

        const product = await Product.findByIdAndDelete(req.query.id);
        if (!product) {
            throw new BadRequestError("Product Not Found");
        }
        res.status(204).send({});

    });

export { router as deleteProductRouter };