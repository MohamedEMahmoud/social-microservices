import express, { Request, Response } from "express";
import { BadRequestError } from "@mesocial/common";
import { Product } from "../model/product.model";
const router = express.Router();


router.get("/api/product/timeline",
    async (req: Request, res: Response) => {

        const products = await Product.find({});
        if (products.length === 0) {
            throw new BadRequestError("Products Not Found");
        }

        res.status(200).send({ status: 200, products, success: true });
    });

export { router as timeLineProductRouter };