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

        const fields: { [key: string]: any; } = { ...data };

        delete fields["version"];

        product.set({ ...fields });


        await product.save();

        msg.ack();

    }
}
