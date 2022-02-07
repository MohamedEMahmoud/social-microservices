import express, { Request, Response } from "express";
import { requireAuth, BadRequestError } from "@mesocial/common";
import { Product } from "../model/product.model";
const router = express.Router();

router.get("/api/product/all",
    requireAuth,
    async (req: Request, res: Response) => {

        const products = await Product.find({ userId: req.currentUser!.id });
        if (products.length === 0) {
            throw new BadRequestError("Products Not Found");
        }
        res.status(200).send({ status: 200, products, success: true });

    });

export { router as show_allProductRouter };