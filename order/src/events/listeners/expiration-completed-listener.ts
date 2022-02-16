import { Listener, ExpirationCompletedEvent, Subjects } from "@mesocial/common";
import { Message } from "node-nats-streaming";
import { Order, OrderStatus } from "../../models/order.model";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";
import { queueGroupName } from "./queue-group-name";

export class ExpirationCompletedListener extends Listener<ExpirationCompletedEvent>{
    readonly subject = Subjects.ExpirationCompleted;
    queueGroupName = queueGroupName;
    async onMessage(data: ExpirationCompletedEvent["data"], msg: Message) {

        const order = await Order.findById(data.orderId);

        if (!order) {
            throw new Error("Order Not Found");
        }

        if (order.status === OrderStatus.cancelled) {
            return msg.ack();
        }

        order.set({
            status: OrderStatus.cancelled,
        });

        await order.save();

        await new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            product: order.product
        });

        msg.ack();
    }
}