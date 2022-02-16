import { Listener, OrderCreatedEvent, Subjects } from "@mesocial/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order.model";
import { queueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName;
    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {

        const order = Order.build({
            id: data.id,
            buyerId: data.buyerId,
            status: data.status,
            version: data.version,
            price: data.product.price,
        });

        await order.save();

        msg.ack();
    }
}