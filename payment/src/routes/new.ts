import express, { Request, Response } from "express";
import { requireAuth, BadRequestError, NotAuthorizedError } from "@mesocial/common";
import { Payment } from "../models/payment.model";
import { Order, OrderStatus } from "../models/order.model";
import { stripe } from "../stripe";

const router = express.Router();

router.post("/api/payment", requireAuth, async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findOne(orderId);

    if (!order) {
        throw new BadRequestError("Order Not Found");
    }

    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.cancelled) {
        throw new BadRequestError("Cant not pay for an cancelled order");
    }

    const charge = await stripe.charges.create({
        currency: "usd",
        amount: order.price * 100,
        source: token,
    });
    
    const payment = Payment.build({
        orderId: order.id,
        stripeId: charge.id
    });

    await payment.save();

    res.status(201).send({ status: 201, payment, success: true });

});

export { router as newPaymentRouter };