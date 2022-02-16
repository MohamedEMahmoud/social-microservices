import express, { Request, Response } from "express";
import { requireAuth, BadRequestError, NotAuthorizedError } from "@mesocial/common";
import mongoose from "mongoose";
import { Order, OrderStatus } from "../models/order.model";
import { natsWrapper } from "../nats-wrapper";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
const router = express.Router();

router.patch("/api/order", requireAuth, async (req: Request, res: Response) => {

    if (!req.query.orderId) {
        throw new BadRequestError("orderId is required");
    }

    if (!mongoose.Types.ObjectId.isValid(String(req.query.orderId))) {
        throw new BadRequestError("orderId is invalid");
    }

    const order = await Order.findById(req.query.orderId);

    if (!order) {
        throw new BadRequestError("Order Not Found");
    }

    if (order.buyerId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    order.status = OrderStatus.cancelled;

    await order.save();

    await new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        product: order.product
    });

    res.status(200).send({ status: 200, order, success: true });

});

export { router as updateOrderRouter };