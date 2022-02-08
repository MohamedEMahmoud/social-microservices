import express, { Request, Response } from "express";
import { requireAuth, BadRequestError, NotAuthorizedError } from "@mesocial/common";
import mongoose from "mongoose";
import { Order, OrderStatus } from "../models/order.model";
const router = express.Router();

router.patch("/api/order", requireAuth, async (req: Request, res: Response) => {

    if (!req.query.orderId) {
        throw new BadRequestError("orderId is required");
    }

    if (mongoose.Types.ObjectId.isValid(Object(req.query.orderId))) {
        throw new BadRequestError("orderId is invalid");
    }

    const order = await Order.findById(req.query.orderId);

    if (!order) {
        throw new BadRequestError("Order Not Found");
    }

    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    order.status = OrderStatus.cancelled;

    await order.save();

    res.status(200).send({ status: 200, order, success: true });

});

export { router as updateOrderRouter };