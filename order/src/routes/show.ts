import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { Order } from "../models/order.model";
import { requireAuth, BadRequestError, NotAuthorizedError } from "@mesocial/common";

const router = express.Router();

router.get("/api/order", requireAuth, async (req: Request, res: Response) => {

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

    res.status(200).send({ status: 200, order, success: true });

});

export { router as showOrderRouter };