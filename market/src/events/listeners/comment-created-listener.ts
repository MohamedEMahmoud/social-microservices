import { Listener, Subjects, CommentCreatedEvent } from "@mesocial/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Product } from "../../model/product.model";
import { ProductUpdatedPublisher } from "../publishers/product-updated-publisher";

export class CommentCreatedListener extends Listener<CommentCreatedEvent> {
    readonly subject = Subjects.CommentCreated;
    queueGroupName = queueGroupName;
    async onMessage(data: CommentCreatedEvent["data"], msg: Message) {
        if (data.productId) {
            const product = await Product.findById(data.productId);

            if (!product) {
                throw new Error("Product not found");
            }

            product.comments = [...product.comments, data.id];

            const productData = await product.save();

            if (productData) {
                await new ProductUpdatedPublisher(this.client).publish({
                    id: productData.id,
                    commentArrayLength: productData.comments.length,
                    commentId: data.id,
                    version: productData.version
                });
            }
        }

        msg.ack();
    }
}