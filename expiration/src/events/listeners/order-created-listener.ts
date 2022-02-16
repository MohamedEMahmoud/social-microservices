import { Listener, OrderCreatedEvent, Subjects } from "@mesocial/common";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-order-queue";
import { queueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    readonly subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName;
    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {

        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

        expirationQueue.add(
            {
                orderId: data.id
            },
            {
                delay
            });
        msg.ack();
    }
}