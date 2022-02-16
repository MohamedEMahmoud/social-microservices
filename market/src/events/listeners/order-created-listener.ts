import { Listener, Subjects, OrderCreatedEvent } from "@mesocial/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Product } from "../../model/product.model";
import { ProductUpdatedPublisher } from "../publishers/product-updated-publisher";
export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName;
    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {

        const product = await Product.findById(data.product.id);
        if (!product) {
            throw new Error("Product Not Found");
        }
        product.set({
            orderId: data.id
        });
        await product.save();

        await new ProductUpdatedPublisher(this.client).publish({
            id: product.id,
            merchantId: product.merchantId,
            images: product.images,
            content: product.content,
            version: product.version,
            price: product.price,
            orderId: product.orderId
        });

        msg.ack();
    }
}