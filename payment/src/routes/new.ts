import express, { Request, Response } from "express";
import { requireAuth, BadRequestError, NotAuthorizedError, upload } from "@mesocial/common";
import { Payment } from "../models/payment.model";
import { Order, OrderStatus } from "../models/order.model";
import { stripe } from "../stripe";
import { natsWrapper } from "../nats-wrapper";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";

const router = express.Router();

router.post("/api/payment", upload.none(), requireAuth, async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
        throw new BadRequestError("Order Not Found");
    }

    if (order.buyerId !== req.currentUser!.id) {
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

    await new PaymentCreatedPublisher(natsWrapper.client).publish({
        id: payment.id,
        orderId: payment.orderId,
        stripeId: payment.stripeId
    });

    res.status(201).send({ status: 201, payment, success: true });

});

export { router as newPaymentRouter };