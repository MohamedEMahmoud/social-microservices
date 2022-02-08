import express, { Request, Response } from "express";
import { Order } from "../models/order.model";
import { requireAuth } from "@mesocial/common";

const router = express.Router();

router.get("/api/order", requireAuth, async (req: Request, res: Response) => {

    const order = await Order.find({ userId: req.currentUser!.id }).populate("product");
    res.status(200).send({ status: 200, order, success: true });

});

export { router as indexOrderRouter };