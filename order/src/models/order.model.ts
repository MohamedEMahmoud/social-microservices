import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "@mesocial/common";
import { ProductDoc } from "./product.model";

interface OrderAttrs {
    userId: string;
    expiresAt: string;
    status: OrderStatus;
    product: ProductDoc;
}

interface OrderDoc extends mongoose.Document {
    userId: string;
    expiresAt: string;
    status: OrderStatus;
    product: ProductDoc;
    version: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    expiresAt: {
        type: String
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.created
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    },
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

orderSchema.set("versionKey", "version");

orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => new Order(attrs);

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order, OrderStatus };