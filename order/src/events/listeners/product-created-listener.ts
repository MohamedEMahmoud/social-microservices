import { Listener, ProductCreatedEvent, Subjects } from "@mesocial/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Product } from "../../models/product.model";
export class ProductCreatedListener extends Listener<ProductCreatedEvent> {
    readonly subject = Subjects.ProductCreated;
    queueGroupName = queueGroupName;
    async onMessage(data: ProductCreatedEvent["data"], msg: Message) {

        const product = Product.build({
            id: data.id,
            images: data.images,
            content: data.content,
            price: data.price,
        });

        await product.save();

        msg.ack();
    }

}