import express, { Request, Response } from "express";
import { requireAuth, BadRequestError } from "@mesocial/common";
import { Product } from "../model/product.model";
const router = express.Router();

router.get("/api/product/search",
    requireAuth,
    async (req: Request, res: Response) => {
        const { search, price } = req.query;
        if (!search) {
            throw new BadRequestError("Search Query is Required");
        }

        const products = await Product.find({ merchantId: req.currentUser!.id });

        const productSearch =
            products.filter(product =>
                (product.content.toLowerCase().includes(search.toString().toLowerCase()) && product.price === Number(price))
                ||
                (product.content.toLowerCase().includes(search.toString().toLowerCase()) || product.price === Number(price)));

        if (products.length === 0 || productSearch.length === 0) {
            throw new BadRequestError("Products Not Found");
        }

        res.status(200).send({ status: 200, products: productSearch, success: true });

    });

export { router as searchProductRouter };