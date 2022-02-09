import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { Order, OrderStatus } from "../models/order.model";
import { Product } from "../models/product.model";
import { BadRequestError, requireAuth } from "@mesocial/common";
const router = express.Router();

router.post("/api/order", requireAuth, async (req: Request, res: Response) => {

    if (!req.query.productId) {
        throw new BadRequestError("ProductId Is Required");
    }

    if (!mongoose.Types.ObjectId.isValid(String(req.query.productId))) {
        throw new BadRequestError("ProductId Is Invalid");
    }

    const product = await Product.findById(req.query.productId);

    if (!product) {
        throw new BadRequestError("Product Not Found");
    }

    const isReserved = await product.isReserved();
    if (isReserved) {
        throw new BadRequestError("Product is already reserved");
    }

    const expires = Date.now() + Number(process.env.EXPIRATION_WINDOW_MILLIE_SECOND!); // 1 hour
    const order = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.created,
        expiresAt: new Date(expires).toISOString(),
        product
    });

    await order.save();

    res.status(201).send({ status: 200, order, success: true });

});

export { router as newOrderRouter };