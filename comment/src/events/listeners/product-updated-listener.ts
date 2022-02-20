import { Listener, ProductUpdatedEvent, Subjects } from "@mesocial/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Product } from "../../models/product.model";

export class ProductUpdatedListener extends Listener<ProductUpdatedEvent>{
    readonly subject = Subjects.ProductUpdated;
    queueGroupName = queueGroupName;
    async onMessage(data: ProductUpdatedEvent["data"], msg: Message) {

        const product = await Product.findById(data.id);

        if (!product) {
            throw new Error("Product Not Found");
        }

        if (data.commentId && data.commentArrayLength) {
            if (product.comments.length > Number(data.commentArrayLength)) {
                product.comments = product.comments.filter(comment => comment !== data.commentId);
            } else {
                product.comments = [...product.comments, String(data.commentId)];
            }
        }

        await product.save();

        msg.ack();

    }
}
